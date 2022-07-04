const db = require("../models");
const Users = db.users;
const crypto = require("crypto");
const User_profile = db.user_profile;
const User_social_ext = db.user_social_ext;
const Posts = db.user_content_post;
const adminSetting = db.admin_setting;
const mail_templates = db.mail_templates;
const accountBalance = db.account_balance;
const ledgerTransactions = db.ledger_transactions;
const mandrillapp = require("../middleware/mandrillapp.js");
const mailer = require("../middleware/mailer.js");
const Op = db.Sequelize.Op;
const upload = require("../middleware/upload");
const audit_log = db.audit_log;
const common = require("../common");
const logger = require("../middleware/logger");
const userFF = db.user_fan_following;
const Cryptr = require("cryptr");
const cryptr = new Cryptr("socialappAPI");
const { QueryTypes } = require("sequelize");

exports.fetchCmsDetails = async (req, res) => {
  let userIDs = req.body.userIDs;
  var level_options = {
    include: [
      {
        model: db.level_task,
      },
    ],
    where: {
      task_user_id: { [Op.or]: userIDs },
    },
  };
  const user_level_listing = await db.user_level_task_action.findAll(
    level_options
  );

  var video_add_options = {
    include: [
      {
        model: db.watch_ads_task,
      },
    ],
    where: {
      u_id: { [Op.or]: userIDs },
    },
  };
  const video_add_listing = await db.watch_ads_task_submit.findAll(
    video_add_options
  );

  var videoAddIds = {};
  if (video_add_listing.length) {
    video_add_listing.forEach((element) => {
      if (!videoAddIds[element.video_ad.cr_co_id]) {
        videoAddIds[element.video_ad.cr_co_id] = [];
      }
      videoAddIds[element.video_ad.cr_co_id].push(element);
    });
  }
  var bonus_reward_options = {
    include: [
      {
        model: db.bonus_item,
      },
    ],
    where: {
      bonus_rewards_usrid: { [Op.or]: userIDs },
    },
  };
  const bonus_rewards_listing = await db.bonus_rewards.findAll(
    bonus_reward_options
  );
  var bonusRewardIds = {};
  if (bonus_rewards_listing.length) {
    bonus_rewards_listing.forEach((element) => {
      if (!bonusRewardIds[element.bonus_item.bonus_item_brand_id]) {
        bonusRewardIds[element.bonus_item.bonus_item_brand_id] = [];
      }
      bonusRewardIds[element.bonus_item.bonus_item_brand_id].push(element);
    });
  }

  var survey_options = {
    include: [
      {
        model: db.survey,
        attributes: ["sr_id", "sr_brand_id"],
      },
    ],
    attributes: ["sr_id", "sr_completed"],
    where: {
      sr_uid: { [Op.or]: userIDs },
    },
  };
  const survey_listing = await db.survey_user_complete.findAll(survey_options);

  var bonus_task_options = {
    where: {
      bonus_task_usr_id: { [Op.or]: userIDs },
    },
  };
  const bonus_task_listing = await db.bonus_task.findAll(bonus_task_options);
  var brandBonusTaskIncompleteIds = {};
  var brandBonusTaskCompleteIds = {};
  if (bonus_task_listing.length) {
    bonus_task_listing.forEach((element) => {
      if (!brandBonusTaskIncompleteIds[element.bonus_task_brand_id]) {
        brandBonusTaskIncompleteIds[element.bonus_task_brand_id] = [];
      }
      if (!brandBonusTaskCompleteIds[element.bonus_task_brand_id]) {
        brandBonusTaskCompleteIds[element.bonus_task_brand_id] = [];
      }
      if (element.bonus_task_is_finished == "1") {
        brandBonusTaskCompleteIds[element.bonus_task_brand_id].push(element);
      } else {
        brandBonusTaskIncompleteIds[element.bonus_task_brand_id].push(element);
      }
    });
  }
  var reward_given_options = {
    include: [
      {
        model: db.reward_center,
      },
    ],
    where: {
      rewards_award_user_id: { [Op.or]: userIDs },
    },
  };
  const reward_given_listing = await db.rewards_given.findAll(
    reward_given_options
  );

  const User = await Users.findOne({
    include: [
      {
        model: db.user_content_post,
        attributes: [
          "ucpl_content_data",
          ["ucpl_id", "post_id"],
          "ta_task_id",
          "ucpl_content_type",
          "upcl_brand_details",
          "ucpl_created_at",
        ],
        required: false,
        include: [
          {
            model: db.post_comment,
            required: false,
            where: {
              pc_commenter_uid: {
                [Op.not]: { [Op.or]: userIDs },
              },
            },
          },
        ],
        where: {
          ucpl_status: 1,
        },
        // limit: pageSize,
        // offset: skipCount,
        order: [["ucpl_id", "DESC"]],
      },
    ],
    attributes: [
      "u_id",
      "u_login",
      "u_referer_id",
      "u_acct_type",
      "u_act_sec",
      "u_email",
      "u_active",
      "u_pref_login",
      "u_created_at",
      "u_updated_at",
      "u_email_verify_status",
      "is_user_deactivated",
      "is_user_hidden",
      //[db.sequelize.literal('(SELECT SUM(bonus_usr_riddim_level) FROM bonus_usr WHERE bonus_usr.bonus_usr_id = '+userID+'  )'), 'Riddim Level'],
      [db.sequelize.literal("0"), "Tickets Earned"],
      [db.sequelize.literal("0"), "Presents Earned"],
      [db.sequelize.literal("0"), "Lottery Wheels"],
      [db.sequelize.literal("0"), "Easter Eggs"],
      [db.sequelize.literal("0"), "Chests Earned"],
      [
        db.sequelize.literal(
          `(SELECT COUNT(*) FROM bonus_rewards WHERE bonus_rewards.bonus_rewards_usrid in ${userIDs})`
        ),
        "Bonuses Won",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM bonus_task WHERE bonus_task.bonus_task_usr_id = " +
            userID +
            " and bonus_task_is_finished = 1 )"
        ),
        "Bonus Tasks Completed",
      ],
      [db.sequelize.literal("0"), "Tasks Entered"],
      [db.sequelize.literal("0"), "Contests Entered"],
      [db.sequelize.literal("0"), "Content Entered"],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM survey_user_complete WHERE survey_user_complete.sr_uid = " +
            userID +
            ")"
        ),
        "Surveys",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM user_fan_following WHERE user_fan_following.faf_by = " +
            userID +
            ")"
        ),
        "Following",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM user_fan_following WHERE user_fan_following.faf_to = " +
            userID +
            ")"
        ),
        "Followers",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM watch_ads_task_submit WHERE watch_ads_task_submit.u_id = " +
            userID +
            " and watch_ads_task_submit.u_id = user_login.u_id )"
        ),
        "Ads Watched",
      ],
      [
        db.sequelize.literal(
          "(SELECT SUM(pc_comment_likes) FROM post_comment WHERE post_comment.pc_commenter_uid = " +
            userID +
            "  )"
        ),
        "Liked Comments",
      ],
      [
        db.sequelize.literal(
          "(SELECT SUM(pc_comment_unlikes) FROM post_comment WHERE post_comment.pc_commenter_uid = " +
            userID +
            "  )"
        ),
        "Disliked Comments",
      ],
      [
        db.sequelize.literal(
          "(SELECT SUM(ucpl_reaction_counter) FROM user_content_post WHERE user_content_post.ucpl_u_id = " +
            userID +
            "  )"
        ),
        "Reactions Received",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM post_user_reactions WHERE post_user_reactions.u_id = " +
            userID +
            ")"
        ),
        "Reactions Given",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM content_report WHERE content_report.content_report_owner_id = " +
            userID +
            ")"
        ),
        "Reported Content",
      ],
      [db.sequelize.literal("0"), "Number of Brands"],
      [db.sequelize.literal("0"), "Tier 2 Sent"],
      [db.sequelize.literal("0"), "Tier 2 Incomplete"],
      [db.sequelize.literal("0"), "Tier 2 Declined"],
      [db.sequelize.literal("0"), "Tier 2 Completed"],
      [db.sequelize.literal("0"), "Tier 3 Completed"],
      [db.sequelize.literal("0"), "Tier 3 Sent"],
      [db.sequelize.literal("0"), "Tier 3 Incomplete"],
      [db.sequelize.literal("0"), "Tier 3 Declined"],
      [db.sequelize.literal("0"), "Tier 3 Completed"],
      [db.sequelize.literal("null"), "Brands Participated"],
    ],
    where: {
      u_id: userID,
      is_user_hidden: 0,
    },
  });
  if (!User) {
    // res.status(500).send({
    //   message: "User not found",
    // });
    return {};
  }
  if (User && User.is_user_deactivated == 1) {
    // res.status(500).send({
    //   message: "User Is deactivated",
    // });
    return {};
  }
  if (User && User.u_active != true) {
    // res.status(500).send({
    //   message: "User details not found",
    // });
    return {};
  }
  let [
    taskLevelTwoCount,
    tasklevelTwoDecline,
    taskLevelThreeCount,
    tasklevelThreeDecline,
  ] = [[], [], [], []];
  let [
    tasklevelTwoComplete,
    tasklevelThreeComplete,
    tasklevelTwoInComplete,
    tasklevelThreeInComplete,
  ] = [[], [], [], []];
  var taskLevelBrandTwoCount = {};
  var taskLevelBrandThreeCount = {};
  var tasklevelBrandTwoDecline = {};
  var tasklevelBrandThreeDecline = {};
  var tasklevelBrandTwoComplete = {};
  var tasklevelBrandThreeComplete = {};
  var tasklevelBrandTwoInComplete = {};
  var tasklevelBrandThreeInComplete = {};
  if (user_level_listing.length) {
    for (const user_level_key in user_level_listing) {
      var brand_id = user_level_listing[user_level_key].level_task.brand_id;
      var task_id = user_level_listing[user_level_key].task_id;
      if (user_level_listing[user_level_key].level_task.task_level == 2) {
        if (!taskLevelBrandTwoCount[brand_id]) {
          taskLevelBrandTwoCount[brand_id] = [];
        }
        taskLevelTwoCount.push(task_id);
        taskLevelBrandTwoCount[brand_id].push(task_id);
        if (user_level_listing[user_level_key].user_cta_action == 0) {
          // decline
          if (!tasklevelBrandTwoDecline[brand_id]) {
            tasklevelBrandTwoDecline[brand_id] = [];
          }
          tasklevelTwoDecline.push(task_id);
          tasklevelBrandTwoDecline[brand_id].push(task_id);
        } else if (user_level_listing[user_level_key].user_cta_action == 1) {
          // accept
          if (!tasklevelBrandTwoComplete[brand_id]) {
            tasklevelBrandTwoComplete[brand_id] = [];
          }
          tasklevelTwoComplete.push(task_id);
          tasklevelBrandTwoComplete[brand_id].push(task_id);
        }
        if (
          user_level_listing[user_level_key].user_cta_action == 1 &&
          user_level_listing[user_level_key].task_status == 0
        ) {
          if (!tasklevelBrandTwoInComplete[brand_id]) {
            tasklevelBrandTwoInComplete[brand_id] = [];
          }
          tasklevelTwoInComplete.push(task_id);
          tasklevelBrandTwoInComplete[brand_id].push(task_id);
        }
      } else if (
        user_level_listing[user_level_key].level_task.task_level == 3
      ) {
        if (!taskLevelBrandThreeCount[brand_id]) {
          taskLevelBrandThreeCount[brand_id] = [];
        }
        taskLevelThreeCount.push(task_id);
        taskLevelBrandThreeCount[brand_id].push(task_id);

        if (user_level_listing[user_level_key].user_cta_action == 0) {
          if (!tasklevelBrandThreeDecline[brand_id]) {
            tasklevelBrandThreeDecline[brand_id] = [];
          }
          tasklevelThreeDecline.push(task_id);
          tasklevelBrandThreeDecline[brand_id].push(task_id);
        } else if (user_level_listing[user_level_key].user_cta_action == 1) {
          // accept
          if (!tasklevelBrandThreeComplete[brand_id]) {
            tasklevelBrandThreeComplete[brand_id] = [];
          }
          tasklevelThreeComplete.push(task_id);
          tasklevelBrandThreeComplete[brand_id].push(task_id);
        }
        if (
          user_level_listing[user_level_key].user_cta_action == 1 &&
          user_level_listing[user_level_key].task_status == 0
        ) {
          if (!tasklevelBrandThreeInComplete[brand_id]) {
            tasklevelBrandThreeInComplete[brand_id] = [];
          }
          tasklevelThreeInComplete.push(task_id);
          tasklevelBrandThreeInComplete[brand_id].push(task_id);
        }
      }
    }

    User["dataValues"]["Tier 2 Sent"] = taskLevelTwoCount.length;
    User["dataValues"]["Tier 3 Sent"] = taskLevelThreeCount.length;
    User["dataValues"]["Tier 2 Incomplete"] = tasklevelTwoInComplete.length;
    User["dataValues"]["Tier 3 Incomplete"] = tasklevelThreeInComplete.length;
    User["dataValues"]["Tier 2 Completed"] = tasklevelTwoComplete.length;
    User["dataValues"]["Tier 3 Completed"] = tasklevelThreeComplete.length;
    User["dataValues"]["Tier 2 Declined"] = tasklevelTwoDecline.length;
    User["dataValues"]["Tier 3 Declined"] = tasklevelThreeDecline.length;
  }
  // return res.status(200).send({
  //     reward_given_listing: reward_given_listing
  // });
  var rewardBrandTokens = {};
  var rewardBrandStars = {};
  if (reward_given_listing.length) {
    var easterEgg = [];
    var present = [];
    var chest = [];
    var lotteryWheel = [];
    for (const reward_given_key in reward_given_listing) {
      var reward_listing = reward_given_listing[reward_given_key];
      if (!rewardBrandTokens[reward_listing.rewards_brand_id]) {
        rewardBrandTokens[reward_listing.rewards_brand_id] = [];
      }
      if (!rewardBrandStars[reward_listing.rewards_brand_id]) {
        rewardBrandStars[reward_listing.rewards_brand_id] = [];
      }
      rewardBrandTokens[reward_listing.rewards_brand_id].push(
        reward_listing.rewards_award_token
      );
      rewardBrandStars[reward_listing.rewards_brand_id].push(
        reward_listing.rewards_award_stars
      );
      if (reward_listing.reward_center != undefined) {
        if (reward_listing.reward_center.reward_center_reward_type == 0) {
          easterEgg.push(reward_listing.rewards_award_id);
        } else if (
          reward_listing.reward_center.reward_center_reward_type == 1
        ) {
          present.push(reward_listing.rewards_award_id);
        } else if (
          reward_listing.reward_center.reward_center_reward_type == 2
        ) {
          chest.push(reward_listing.rewards_award_id);
        } else if (
          reward_listing.reward_center.reward_center_reward_type == 3
        ) {
          lotteryWheel.push(reward_listing.rewards_award_id);
        }
      }
    }
    User["dataValues"]["Easter Eggs"] = easterEgg.length;
    User["dataValues"]["Presents Earned"] = present.length;
    User["dataValues"]["Chests Earned"] = chest.length;
    User["dataValues"]["Lottery Wheels"] = lotteryWheel.length;
  }
  var brandSurveyIds = {};
  if (survey_listing.length) {
    for (const survey_listing_Key in survey_listing) {
      const survey_brand_id =
        survey_listing[survey_listing_Key].dataValues.survey.sr_brand_id;
      if (!brandSurveyIds[survey_brand_id]) {
        brandSurveyIds[survey_brand_id] = [];
      }
      brandSurveyIds[survey_brand_id].push(survey_listing[survey_listing_Key]);
    }
  }
  if (User.user_content_posts.length) {
    let [taskIds, contestIds, contentData, brandIds, brandNames, brandData] = [
      [],
      [],
      [],
      [],
      [],
      [],
    ];
    var userContentPosts = User.user_content_posts;
    var brandContent = {};
    var brandTaskIds = {};
    var brandContestIds = {};
    var brandCommentData = {};

    userContentPosts.forEach((element) => {
      contentData.push(element.ta_task_id);
      if (!brandTaskIds[element.upcl_brand_details.id]) {
        brandTaskIds[element.upcl_brand_details.id] = [];
      }
      if (!brandContestIds[element.upcl_brand_details.id]) {
        brandContestIds[element.upcl_brand_details.id] = [];
      }
      if (element.ucpl_content_type == "1") {
        taskIds.push(element.ta_task_id);
        brandTaskIds[element.upcl_brand_details.id].push(element.ta_task_id);
      } else if (element.ucpl_content_type == 2) {
        contestIds.push(element.ta_task_id);
        brandContestIds[element.upcl_brand_details.id].push(element.ta_task_id);
      }
      if (element.upcl_brand_details) {
        brandIds.push(element.upcl_brand_details.id);
        brandNames.push(element.upcl_brand_details.name);
        brandData[element.upcl_brand_details.id] =
          element.upcl_brand_details.name;
      }
      if (!brandContent[element.upcl_brand_details.id]) {
        brandContent[element.upcl_brand_details.id] = [];
      }
      brandContent[element.upcl_brand_details.id].push(element);
      if (!brandCommentData[element.upcl_brand_details.id]) {
        brandCommentData[element.upcl_brand_details.id] = [];
      }
      if (element.post_comments.length) {
        brandCommentData[element.upcl_brand_details.id].push(
          element.post_comments
        );
      }
    });
    if (brandIds.length) {
      var brandUniqueIds = brandIds.filter((v, i, a) => a.indexOf(v) === i);
      User["dataValues"]["Number of Brands"] = brandUniqueIds.length;
      var brandDetail = {};
      for (const brandUniqueKey in brandUniqueIds) {
        var brand_id = brandUniqueIds[brandUniqueKey];
        var brand_name = brandData[brand_id];
        console.log(brand_name);
        brandDetail[brand_name] = {};
        brandDetail[brand_name]["Brand Id"] = brand_id;
        brandDetail[brand_name]["User Reach"] = 0;
        brandDetail[brand_name]["User Engagment Rate"] = brandCommentData[
          brand_id
        ][0]
          ? brandCommentData[brand_id][0].length
          : 0;
        brandDetail[brand_name]["last participated date"] =
          brandContent[brand_id][0]["ucpl_created_at"];
        brandDetail[brand_name]["Brand Shared"] = 0;
        brandDetail[brand_name]["Tokens Earned"] = rewardBrandTokens[brand_id]
          ? rewardBrandTokens[brand_id].reduce((a, b) => a + b, 0)
          : 0;
        brandDetail[brand_name]["Stars Earned"] = rewardBrandStars[brand_id]
          ? rewardBrandStars[brand_id].reduce((a, b) => a + b, 0)
          : 0;
        brandDetail[brand_name]["Brand Status"] = 0;
        brandDetail[brand_name]["Number Of Brand Task Enteries"] = 0;
        brandDetail[brand_name]["Number of Brand NOT Task Enteries"] = 0;
        brandDetail[brand_name]["Content Tasks Entered"] =
          brandContent[brand_id].length;
        brandDetail[brand_name]["Tasks Entered"] = 0;
        brandDetail[brand_name]["Contest Tasks Entered"] = 0;
        if (brandTaskIds[brand_id].length) {
          //var taskUniqueIds = brandTaskIds[brand_id].filter((v, i, a) => a.indexOf(v) === i);
          brandDetail[brand_name]["Tasks Entered"] =
            brandTaskIds[brand_id].length;
        }
        if (brandContestIds[brand_id].length) {
          //var brandContestUniqueIds = brandContestIds[brand_id].filter((v, i, a) => a.indexOf(v) === i);
          brandDetail[brand_name]["Contest Tasks Entered"] =
            brandContestIds[brand_id].length;
        }
        brandDetail[brand_name]["Surveys Questions tasks"] = brandSurveyIds[
          brand_id
        ]
          ? brandSurveyIds[brand_id].length
          : 0;
        brandDetail[brand_name]["Ads watched"] = videoAddIds[brand_id]
          ? videoAddIds[brand_id].length
          : 0;
        brandDetail[brand_name]["Tickets"] = 0;
        brandDetail[brand_name]["Bonuses Won"] = bonusRewardIds[brand_id]
          ? bonusRewardIds[brand_id].length
          : 0;
        brandDetail[brand_name]["bonus tasks incomplete"] =
          brandBonusTaskIncompleteIds[brand_id]
            ? brandBonusTaskIncompleteIds[brand_id].length
            : 0;
        brandDetail[brand_name]["Bonus task completed"] =
          brandBonusTaskCompleteIds[brand_id]
            ? brandBonusTaskCompleteIds[brand_id].length
            : 0;
        brandDetail[brand_name]["offers sent tier 2"] =
          taskLevelBrandTwoCount && taskLevelBrandTwoCount[brand_id]
            ? taskLevelBrandTwoCount[brand_id].length
            : 0;
        brandDetail[brand_name]["completed tier 2"] =
          tasklevelBrandTwoComplete && tasklevelBrandTwoComplete[brand_id]
            ? tasklevelBrandTwoComplete[brand_id].length
            : 0;
        brandDetail[brand_name]["accepted not completed tier 2"] =
          tasklevelBrandTwoInComplete && tasklevelBrandTwoInComplete[brand_id]
            ? tasklevelBrandTwoInComplete[brand_id].length
            : 0;
        brandDetail[brand_name]["not accepted tier 2 declined"] =
          tasklevelBrandTwoDecline[brand_id]
            ? tasklevelBrandTwoDecline[brand_id].length
            : 0;
        brandDetail[brand_name]["completed tier 3"] =
          tasklevelBrandThreeComplete[brand_id]
            ? tasklevelBrandThreeComplete[brand_id].length
            : 0;
        brandDetail[brand_name]["offers sent tier 3"] =
          taskLevelBrandThreeCount[brand_id]
            ? taskLevelBrandThreeCount[brand_id].length
            : 0;
        brandDetail[brand_name]["accepted not completed tier 3"] =
          tasklevelBrandThreeInComplete[brand_id]
            ? tasklevelBrandThreeInComplete[brand_id].length
            : 0;
        brandDetail[brand_name]["not accepted tier 3 declined"] =
          tasklevelBrandThreeDecline[brand_id]
            ? tasklevelBrandThreeDecline[brand_id].length
            : 0;
      }
      console.log(brandDetail);
      User["dataValues"]["brands"] = brandDetail;
    }
    let totalBrands = Object.keys(brandDetail);
    let totalTokensEarned = 0,
      totalStarsEarned = 0,
      totalUserReach = 0,
      totalEngagementRate = 0;
    if (Object.keys(brandDetail) > 0) {
      for (let brandName in brandDetail) {
        totalTokensEarned += brandDetail[brandName]["Tokens Earned"];
        totalStarsEarned += brandDetail[brandName]["Stars Earned"];

        totalUserReach += brandDetail[brandName]["User Reach"];
        totalEngagementRate += brandDetail[brandName]["User Engagment Rate"];
      }
    }
    User["dataValues"]["total Tokens Earned"] = totalTokensEarned;
    User["dataValues"]["totalTokensEarned"] = totalStarsEarned;
    User["dataValues"]["totalUserReach"] = totalUserReach;
    User["dataValues"]["averageEngagementRate"] =
      totalEngagementRate > 0 && totalBrands > 0
        ? totalEngagementRate / totalBrands
        : 0;
    if (brandNames.length) {
      var brandUniqueNames = brandNames.filter((v, i, a) => a.indexOf(v) === i);
      User["dataValues"]["Brands Participated"] = brandUniqueNames;
    }
    if (taskIds.length) {
      //var taskUniqueIds = taskIds.filter((v, i, a) => a.indexOf(v) === i);
      User["dataValues"]["Tasks Entered"] = taskIds.length;
    }
    if (contestIds.length) {
      //var contestUniqueIds = contestIds.filter((v, i, a) => a.indexOf(v) === i);
      User["dataValues"]["Contests Entered"] = contestIds.length;
    }
    if (contentData.length) {
      User["dataValues"]["Content Entered"] = contentData.length;
    }
  }
  delete User["dataValues"]["user_content_posts"];

  return res.send({
    video_add_listing,
    user_level_listing,
    bonus_rewards_listing,
    bonusRewardIds,
    survey_listing,
    bonus_task_listing,
    reward_given_listing,
    User: User["dataValues"],
  });
};
