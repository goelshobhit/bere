require("dotenv").config({
  path: __dirname + "/../../.env"
});
const appConfig = require("./config/config.js");
const env = process.env.NODE_ENV || "development";
const fs = require("fs");
const twilio = require("twilio")
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_ACCESS_KEY || "sofNialvAUxPiJQZa7PJtIA";
const jwtExpirySeconds = process.env.JWT_KEY_EXPIRY_TIME || "365d";
const db = require("./models");
const tasks_json = db.tasks_json;
const Contest = db.contest_task
const Tasks = db.tasks
const Survey = db.survey;
const accountBalance = db.account_balance;
const Op = db.Sequelize.Op;
const searchUserCount = 8;
const brandscoreIncrease = db.brandscore_increase;
function Common() {
  Common.prototype.mkdirpath = function (dirPath) {
    var dir = dirPath;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    } else {
      console.log("Upload directory " + dirPath + " already exist");
    }
  };
  Common.prototype.taskStatusArr = function () {
    var taskSts = {
      0: "Waiting for approval",
      1: "Approved",
      2: "Published",
      3: "Draft",
      4: "Closed",
      5: "Cancelled"
    };
    return taskSts;
  };
  Common.prototype.taskStatusArr = function () {
    var taskSts = {
      0: "Waiting for approval",
      1: "Approved",
      2: "Published",
      3: "Draft",
      4: "Closed",
      5: "Cancelled"
    };
    return taskSts;
  };
  Common.prototype.taskTypesArr = function () {
    var taskTypes = {
      1: "Questions/ instruction",
      2: "Reference Picture",
      3: "Reference video",
      4: "Reference audio"
    };
    return taskTypes;
  };
  Common.prototype.campaignStatusArr = function () {
    var campaignSts = {
      0: "Waiting for approval",
      1: "Approved",
      2: "Published",
      3: "Draft",
      4: "Closed",
      5: "Cancelled"
    };
    return campaignSts;
  };
  // Common.prototype.notifyGrpDelivMethodArr = function() {
  //   var notifyGrpDelivMethods = {
  //       0: "Inbox",
  //       1: "Alert",
  //       3: "Inbox and Alert"
  //     };
  //     return notifyGrpDelivMethods;  
  //   };
  Common.prototype.reportQuestions = function () {
    var questions = {
      1: "Dangerous people",
      2: "Nudity or pornography",
      3: "Harrassment or bullying",
      4: "Hate Speech",
      5: "Self-harm",
      6: "Violence, physical abuse, threats",
      8: "Sale or promotion of firearms",
      9: "Sales or promotion of druge",
      10: "Intellectual property infringement",
      11: "Misleading Information",
      12: "Spam"
    };
    return questions;
  };
  Common.prototype.reactionsEmoji = function () {
    var questions = ["Happy.png", "Crying.png", "Love.png", "Mad.png", "Shocked.png", "Heart.png", "Heart-White.png"];
    return questions;
  };
  Common.prototype.genrateToken = function (user_id) {
    if (!user_id) {
      return res.status(401).end();
    }
    const token = jwt.sign(
      {
        user_id
      },
      jwtKey,
      {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds
      }
    );
    return token;
  };
  Common.prototype.userroleActions = function () {
    var role_actions = {
      "User Rights": [
        {
          "View User": {
            "user/view": "GET/api/admin_users/1"
          }
        },
        {
          "Add User": {
            "user/add": "POST/api/admin_users"
          }
        },
        {
          "Update User": {
            "user/update": "PUT/api/admin_users"
          }
        },
        {
          "All Users": {
            "user/all": "GET/api/admin_users"
          }
        },
        {
          "Delete Users": {
            "user/delete": "DELETE/api/admin_users"
          }
        },
        {
          "Add Search Object": {
            "/search/object": "POST/api/search"
          }
        }
      ],
      "Role Rights": [
        {
          "View Role": {
            "role/view": "GET/api/roles/1"
          }
        },
        {
          "Add Role": {
            "role/add": "POST/api/roles"
          }
        },
        {
          "Update Role": {
            "role/update": "PUT/api/roles"
          }
        },
        {
          "Delete Role": {
            "role/delete": "DELETE/api/roles"
          }
        },
        {
          "All Role": {
            "role/all": "GET/api/roles"
          }
        }
      ],
      "Brand Rights": [
        {
          "View Brand": {
            "brand/view": "GET/api/brand/1"
          }
        },
        {
          "Add Brand": {
            "brand/add": "POST/api/brand"
          }
        },
        {
          "Update Brand": {
            "brand/update": "PUT/api/brand"
          }
        },
        {
          "Delete Brand": {
            "brand/delete": "DELETE/api/brand"
          }
        },
        {
          "All Brand": {
            "brand/all": "GET/api/brand"
          }
        }
      ],
      "Campaign Rights": [
        {
          "Add Campaign": {
            "campaign/add": "POST/api/campaign"
          }
        },
        {
          "View Campaign": {
            "campaign/view": "GET/api/campaign/1"
          }
        },
        {
          "Update Campaign": {
            "campaign/update": "PUT/api/campaign"
          }
        },
        {
          "Delete Campaign": {
            "campaign/delete": "DELETE/api/campaign"
          }
        },
        {
          "All Campaign": {
            "campaign/all": "GET/api/campaign"
          }
        }
      ],
      "Tasks Rights": [
        {
          "View Tasks": {
            "task/view": "GET/api/tasks/1"
          }
        },
        {
          "Add Tasks": {
            "task/add": "POST/api/tasks"
          }
        },
        {
          "Update Tasks": {
            "task/update": "PUT/api/tasks"
          }
        },
        {
          "Delete Tasks": {
            "task/delete": "DELETE/api/tasks"
          }
        },
        {
          "All Tasks": {
            "task/all": "GET/api/tasks"
          }
        }
      ],
      "Admin Rights": [
        {
          "Update Tasks": {
            "setting/update": "PUT/api/admin_setting"
          }
        },
        {
          "All Tasks": {
            "setting/all": "GET/api/admin_setting"
          }
        }
      ]
    };
    return role_actions;
  };
  Common.prototype.getKeys = function (obj, val) {
    var objects = [];
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] == "object") {
        objects = objects.concat(this.getKeys(obj[i], val));
      } else if (obj[i] == val) {
        objects.push(i);
      }
    }
    return objects;
  };
  Common.prototype.imageToken = function (action_id) {
    if (!action_id) {
      return res.status(401).end();
    }
    const token = jwt.sign(
      {
        action_id
      },
      jwtKey,
      {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds
      }
    );
    return token;
  };
  Common.prototype.manageUserAccount = async function (userId, coins, stars, trx_type) { //trx_type = credit,debit
    var userAccount = await accountBalance.findOne({
      where: {
        ac_user_id: userId
      }
    });
    if (userAccount) {
      if (trx_type === 'credit') {
        coins = parseFloat(userAccount.ac_balance) + parseFloat(coins);
        stars = parseFloat(userAccount.ac_balance_stars) + parseFloat(stars);
      } else {
        coins = parseFloat(userAccount.ac_balance) - parseFloat(coins);
        stars = parseFloat(userAccount.ac_balance_stars) - parseFloat(stars);
      }
      /* to resolve nan issue */
      stars = stars || 0;
      coins = coins || 0;
      accountBalance.update({ ac_balance: coins, ac_balance_stars: stars }, {
        where: {
          ac_user_id: userId
        }
      });
      return true;
    } else {
      accountBalance.create({ ac_user_id: userId, ac_balance: coins, ac_balance_stars: stars, ac_account_no: '' });
      return true;
    }
  };
  Common.prototype.jsonTask = function (id, type, actionType) {
    // Single Task
    if (type === 'Single') {
      if (actionType === 'add') {
        Tasks.findOne({
          include: [
            {
              model: db.brands,
              attributes: [["cr_co_id", 'brand_id'], ["cr_co_name", 'brand_name'], ["cr_co_logo_path", 'brand_logo']],
            },
            {
              model: db.campaigns,
              attributes: [["cp_campaign_name", "campaign_name"]],
              include: [{
                model: db.brands,
                attributes: [["cr_co_id", 'brand_id'], ["cr_co_name", 'brand_name'], ["cr_co_logo_path", 'brand_logo']],
              }]
            },
            {
              model: db.user_content_post,
              attributes: [["ucpl_id", "post_id"], ['ucpl_content_data', 'post_data']],
              required: false,
              where: {
                ucpl_added_by: 0,
                ucpl_status: 1
              },
              order: [
                ['ucpl_id', 'DESC']
              ]
            }
          ],
          where: {
            ta_task_id: id
          }
        }).then(function (result) {
          var add_data = {
            "tj_type": type,
            "tj_task_id": id,
            "tj_data": result,
            "tj_status": result.dataValues.ta_status
          };
          tasks_json.create(add_data);
        });
      } else {
        Tasks.findOne({
          include: [
            {
              model: db.brands,
              attributes: [["cr_co_id", 'brand_id'], ["cr_co_name", 'brand_name'], ["cr_co_logo_path", 'brand_logo']],
            },
            {
              model: db.campaigns,
              attributes: [["cp_campaign_name", "campaign_name"]],
              include: [{
                model: db.brands,
                attributes: [["cr_co_id", 'brand_id'], ["cr_co_name", 'brand_name'], ["cr_co_logo_path", 'brand_logo']],
              }]
            },
            {
              model: db.user_content_post,
              attributes: [["ucpl_id", "post_id"], ['ucpl_content_data', 'post_data']],
              required: false,
              where: {
                ucpl_added_by: 0,
                ucpl_status: 1
              },
              order: [
                ['ucpl_id', 'DESC']
              ]
            }
          ],
          where: {
            ta_task_id: id
          }
        }).then(function (result) {
          var update_data = {
            "tj_data": result,
            "tj_status": result.dataValues.ta_status
          };
          tasks_json.update(update_data, {
            where: {
              tj_task_id: id
            }
          });
        });
      }
    }
    // end of Single Task 
    // Contest Task
    if (type === 'Contest') {
      if (actionType === 'add') {
        Contest.findOne({
          include: [
            {
              model: db.campaigns,
              attributes: [["cp_campaign_name", "campaign_name"]],
              include: [{
                model: db.brands,
                attributes: [["cr_co_id", 'brand_id'], ["cr_co_name", 'brand_name'], ["cr_co_logo_path", 'brand_logo']],
              }]
            },
            {
              model: db.user_content_post,
              attributes: [["ucpl_id", "post_id"], ['ucpl_content_data', 'post_data']],
              required: false,
              where: {
                ucpl_added_by: 0,
                ucpl_status: 1
              },
              order: [
                ['ucpl_id', 'DESC']
              ]
            }
          ],
          attributes: [
            ["ct_do", "ta_do"], ["ct_desc", "ta_desc"], ["ct_name", "ta_name"], ["ct_type", "ta_type"], ["ct_sound", "ta_sound"],
            ["ct_status", "ta_status"], ["ct_dont_do", "ta_dont_do"], ["ct_hashtag", "ta_hashtag"], ["ct_id", "ta_task_id"], ["ct_end_date", "ta_end_date"], ["ct_mentioned", "ta_mentioned"], ["ct_created_at", "ta_created_at"], ["ct_start_date", "ta_start_date"], ["ct_updated_at", "ta_updated_at"], ["cp_campaign_id", "cp_campaign_id"], ["ct_header_image", "ta_header_image"], ["ct_token_budget", "ta_token_budget"], ["ct_estimated_user", "ta_estimated_user"], ["ct_insta_question", "ta_insta_question"], ["ct_budget_per_user", "ta_budget_per_user"], ["ct_stars_per_user", "ta_stars_per_user"], ["ct_oneline_summary", "ta_oneline_summary"], ["ct_videos_required", "ta_videos_required"], ["ct_contiue_spend_budget", "ta_contiue_spend_budget"], ["ct_bonus_rewards_benefits", "ta_bonus_rewards_benefits"], ["ct_post_insp_image", "ta_post_insp_image"], ["ct_photos_required", "ta_photos_required"], "ct_start_voting_date", "ct_end_voting_date", "ct_winner_date", "ct_winner_token", ["ct_total_available", "ta_total_available"]
          ],
          where: {
            ct_id: id
          }
        }).then(function (result) {
          var add_data = {
            "tj_type": type,
            "tj_task_id": id,
            "tj_data": result,
            "tj_status": result.dataValues.ta_status
          };
          tasks_json.create(add_data);
        });
      } else {
        Contest.findOne({
          include: [
            {
              model: db.campaigns,
              attributes: [["cp_campaign_name", "campaign_name"]],
              include: [{
                model: db.brands,
                attributes: [["cr_co_id", 'brand_id'], ["cr_co_name", 'brand_name'], ["cr_co_logo_path", 'brand_logo']],
              }]
            },
            {
              model: db.user_content_post,
              attributes: [["ucpl_id", "post_id"], ['ucpl_content_data', 'post_data']],
              required: false,
              where: {
                ucpl_added_by: 0,
                ucpl_status: 1
              },
              order: [
                ['ucpl_id', 'DESC']
              ]
            }
          ],
          attributes: [
            ["ct_do", "ta_do"], ["ct_desc", "ta_desc"], ["ct_name", "ta_name"], ["ct_type", "ta_type"], ["ct_sound", "ta_sound"],
            ["ct_status", "ta_status"], ["ct_dont_do", "ta_dont_do"], ["ct_hashtag", "ta_hashtag"], ["ct_id", "ta_task_id"], ["ct_end_date", "ta_end_date"], ["ct_mentioned", "ta_mentioned"], ["ct_created_at", "ta_created_at"], ["ct_start_date", "ta_start_date"], ["ct_updated_at", "ta_updated_at"], ["cp_campaign_id", "cp_campaign_id"], ["ct_header_image", "ta_header_image"], ["ct_token_budget", "ta_token_budget"], ["ct_estimated_user", "ta_estimated_user"], ["ct_insta_question", "ta_insta_question"], ["ct_budget_per_user", "ta_budget_per_user"], ["ct_stars_per_user", "ta_stars_per_user"], ["ct_oneline_summary", "ta_oneline_summary"], ["ct_videos_required", "ta_videos_required"], ["ct_contiue_spend_budget", "ta_contiue_spend_budget"], ["ct_bonus_rewards_benefits", "ta_bonus_rewards_benefits"], ["ct_post_insp_image", "ta_post_insp_image"], ["ct_photos_required", "ta_photos_required"], "ct_start_voting_date", "ct_end_voting_date", "ct_winner_date", "ct_winner_token", ["ct_total_available", "ta_total_available"]
          ],
          where: {
            ct_id: id
          }
        }).then(function (result) {
          var update_data = {
            "tj_data": result,
            "tj_status": result.dataValues.ta_status
          };
          tasks_json.update(update_data, {
            where: {
              tj_task_id: id
            }
          }).catch(err => {
            console.log(err)
          });
        });
      }
    }
    // Single Task
    if (type === 'Survey') {
      type = 'Single';
      if (actionType === 'add') {
        Survey.findOne({
          include: [
            {
              model: db.brands,
              attributes: [["cr_co_id", 'brand_id'], ["cr_co_name", 'brand_name'], ["cr_co_logo_path", 'brand_logo']]
            }
          ],
          where: {
            sr_id: id
          }
        }).then(function (result) {
          result.dataValues.campaign = {};
          result.dataValues.campaign.brand = result.dataValues.brand;
          delete result.dataValues.brand;
          result.dataValues.surveyId = result.dataValues.sr_id;
          result.dataValues.ta_name = result.dataValues.sr_title;
          result.dataValues.ta_type = "5";
          result.dataValues.ta_start_date = result.dataValues.sr_startdate_time;
          result.dataValues.ta_end_date = result.dataValues.sr_enddate_time;
          var add_data = {
            "tj_type": type,
            "tj_task_id": id,
            "tj_data": result,
            "tj_status": result.dataValues.sr_status
          };
          tasks_json.create(add_data);
        });
      } else {
        Survey.findOne({
          include: [
            {
              model: db.brands,
              attributes: [["cr_co_id", 'brand_id'], ["cr_co_name", 'brand_name'], ["cr_co_logo_path", 'brand_logo']]
            }
          ],
          where: {
            sr_id: id
          }
        }).then(function (result) {
          result.dataValues.campaign = {};
          result.dataValues.campaign.brand = result.dataValues.brand;
          delete result.dataValues.brand;
          result.dataValues.surveyId = result.dataValues.sr_id;
          result.dataValues.ta_type = "5";
          result.dataValues.ta_name = result.dataValues.sr_title;
          result.dataValues.ta_start_date = result.dataValues.sr_startdate_time;
          result.dataValues.ta_end_date = result.dataValues.sr_enddate_time;
          var update_data = {
            "tj_data": result,
            "tj_status": result.dataValues.sr_status
          };
          tasks_json.update(update_data, {
            where: {
              tj_task_id: id
            }
          });
        });
      }
    }
    // end of Single Task 
  };
  /*
  brandScore Detail will be like below
  var brandscoreDetail = {
    "task_id": req.body["Task id"],
    "user_total": user_total,
    "user_id": userId,
    "event_type": 'Task',
    "event_hashtag": req.body["Post hashtags"],
    "engagement_type": 'Post',
    "brand_id": BrandDetails.cr_co_id
  };
   */
  Common.prototype.updateBrandscore = async function (brandscoreDetail) {
    let engagementTypeDetails = await db.brandscore_engagement_type.findOne({
      include: [{
        model: db.brandscore_engagement_settings
      }],
      where: {
        engagement_type: brandscoreDetail.engagement_type
      }
    });
    var engagement_level = [];
    var engagement_level_details = {};
    if (engagementTypeDetails.brandscore_engagement_settings.length) {
      var brandscore_engagement_settings = engagementTypeDetails.brandscore_engagement_settings;
      for (const brandscore_engagement_settings_key in brandscore_engagement_settings) {
        if (brandscore_engagement_settings[brandscore_engagement_settings_key].engagement_level <= brandscoreDetail.user_total) {
          engagement_level.push(brandscore_engagement_settings[brandscore_engagement_settings_key].engagement_level);
          engagement_level_details[brandscore_engagement_settings[brandscore_engagement_settings_key].engagement_level] = brandscore_engagement_settings[brandscore_engagement_settings_key].brand_score;
        }
      }
      let scoreIncreaseDetails = await db.brandscore_increase.findOne({
        where: {
          event_id: brandscoreDetail.task_id,
          event_type: brandscoreDetail.event_type,
          user_id: brandscoreDetail.user_id,
          event_engagement_id: engagementTypeDetails.engagement_id
        }
      });
      var engagementMaxlevel = Math.max.apply(null, engagement_level);
      if (engagement_level_details[engagementMaxlevel] != undefined) {
        var brandScore = engagement_level_details[engagementMaxlevel];
        const brandScoreIncreaseData = {
          "brand_id": brandscoreDetail.brand_id,
          "user_id": brandscoreDetail.user_id,
          "event_id": brandscoreDetail.task_id,
          "event_type": brandscoreDetail.event_type,
          "event_hashtag": brandscoreDetail.event_hashtag,
          "event_engagement_id": engagementTypeDetails.engagement_id,
          "platform_id": 1,
          "brandscore_user_score_increase": brandScore
        }
        if (scoreIncreaseDetails) {
          brandscoreIncrease.update(brandScoreIncreaseData, {
            where: {
              brandscore_increase_id: scoreIncreaseDetails.brandscore_increase_id
            }
          })

        } else {
          brandscoreIncrease.create(brandScoreIncreaseData);
        }
      }
    }

  };

  Common.prototype.sendSMS = function (phone, msg) {
    const accID = process.env.TWILIO_ACC_ID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_FROM;
    console.log("Inside Send SMS Call: " + accID)
    console.log("Inside Send SMS Call: " + authToken)
    console.log("Inside Send SMS Call: " + fromPhone)
    var client = new twilio(accID, authToken);
    client.messages
      .create({
        body: msg,
        from: fromPhone,
        to: phone
      })
      .then(message =>
        console.log(message.sid)
      );

  };
  Common.prototype.searchObject = function () {
    return {
      "Profile": 'profile',
      "Comments": 'comments',
      "Tasks": 'tasks',
      "TasksJson": 'tasksjson',
      "Survey": "survey",
      "Quizes": "quizes",
      "Contest": "contest",
      "Brand": "brand",
      "Hashtags": "hashtags"
    }
  };

  Common.prototype.searchUserCount = function () {
    return 7;
  };
  Common.prototype.getContentReportUser = async function (contentReportTypes, UserId) {
    var reportOptions = {
      attributes: ["content_report_type_id", "content_report_type"],
      where: {
        content_report_type: contentReportTypes,
        content_report_uid: UserId,
        cru_status: 1
      }
    };
    return await db.content_report_user.findAll(reportOptions);
  };

  Common.prototype.contentReportTypes = function () {
    return {
      User: [{
        id: 'u_id',
        db: db.users
      },
      {
        id: 'u_id',
        db: db.user_profile
      }],
      Task: [{
        id: 'ta_task_id',
        db: db.tasks
      }, {
        id: 'tj_task_id',
        db: db.tasks_json
      }],
      Brand: [{
        id: 'cr_co_id',
        db: 'db.brands'
      }],
      Contest: [{
        id: 'ct_id',
        db: db.contest_task
      }],
      Campaign: [{
        id: 'cp_campaign_id',
        db: db.campaigns
      }],
      User_Task_Post: [{
        id: 'ucpl_id',
        db: db.user_content_post
      }],
      Comment: [{
        id: 'pc_post_id',
        db: db.post_comment
      }],
      Post_Report: [{
        id: 'pr_id',
        db: db.post_report
      }]
    }
  };
  Common.prototype.validateSortParameters = function (sortOrder, sortBy) {
    sortOrder = sortOrder.toLowerCase();
    var error_message = '';
  if (sortOrder && sortOrder != 'asc' && sortOrder != 'desc') {
    error_message = 'Invalid sortOrder';
  }
  if (sortBy) {
    var isValid = /^[a-zA-Z0-9,_]*$/.test(sortBy);
    if (!isValid) {
     error_message = 'Invalid sortBy';
    }
    return error_message;
  }
  };

}
module.exports = new Common();
