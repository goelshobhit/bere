const db = require("../models");
const Brand = db.brands
const brands_budget = db.brands_budget
const brandTaskClosed = db.brand_task_closed;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const Op = db.Sequelize.Op;
const common = require("../common");
const taskJson = db.tasks_json
const Task = db.tasks
const sequelize= require('sequelize');
/**
 * Function to add new brand
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
function makeid(length) {
   var result           = '';
   var characters       = '0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

exports.createNewBrand = async(req, res) => {
    const body = req.body;
	if(!req.body["Brand name"]){
	  res.status(500).send({
        msg:
          "Brand Name is required"
      });
	  return;
	}
	var short_name = req.body["Brand name"]
	var co_alias_name = short_name.substring(0,3);
	var BrandDetails = await Brand.findOne({
        where: {
            cr_co_alias: co_alias_name
        },
		attributes: ["cr_co_name"]
    });
	if(BrandDetails){
		var co_alias_name_sec=short_name.substring(0,3)+makeid(1);
	}
    const data = {
        "cr_co_name": body.hasOwnProperty("Brand name") ? req.body["Brand name"] : "",
        "cr_co_address": body.hasOwnProperty("Brand address") ? req.body["Brand address"] : "",
        "cr_co_city": body.hasOwnProperty("Brand city") ? req.body["Brand city"] : "",
        "cr_co_state": body.hasOwnProperty("Brand state") ? req.body["Brand state"] : "",
        "cr_co_country": body.hasOwnProperty("Brand country") ? req.body["Brand country"] : "",
        "cr_co_pincode": body.hasOwnProperty("Pincode") ? req.body["Pincode"] : "",
        "cr_co_phone": body.hasOwnProperty("Phone") ? req.body["Phone"] : "",
        "cr_co_email": body.hasOwnProperty("Email") ? req.body["Email"] : "",
        "cr_co_fb_handle": body.hasOwnProperty("Facbook Handle") ? req.body["Facbook Handle"] : [],
        "cr_co_tw_handle": body.hasOwnProperty("Twitter Handle") ? req.body["Twitter Handle"] : [],
        "cr_co_pint_handle": body.hasOwnProperty("Pintrest Handle") ? req.body["Pintrest Handle"] : [],
        "cr_co_insta_handle": body.hasOwnProperty("Instagram Handle") ? req.body["Instagram Handle"] : [],
        "cr_co_snapchat_handle": body.hasOwnProperty("Snapchat Handle") ? req.body["Snapchat Handle"] : [],
        "cr_co_tiktok_handle": body.hasOwnProperty("Tiktok Handle") ? req.body["Tiktok Handle"] : [],
        "cr_co_who_we_are_looking_for": body.hasOwnProperty("Who We Are looking For") ? req.body["Who We Are looking For"] : "",
        "cr_co_restrictions": body.hasOwnProperty("Brand Restrictions") ? req.body["Brand Restrictions"] : "",
        "cr_co_logo_path": body.hasOwnProperty("Brand Logo") ? req.body["Brand Logo"] : "",
        "cr_co_cover_img_path": body.hasOwnProperty("Cover Image") ? req.body["Cover Image"] : "",
        "cr_co_desc_short": body.hasOwnProperty("Brand Short Description") ? req.body["Brand Short Description"] : "",
        "cr_co_desc_long": body.hasOwnProperty("Long Description") ? req.body["Long Description"] : "",
        "cr_co_website": body.hasOwnProperty("Brand Website") ? req.body["Brand Website"] : [],
        "cr_co_contact_pers": body.hasOwnProperty("Contact Person Name") ? req.body["Contact Person Name"] : "",
        "cr_co_contact_pers_dept": body.hasOwnProperty("Person Department") ? req.body["Person Department"] : "",
        "cr_co_contact_pers_phone_ext": body.hasOwnProperty("Phone Extension") ? req.body["Phone Extension"] : "",
        "cr_co_contact_pers_email": body.hasOwnProperty("Person Email") ? req.body["Person Email"] : "",
        "cr_co_contact_pers_title": body.hasOwnProperty("Person Title") ? req.body["Person Title"] : "",
        "cr_co_contact_pers_industry": body.hasOwnProperty("Person Industry") ? req.body["Person Industry"] : "",
        "cr_co_total_token": body.hasOwnProperty("Total Token") ? req.body["Total Token"] : 0,
        "cr_co_token_spent": 0,
        "cr_co_status": body.hasOwnProperty("Brand Status") ? req.body["Brand Status"] : 0,
		"cr_co_alias": BrandDetails ? co_alias_name_sec : co_alias_name
    }
    Brand.create(data)
    .then(data => {
	 audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','co_reg',data.cr_co_id,data.dataValues);
      res.status(201).send({
		  msg: "Brand Added Successfully",
		  brandID:data.cr_co_id
	  });
    })
    .catch(err => {
    logger.log("error", "Some error occurred while creating the Brand=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Brand."
      });
    });
}

/**
 * Function to get all brands
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.listing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'cr_co_id'
	const sortOrder = req.query.sortOrder || 'DESC'
    var UserId = req.header(process.env.UKEY_HEADER || "x-api-key");
    const contentUserTaskIds = await common.getContentReportUser(['Brand', 'Campaign'], UserId);
    let brandIdsValues = [];
    let CampaignIdsValues = [];
    if (contentUserTaskIds.length) {
        contentUserTaskIds.forEach(element => {
            if (element.content_report_type == 'Brand') {
                brandIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'Campaign') {
                CampaignIdsValues.push(element.content_report_type_id);
            }
          });
    }
    var options = {
        include: [
            {
                model: db.campaigns,
                required: false,
                where:{is_autotakedown:0,
                    cp_campaign_id:{
                        [Op.not]: CampaignIdsValues
                    }}
            },
			{
                model: brands_budget,
				attributes:
                    ["cr_bu_amount", "cr_bu_note","cr_bu_created_at", "token_value_in_usd", "cr_bu_tokens", "cr_bu_updated_at"]
            }
        ],
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if(req.query.sortVal){
        var sortValue=req.query.sortVal.trim();
		options.where = sortValue ? {
            [Op.or]: [{
                cr_co_name: {
                        [Op.iLike]: `%${sortValue}%`
                    }
                }
            ]
        } : null;			
    }
    if (brandIdsValues.length) {
        options['where']['cr_co_id'] = {
                [Op.not]: brandIdsValues
            }
    }
    options['where']['is_autotakedown'] = 0;
    var total = await Brand.count({
        where: options['where']
    });
    const brands_list = await Brand.findAll(options);
    res.status(200).send({
        data: brands_list,
		totalRecords:total
    });
}

/**
 * Function to get all brands
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.brandUsersListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    //const userID = req.params.userID;
    const Uid = req.header(process.env.UKEY_HEADER || "x-api-key");
    options = {
        limit: pageSize,
        offset: skipCount,
        include: [
        {
            required: true,
            model: db.user_content_post,
            attributes: ["ucpl_content_data", ['ucpl_id', 'post_id'], 'ta_task_id', 'ucpl_content_type', 'upcl_brand_details', 'ucpl_created_at'],
           
            where: {
                ucpl_status: 1,
                upcl_brand_details:{
                    id: req.params.brandID
                    }
            },
            include: [
                {
                    model: db.post_comment,
                    required: false
                    // where: {
                    //     pc_commenter_uid: {
                    //         [Op.not]: userID
                    //     }
                    // }
                }
            ],
            order: [
                ['ucpl_id', "DESC"]
            ],
            group: ['ucpl_id']
        }
        ],
        attributes: ["u_id", "u_display_name"
        ],
        where: {
           // u_id: Uid,
            //is_user_hidden: 0
        },
        group: ['u_display_name', "u_id"]
    };
    const userList = await db.user_profile.findAll(options);
    var userIds = [];
    var brandContent = {};
        var brandTaskIds = {};
        var brandContestIds = {};
        var brandCommentData = {};
    if (userList.length) {
        userList.forEach(element => {
            userIds.push(element.u_id);

        let brandData = [];
        var userContentPosts = element.user_content_posts;
        
        var taskUserId = element.u_id;
        if (userContentPosts.length) {
            userContentPosts.forEach(element => {
                if (!brandTaskIds[taskUserId]) {
                    brandTaskIds[taskUserId] = [];
                }
                if (!brandContestIds[taskUserId]) {
                    brandContestIds[taskUserId] = [];
                }
                if (element.ucpl_content_type == '1') {
                    brandTaskIds[taskUserId].push(element.ta_task_id);
                } else if (element.ucpl_content_type == 2) {
                    brandContestIds[taskUserId].push(element.ta_task_id);
                }
                if (element.upcl_brand_details) {
                    brandData[taskUserId] = element.upcl_brand_details.name;
                }
                if (!brandContent[taskUserId]) {
                    brandContent[taskUserId] = [];
                }
                brandContent[taskUserId].push(element);
                if (!brandCommentData[taskUserId]) {
                    brandCommentData[taskUserId] = [];
                }
                if (element.post_comments.length) {
                    brandCommentData[taskUserId].push(element.post_comments);
                }
            });
        }
        

        });
    }
    var videoOptions = {
        include: [
            {
                model: db.video_ads,
                where: {
                    cr_co_id: req.params.brandID
                }
            }
            
        ],
        where: {
            u_id: userIds
        }
    };
    var videoAddCount = {};
    const video_ads_listing = await db.video_ads_submit.findAll(videoOptions);
    if (video_ads_listing.length) {

        for (const video_ad_key in video_ads_listing) {
            var user_id = video_ads_listing[video_ad_key].u_id;
            var video_ads_id = video_ads_listing[video_ad_key].video_ads_id;
            if (!videoAddCount[user_id]) {
                videoAddCount[user_id] = [];
            }
            videoAddCount[user_id].push(video_ads_id);
        }
    }

    var reward_given_options = {
        where: {
            rewards_award_user_id: userIds,
            rewards_brand_id: req.params.brandID
        }
    };
    const reward_given_listing = await db.rewards_given.findAll(reward_given_options);

    var rewardBrandTokens = {};
    var rewardBrandStars = {};
    if (reward_given_listing.length) {
        for (const reward_given_key in reward_given_listing) {
            var reward_listing = reward_given_listing[reward_given_key];
            if (!rewardBrandTokens[reward_listing.rewards_award_user_id]) {
                rewardBrandTokens[reward_listing.rewards_award_user_id] = [];
            }
            if (!rewardBrandStars[reward_listing.rewards_award_user_id]) {
                rewardBrandStars[reward_listing.rewards_award_user_id] = [];
            }
            rewardBrandTokens[reward_listing.rewards_award_user_id].push(reward_listing.rewards_award_token);
            rewardBrandStars[reward_listing.rewards_award_user_id].push(reward_listing.rewards_award_stars);
        }
    }

    var survey_options = {
        include: [
            {
                model: db.survey,
                attributes: ['sr_id', 'sr_brand_id'],
                where: {
                    sr_brand_id: req.params.brandID
                }
            }
        ],
        attributes: ['sr_id', 'sr_completed', 'sr_uid'],
        where: {
            sr_uid: userIds
        }
    };

    var surveyCount = {};
    const survey_listing = await db.survey_user_complete.findAll(survey_options);
    if (survey_listing.length) {

        for (const survey_listing_key in survey_listing) {
            var user_id = survey_listing[survey_listing_key].sr_uid;
            var sr_id = survey_listing[survey_listing_key].sr_id;
            if (!surveyCount[user_id]) {
                surveyCount[user_id] = [];
            }
            surveyCount[user_id].push(sr_id);
        }
    }

    var bonus_reward_options = {
        include: [
            {
                model: db.bonus_item,
                attributes: ['bonus_item_brand_id'],
                where: {
                    bonus_item_brand_id: req.params.brandID
                }
            }
        ],
        attributes: ['bonus_rewards_usrid', 'bonus_rewards_id'],
        where: {
            bonus_rewards_usrid: userIds
        }
    };
    const bonus_rewards_listing = await db.bonus_rewards.findAll(bonus_reward_options);
    var bonusRewardIds = {};
    if (bonus_rewards_listing.length) {
        bonus_rewards_listing.forEach(element => {
            if (!bonusRewardIds[element.bonus_rewards_usrid]) {
                bonusRewardIds[element.bonus_rewards_usrid] = [];
            }
            bonusRewardIds[element.bonus_rewards_usrid].push(element);

        });
    }

    var level_options = {
        include: [
            {
                model: db.level_task,
                where: {
                    brand_id: req.params.brandID
                }
            }
            
        ],
        where: {
            task_user_id: userIds
        }
    };
    const user_level_listing = await db.user_level_task_action.findAll(level_options);
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
            var user_id = user_level_listing[user_level_key].task_user_id;
            var task_id = user_level_listing[user_level_key].task_id;
            if (user_level_listing[user_level_key].level_task.task_level == 2) {
                if (!taskLevelBrandTwoCount[user_id]) {
                    taskLevelBrandTwoCount[user_id] = [];
                }
                taskLevelBrandTwoCount[user_id].push(task_id);
                if (user_level_listing[user_level_key].user_cta_action == 0) { // decline
                    if (!tasklevelBrandTwoDecline[user_id]) {
                        tasklevelBrandTwoDecline[user_id] = [];
                    }
                    tasklevelBrandTwoDecline[user_id].push(task_id);
                } else if (user_level_listing[user_level_key].user_cta_action == 1) { // accept
                    if (!tasklevelBrandTwoComplete[user_id]) {
                        tasklevelBrandTwoComplete[user_id] = [];
                    }
                    tasklevelBrandTwoComplete[user_id].push(task_id);
                }
                if (user_level_listing[user_level_key].user_cta_action == 1 && user_level_listing[user_level_key].task_status == 0) {
                    if (!tasklevelBrandTwoInComplete[user_id]) {
                        tasklevelBrandTwoInComplete[user_id] = [];
                    }
                    tasklevelBrandTwoInComplete[user_id].push(task_id);
                }
            } else if (user_level_listing[user_level_key].level_task.task_level == 3) {
                if (!taskLevelBrandThreeCount[user_id]) {
                    taskLevelBrandThreeCount[user_id] = [];
                }
                taskLevelBrandThreeCount[user_id].push(task_id);

                if (user_level_listing[user_level_key].user_cta_action == 0) {
                    if (!tasklevelBrandThreeDecline[user_id]) {
                        tasklevelBrandThreeDecline[user_id] = [];
                    }
                    tasklevelBrandThreeDecline[user_id].push(task_id);
                } else if (user_level_listing[user_level_key].user_cta_action == 1) { // accept
                    if (!tasklevelBrandThreeComplete[user_id]) {
                        tasklevelBrandThreeComplete[user_id] = [];
                    }
                    tasklevelBrandThreeComplete[user_id].push(task_id);
                }
                if (user_level_listing[user_level_key].user_cta_action == 1 && user_level_listing[user_level_key].task_status == 0) {
                    if (!tasklevelBrandThreeInComplete[user_id]) {
                        tasklevelBrandThreeInComplete[user_id] = [];
                    }
                    tasklevelBrandThreeInComplete[user_id].push(task_id);
                }
            }
        }
    }
    var userId = 0;
    if (userList.length) {
        for (const userListKey in userList) {
            var userId = userList[userListKey].u_id;
            userList[userListKey].dataValues.user_engagment_rate = brandCommentData[userId][0] ? brandCommentData[userId][0].length : 0;
            userList[userListKey].dataValues.bonuses_won = bonusRewardIds[userId] ? bonusRewardIds[userId].length : 0;
            userList[userListKey].dataValues.survey_questions_tasks = (surveyCount && surveyCount[userId]) ? surveyCount[userId].length : 0;
            userList[userListKey].dataValues.content_task_entered = (brandContent && brandContent[userId]) ? brandContent[userId].length : 0;
            userList[userListKey].dataValues.task_entered = 0;
            if (brandTaskIds[userId].length) {
                userList[userListKey].dataValues.task_entered = brandTaskIds[userId].length;
            }
            userList[userListKey].dataValues.contest_task_entered = 0;
            if (brandContestIds[userId].length) {
                //var brandContestUniqueIds = brandContestIds[brand_id].filter((v, i, a) => a.indexOf(v) === i);
                userList[userListKey].dataValues.contest_task_entered = brandContestIds[userId].length;
            }
            userList[userListKey].dataValues.tokens_earned = rewardBrandTokens[userId] ? rewardBrandTokens[userId].reduce((a, b) => a + b, 0) : 0;
            userList[userListKey].dataValues.stars_earned = rewardBrandStars[userId] ? rewardBrandStars[userId].reduce((a, b) => a + b, 0) : 0;
            userList[userListKey].dataValues.ads_watched = (videoAddCount && videoAddCount[userId]) ? videoAddCount[userId].length : 0;
            userList[userListKey].dataValues.offers_sent_tier_2 = (taskLevelBrandTwoCount && taskLevelBrandTwoCount[userId]) ? taskLevelBrandTwoCount[userId].length : 0;
            userList[userListKey].dataValues.completed_tier_2 = (tasklevelBrandTwoComplete && tasklevelBrandTwoComplete[userId]) ? tasklevelBrandTwoComplete[userId].length : 0;
            userList[userListKey].dataValues.accepted_not_completed_tier_2 = (tasklevelBrandTwoInComplete && tasklevelBrandTwoInComplete[userId]) ? tasklevelBrandTwoInComplete[userId].length : 0;
            userList[userListKey].dataValues.not_accepted_tier_2_declined = tasklevelBrandTwoDecline[userId] ? tasklevelBrandTwoDecline[userId].length : 0;
            userList[userListKey].dataValues.completed_tier_3 = tasklevelBrandThreeComplete[userId] ? tasklevelBrandThreeComplete[userId].length : 0;
            userList[userListKey].dataValues.offers_sent_tier_3 = taskLevelBrandThreeCount[userId] ? taskLevelBrandThreeCount[userId].length : 0;
            userList[userListKey].dataValues.accepted_not_completed_tier_3 = tasklevelBrandThreeInComplete[userId] ? tasklevelBrandThreeInComplete[userId].length : 0;
            userList[userListKey].dataValues.not_accepted_tier_3_declined = tasklevelBrandThreeDecline[userId] ? tasklevelBrandThreeDecline[userId].length : 0;
        }
    }
    var totalOptions = {
        distinct: true,
        col: 'ucpl_u_id',
        where: {
            ucpl_status: 1,
            upcl_brand_details:{
                id: req.params.brandID
                }
        }
    };
    var total = await db.user_content_post.count(totalOptions);
    res.status(200).send({
        data: userList,
        totalRecords: total
    });
    return
}

/**
 * Function to get brand details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.brandDetail = async(req, res) => {  
    const brandID = req.params.brandID;
    var UserId = req.header(process.env.UKEY_HEADER || "x-api-key");
    const contentUserTaskIds = await common.getContentReportUser(['Brand', 'Campaign'], UserId);
    
    let brandIdsValues = [];
    let CampaignIdsValues = [];
    if (contentUserTaskIds.length) {
        contentUserTaskIds.forEach(element => {
            if (element.content_report_type == 'Brand') {
                brandIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'Campaign') {
                CampaignIdsValues.push(element.content_report_type_id);
            }
          });
    }
    /* if brand is reported by user then do not show detail. */
    var isBrandFound = 0;
    brandIdsValues.forEach(element => {
        if (element == brandID) {
            isBrandFound = 1;
        }
    });
    if (isBrandFound == 1) {
        res.status(500).send({
            message: "brand not found"
        });
        return;
    }
    const brand = await Brand.findOne({
		include: [
            {
                model: db.campaigns,
                required: false,
                where:{is_autotakedown:0,
                    cp_campaign_id:{
                        [Op.not]: CampaignIdsValues
                    }}
            },
			{
                model: brands_budget,
				attributes:
                    ["cr_bu_amount", "cr_bu_note","cr_bu_created_at", "token_value_in_usd", "cr_bu_tokens", "cr_bu_updated_at"]
            }
        ],
        where: {
            cr_co_id: brandID,
            is_autotakedown: 0
        }
    });
    if(!brand){
        res.status(500).send({
            message: "brand not found"
        });
        return
    }
    var reward_given_options = {
        where: {
            rewards_brand_id: req.params.brandID
        },
        attributes:[
        [sequelize.fn('sum', sequelize.col('rewards_award_stars')), 'rewards_award_stars'],
        [sequelize.fn('sum', sequelize.col('rewards_award_token')), 'rewards_award_token']
    ],
    };
    const reward_given_listing = await db.rewards_given.findOne(reward_given_options);
    brand.dataValues.total_stars_given = 0;
    brand.dataValues.total_token_given = 0;
    if (reward_given_listing) {
        brand.dataValues.total_stars_given = reward_given_listing.rewards_award_stars || 0
        brand.dataValues.total_token_given = reward_given_listing.rewards_award_token || 0;
    }

    var user_content_options = {
        where: {
            ucpl_status: 1,
            upcl_brand_details:{
                id: req.params.brandID
                }
        },
        attributes:[
        'ta_task_id'
    ],
    };
    const user_content_listing = await db.user_content_post.findAll(user_content_options);

    var task_options = {
        where: {
            tj_data:{
                brand : {
                    brand_id: req.params.brandID
                }
            }
        },
        attributes:[
        'tj_data'
    ],
    };
    const task_listing = await db.tasks_json.findAll(task_options);

    var videoOptions = {
        where: {
            cr_co_id: req.params.brandID
        },
        attributes:[
            'cr_co_id', 'video_ads_name'
        ]
    };
    const video_ads_listing = await db.video_ads.findAll(videoOptions);

    var level_options = {
        include: [
            {
                model: db.level_task,
                where: {
                    brand_id: req.params.brandID
                }
            }
        ],
        attributes:[
            'user_cta_action', 'task_user_id'
        ]
    };
    const user_level_listing = await db.user_level_task_action.findAll(level_options);
    var levelOneUsers = [];
    var levelTwoUsers = [];
    var levelThreeUsers = [];
    if (user_level_listing.length) {
        for (const user_level_key in user_level_listing) {
            if (user_level_listing[user_level_key].level_task.task_level == 1) {
                levelOneUsers.push(user_level_listing[user_level_key].task_user_id);
            } else if (user_level_listing[user_level_key].level_task.task_level == 2) {
                levelTwoUsers.push(user_level_listing[user_level_key].task_user_id);
            } else if (user_level_listing[user_level_key].level_task.task_level == 3) {
                levelThreeUsers.push(user_level_listing[user_level_key].task_user_id);
            }
        }
    }

    var userContentEntries = 0;
    var contestTask = [];
    var contentTask = [];
    var task = [];
    var surveyTask = [];
    var contestTask = [];
    var videoAdsTask = 0;
    if (task_listing) {
        for (const task_list_key in task_listing) {
            var tj_data = task_listing[task_list_key].tj_data;
            if (tj_data.ta_type == 1) {
                contestTask.push(tj_data.ta_task_id);
                contentTask.push(tj_data.ta_task_id);
            } else if (tj_data.ta_type == 2) {
                task.push(tj_data.ta_task_id);
                contentTask.push(tj_data.ta_task_id);
            } else if (tj_data.ta_type == 5) {
                surveyTask.push(tj_data.ta_task_id);
            }
        }
        
    }
    if (video_ads_listing) {
        videoAdsTask = video_ads_listing.length;
    }
    if (user_content_listing) {
        userContentEntries = user_content_listing.length;
    }
    brand.dataValues.video_ads_tasks = videoAdsTask;
    brand.dataValues.contest_tasks = contestTask.length;
    brand.dataValues.tasks = task.length;
    brand.dataValues.survey_task = surveyTask.length;
    brand.dataValues.content_tasks = contentTask.length;
    brand.dataValues.level_one_users = levelOneUsers.length;
    brand.dataValues.level_two_users = levelTwoUsers.length;
    brand.dataValues.level_three_users = levelThreeUsers.length;
    brand.dataValues.user_content_entries = userContentEntries;

    res.status(200).send({
        data: brand,
		media_token: common.imageToken(brandID)
    })
}

/**
 * Function to get brand details with tasks
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.brandDetailWithJsonTask = async(req, res) => {
    var UserId= req.header(process.env.UKEY_HEADER || "x-api-key");
    const brandID = req.params.brandID;
	const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'tj_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const brand = await Brand.findOne({
		attributes:["cr_co_id", "cr_co_name","cr_co_logo_path","cr_co_fb_handle","cr_co_tw_handle","cr_co_pint_handle","cr_co_insta_handle","cr_co_desc_short","cr_co_desc_long","cr_co_website","cr_co_cover_img_path","cr_co_alias"],
        where: {
            cr_co_id: brandID
        }
    });
    if(!brand){
        res.status(500).send({
            message: "brand not found"
        });
        return
    }
    const contentUserTaskIds = await common.getContentReportUser(['Task'], UserId);
    let taskIdsValues = [];
    if (contentUserTaskIds.length) {
        contentUserTaskIds.forEach(element => {
             taskIdsValues.push('' + element.content_report_type_id + '');
          });
    }
	var options = {
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
		attributes:[["tj_type","task_type"],["tj_task_id","task_id"],["tj_data","task_data"],["tj_status","task_status"]],
		where:{
			tj_data:{
			campaign: {
			  brand: {
				  brand_id: brandID
			  }
			 }
			},
            tj_task_id: {
                [Op.not]: taskIdsValues
            },
            is_autotakedown : 0		 
		}		
    };
    var total = await taskJson.count({
        where: options['where']
    });
    const tasks_list = await taskJson.findAll(options);
    res.status(200).send({
        brandDetails: brand,
		tasksList: tasks_list,
		totalTasks: total,
		media_token: common.imageToken(brandID)
    })
}

/**
 * Function to update brand details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

 exports.updateBrand = async(req, res) => {
    const id = req.params.brandID;
    var BrandDetails = await Brand.findOne({
        where: {
            cr_co_id: id
        }
    });
    Brand.update(req.body, {
        returning: true,
        where: {
            cr_co_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','co_reg',id,result.dataValues,BrandDetails);
            res.status(200).send({
                message: "Brand updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Brand with id=${id}. Maybe Brand was not found or req.body is empty!`
            });
        }
    }).catch(err => {
       logger.log("error", err+": Error updating Brand with id=" + id);
        res.status(500).send({
            message: err+"Error updating Brand with id=" + id
        });
    });
 }
 /**
 * Function to get all brands with only name and id
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.Brandslisting = async(req, res) => {
	const sortBy = req.query.sortBy || 'cr_co_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    var UserId= req.header(process.env.UKEY_HEADER || "x-api-key");
    /* do not get users which are reported by someone */
    const contentUserIds = await common.getContentReportUser(['Brand'], UserId);
    let contentUserIdsValues = [];
    if (contentUserIds.length) {
        contentUserIdsValues = contentUserIds.map(function (item) {
            return item.content_report_type_id
          });
    }
    const options = {
		include: [
			{
                model: brands_budget,
				attributes:
                    ["cr_bu_amount", "cr_bu_note","cr_bu_created_at", "token_value_in_usd", "cr_bu_tokens", "cr_bu_updated_at"]
            }
        ],
		attributes:["cr_co_id","cr_co_name"],
        order: [
            [sortBy, sortOrder]
        ],
        where: {
			is_autotakedown:0
		}
    }
    
    if (contentUserIdsValues.length) {
        options['where']['cr_co_id'] = {
                [Op.not]: contentUserIdsValues
            }
    }
    const brands_list = await Brand.findAll(options);
    res.status(200).send({
        data: brands_list
    });
}
/**
 * Function to add brand budget
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.addBrandBudget = async(req, res) => {
    const body = req.body;
	if(!req.body["Brand id"] || !req.body["Budget amount"]){
	  res.status(500).send({
        msg:
          "Brand Name and Budget is required"
      });
	  return;
	}
   const brand = await Brand.findOne({
        where: {
            cr_co_id: req.body["Brand id"]
        }
    });
    if(!brand){
        res.status(500).send({
            message: "brand not found"
        });
        return
    }	
    const data = {
        "cr_co_id": body.hasOwnProperty("Brand id") ? req.body["Brand id"] : "",
        "cr_bu_amount": body.hasOwnProperty("Budget amount") ? req.body["Budget amount"] : "",
        "cr_bu_note": body.hasOwnProperty("Note") ? req.body["Note"] : "",
        "token_value_in_usd": body.hasOwnProperty("Token Value In Usd") ? req.body["Token Value In Usd"] : 0,
        "cr_bu_tokens": body.hasOwnProperty("Tokens") ? req.body["Tokens"] : 0
    }
    brands_budget.create(data)
    .then(data => {
    audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','co_budget',data.cr_bu_id,data.dataValues);
     res.status(201).send({
		  msg: "Budget added Successfully"
	  });
    })
    .catch(err => {
        logger.log("error", err+": Error add Brand budget");
      res.status(500).send({
        message:
          err.message || "Some error occurred while adding the Brand budget."
      });
    });
}
/**
 * Function to get brand budget details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.brandBudgets = async(req, res) => {
    const brandID = req.params.brandID;
    const brand = await brands_budget.findAll({
        where: {
            cr_co_id: brandID
        }
    });
    if(!brand){
        res.status(500).send({
            message: "brand budget not found"
        });
        return
    }
    res.status(200).send({
        data: brand
    })
}

/**
 * Function to close brand task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.closedBrandTask = async (req, res) => {
    const body = req.body;
    if (req.body["Task Id"] && !req.body["Task Id"].length) {
        return res.status(400).send({
            message: "Invalid task Ids."
        });
    }
    if (!req.body["Brand Id"]) {
        return res.status(400).send({
            message: "Brand Id is Required."
        });
    }
    var current_date = new Date();
    if (req.body["Task Id"].length) {
        var task_ids = req.body["Task Id"];
        for (const task_id_key in task_ids) {
            var task_id = task_ids[task_id_key];
            const data = {
                "brand_id": body.hasOwnProperty("Brand Id") ? req.body["Brand Id"] : 0,
                "task_id": task_id,
                "brand_task_closed": body.hasOwnProperty("brand_task_closed") ? req.body["brand_task_closed"] : "0",
                "brand_task_create_date": current_date,
                "brand_task_closed_date": current_date
            }
            brandTaskClosed.create(data).catch(err => {
                return res.status(500).send({
                    message: err.message || "Some error occurred while Closing to Brand Task."
                });
            });
        }
        res.status(201).send({
            msg: "Brand Task Closed Successfully"
        });
    } else {
        const data = {
            "brand_id": body.hasOwnProperty("Brand Id") ? req.body["Brand Id"] : 0,
            "brand_task_closed": body.hasOwnProperty("brand_task_closed") ? req.body["brand_task_closed"] : "0",
            "brand_task_create_date": new Date(),
            "brand_task_closed_date": new Date()
        }
        brandTaskClosed.create(data)
            .then(data => {
                res.status(201).send({
                    msg: "Brand Task Closed Successfully",
                    brandScoreClosedId: data.btc_id,
                });
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while Closing to Brand Task."
                });
            });
    }   
}

/**
 * Function to get all brands with only name and id
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.brandTaskClosedListing = async(req, res) => {
	const sortBy = req.query.sortBy || 'btc_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const options = {
        limit: pageSize,
        offset: skipCount,
		include: [
            {
                model: Brand,
                required: false,
                attributes: [
                    ["cr_co_name", "Brand Name"]
                ]
            },
            {
                model: Task,
                required:false
            }
        ],
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    }
    if (req.query.brandId) {
        options['where']['brand_id'] = req.query.brandId;
    }
    if (req.query.taskId) {
        options['where']['task_id'] = req.query.taskId;
    }
    var total = await brandTaskClosed.count({
        where: options['where']
    });
    const brands_list = await brandTaskClosed.findAll(options);
    res.status(200).send({
        data: brands_list,
        totalRecords: total
    });
}

/**
 * Function to get user brand closed tasks
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
// exports.brandUserTaskClosedListing = async(req, res) => {
// 	const pageSize = parseInt(req.query.pageSize || 10);
//     const pageNumber = parseInt(req.query.pageNumber || 1);
//     const skipCount = (pageNumber - 1) * pageSize;
//     const sortBy = req.query.sortBy || 'tj_id'
//     const sortOrder = req.query.sortOrder || 'DESC'
//     const sortVal = req.query.sortVal;
//     const Uid = req.header(process.env.UKEY_HEADER || "x-api-key");
//     var todayDate = new Date();
//     todayDate.toLocaleString('en-US', { timeZone: 'Asia/Calcutta' })
//     const contentUserTaskIds = await common.getContentReportUser(['Task'], Uid);
//     let taskIdsValues = [];
//     if (contentUserTaskIds.length) {
//         contentUserTaskIds.forEach(element => {
//             taskIdsValues.push('' + element.content_report_type_id + '');
//         });
//     }
//     const brandID = req.params.brandID;
//     var options = {
//         include: [
//             {
//                 model: db.user_content_post,
//                 attributes: [["ucpl_content_id", "ucpl_content_id"], ["ucpl_id", "post_id"], ['ucpl_content_data', 'post_data']],
//                 required: true,
//                 // limit: pageSize,
//                 // offset: skipCount,
//                 where: {
//                     ucpl_status: 1
//                 },
//                 order: [
//                     ['ucpl_added_by', 'ASC']
//                 ]
//             }
//         ],
//         limit: pageSize,
//         offset: skipCount,
//         order: [
//             [sortBy, sortOrder]
//         ],
//         attributes: [["tj_type", "task_type"], ["tj_task_id", "task_id"], ["tj_data", "task_data"], ["tj_status", "task_status"]],
//         where:{
// 			tj_data:{
// 			 brand: {
// 				  brand_id: brandID
// 			  }
// 			},
//             tj_task_id: {
//                 [Op.not]: taskIdsValues
//             },
//             is_autotakedown : 0		 
// 		}
//     };
//     // if (!req.query.isAdmin || req.query.isAdmin == 0) {
//     //     options['where']['tj_data'] = {
//     //         ta_start_date: {
//     //             [Op.lte]: todayDate
//     //         },
//     //         ta_end_date: {
//     //             [Op.gte]: todayDate
//     //         }
//     //     };
//     // }

//     var total = await taskJson.count({
//         where: options['where']
//     });
//     const tasks_list = await taskJson.findAll(options);
//     res.status(200).send({
//         data: tasks_list,
//         totalRecords: total,
//         media_token: common.imageToken(Uid)
//     });
// }

/**
 * Function to get user brand closed tasks
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.brandUserTaskClosedListing = async(req, res) => {
    const brandID = req.params.brandID;
	const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'ta_task_id'
    const sortOrder = req.query.sortOrder || 'ASC'
    var UserId = req.header(process.env.UKEY_HEADER || "x-api-key");
    //var todayDate = new Date();
    //var lastDate = todayDate.setDate(todayDate.getDate() - 1);
    //lastDate.toLocaleString('en-US', { timeZone: 'Asia/Calcutta' })
    //let lastCreatedDate = new Date(lastDate);
    const contentUserTaskIds = await common.getContentReportUser(['Task', 'Campaign', 'User Task Post'], UserId);
    let taskIdsValues = [];
    let userTaskPostIdsValues = [];
    if (contentUserTaskIds.length) {
        contentUserTaskIds.forEach(element => {
            if (element.content_report_type == 'Task') {
                taskIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'User Task Post') {
                userTaskPostIdsValues.push(element.content_report_type_id);
            }
        });
    }

    var options = {
        include: [
            {
                model: db.brands,
                required: false,
                attributes: [
                    ["cr_co_id", 'brand_id'], ["cr_co_name", 'brand_name'], ["cr_co_logo_path", 'brand_logo'],
                ],
                where: { is_autotakedown: 0 }
            },
            {
                model: db.user_content_post,
                where: {
                    // ucpl_created_at: {
                    //     [Op.lte]: lastCreatedDate
                    // },
                    ucpl_status: 1,
                    is_autotakedown: 0,
                    ucpl_id: {
                        [Op.not]: userTaskPostIdsValues
                    }
                },
                order: [
                    ['ucpl_added_by', 'ASC']
                ]
            }
        ],
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {
            ta_status: 2,
            brand_id: brandID
        }
    };
    if (req.query.sortVal && (req.query.sortBy == "ta_name" || req.query.sortBy == "ta_type")) {
        var sortValue = req.query.sortVal.trim();
        options.where = {
            [sortBy]: {
                [Op.iLike]: `%${sortValue}%`
            }
        }
    } else if (req.query.sortVal && req.query.sortBy == "ta_hashtag") {
        var sortValue = req.query.sortVal.trim();
        options.where = {
            [sortBy]: {
                [Op.contains]: [sortValue]
            }
        }
    } else if (req.query.sortVal) {
        var sortValue = req.query.sortVal.trim();
        options.where = {
            [sortBy]: `${sortValue}`
        }
    }
    if (taskIdsValues.length) {
        options['where']['ta_task_id'] = {
            [Op.not]: taskIdsValues
        }
    }
    options['where']['is_autotakedown'] = 0;
    // var total = await db.tasks.count({
    //     where: options['where']
    // });
    const tasks_list = await db.tasks.findAll(options);
    res.status(200).send({
        data: tasks_list,
        totalRecords: tasks_list.length
    });
}



