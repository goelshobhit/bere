require("dotenv").config({
  path: __dirname + "/../../.env",
});
const appConfig = require("./config/config.js");
const env = process.env.NODE_ENV || "development";
const fs = require("fs");
const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_ACCESS_KEY || "sofNialvAUxPiJQZa7PJtIA";
const jwtExpirySeconds = process.env.JWT_KEY_EXPIRY_TIME || "365d";
const db = require("./models");
const tasks_json = db.tasks_json;
const Contest = db.contest_task;
const Tasks = db.tasks;
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
      5: "Cancelled",
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
      5: "Cancelled",
    };
    return taskSts;
  };
  Common.prototype.taskTypesArr = function () {
    var taskTypes = {
      1: "Questions/ instruction",
      2: "Reference Picture",
      3: "Reference video",
      4: "Reference audio",
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
      5: "Cancelled",
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
      12: "Spam",
    };
    return questions;
  };
  Common.prototype.reactionsEmoji = function () {
    var questions = [
      "Happy.png",
      "Crying.png",
      "Love.png",
      "Mad.png",
      "Shocked.png",
      "Heart.png",
      "Heart-White.png",
    ];
    return questions;
  };
  Common.prototype.generateToken = function (user_id) {
    if (!user_id) {
      throw new Error("User Id is missing");
    }
    const token = jwt.sign(
      {
        user_id,
      },
      jwtKey,
      {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
      }
    );
    return token;
  };
  Common.prototype.userroleActions = function () {
    var role_actions = {
      "User Rights": [
        {
          "View User": {
            "user/view": "GET/api/admin_users/1",
          },
        },
        {
          "Add User": {
            "user/add": "POST/api/admin_users",
          },
        },
        {
          "Update User": {
            "user/update": "PUT/api/admin_users",
          },
        },
        {
          "All Users": {
            "user/all": "GET/api/admin_users",
          },
        },
        {
          "Delete Users": {
            "user/delete": "DELETE/api/admin_users",
          },
        },
        {
          "Add Search Object": {
            "search/object": "POST/api/search",
          },
        },
      ],
      "Role Rights": [
        {
          "View Role": {
            "role/view": "GET/api/roles/1",
          },
        },
        {
          "Add Role": {
            "role/add": "POST/api/roles",
          },
        },
        {
          "Update Role": {
            "role/update": "PUT/api/roles",
          },
        },
        {
          "Delete Role": {
            "role/delete": "DELETE/api/roles",
          },
        },
        {
          "All Role": {
            "role/all": "GET/api/roles",
          },
        },
      ],
      "Brand Rights": [
        {
          "View Brand": {
            "brand/view": "GET/api/brand/1",
          },
        },
        {
          "Add Brand": {
            "brand/add": "POST/api/brand",
          },
        },
        {
          "Update Brand": {
            "brand/update": "PUT/api/brand",
          },
        },
        {
          "Delete Brand": {
            "brand/delete": "DELETE/api/brand",
          },
        },
        {
          "Add Brand Budget": {
            "brandbudget/add": "POST/api/brandbudget",
          },
        },
        {
          "All Brand": {
            "brand/all": "GET/api/brand",
          },
        },
      ],
      "Campaign Rights": [
        {
          "Add Campaign": {
            "campaign/add": "POST/api/campaign",
          },
        },
        {
          "View Campaign": {
            "campaign/view": "GET/api/campaign/1",
          },
        },
        {
          "Update Campaign": {
            "campaign/update": "PUT/api/campaign",
          },
        },
        {
          "Delete Campaign": {
            "campaign/delete": "DELETE/api/campaign",
          },
        },
        {
          "All Campaign": {
            "campaign/all": "GET/api/campaign",
          },
        },
      ],
      "Tasks Rights": [
        {
          "View Tasks": {
            "task/view": "GET/api/tasks/1",
          },
        },
        {
          "Add Tasks": {
            "task/add": "POST/api/tasks",
          },
        },
        {
          "Update Tasks": {
            "task/update": "PUT/api/tasks",
          },
        },
        {
          "Delete Tasks": {
            "task/delete": "DELETE/api/tasks",
          },
        },
        {
          "All Tasks": {
            "task/all": "GET/api/tasks",
          },
        },
        {
          "Add Contest": {
            "contest/add": "POST/api/contest",
          },
        },
        {
          "Update Contest": {
            "contest/update": "PUT/api/contest",
          },
        },
        {
          "Delete Contest": {
            "contest/delete": "DELETE/api/contest",
          },
        },
      ],
      "Admin Rights": [
        {
          "Update Tasks": {
            "setting/update": "PUT/api/admin_setting",
          },
        },
        {
          "All Tasks": {
            "setting/all": "GET/api/admin_setting",
          },
        },
      ],
      "Bonus Rights": [
        {
          "Add Bonus Set": {
            "bonus_set/add": "POST/api/bonus_set",
          },
        },
        {
          "Update Bonus Set": {
            "bonus_set/update": "PUT/api/bonus_set",
          },
        },
        {
          "Delete Bonus Set": {
            "bonus_set/delete": "DELETE/api/bonus_set",
          },
        },
        {
          "Add Bonus Item": {
            "bonus_item/add": "POST/api/bonus_item",
          },
        },
        {
          "Update Bonus Item": {
            "bonus_item/update": "PUT/api/bonus_item",
          },
        },
        {
          "Delete Bonus Item": {
            "bonus_item/delete": "DELETE/api/bonus_item",
          },
        },
        {
          "Add Bonus Rules": {
            "bonus_tickets_rules/add": "POST/api/bonus_tickets_rules",
          },
        },
        {
          "Update Bonus Rules": {
            "bonus_tickets_rules/update": "PUT/api/bonus_tickets_rules",
          },
        },
        {
          "Delete Bonus Rules": {
            "bonus_tickets_rules/delete": "DELETE/api/bonus_tickets_rules",
          },
        },
      ],
      "Content Report Rights": [
        {
          "Add Content Report Category": {
            "contentreport_category/add": "POST/api/contentreport_category",
          },
        },
        {
          "Update Content Report Category": {
            "contentreport_category/update": "PUT/api/contentreport_category",
          },
        },
        {
          "Delete Content Report Category": {
            "contentreport_category/delete":
              "DELETE/api/contentreport_category",
          },
        },
      ],
      "Additional Info Data Rights": [
        {
          "Add Additional Info Data": {
            "addtionalInfoData/add": "POST/api/addtionalInfoData",
          },
        },
        {
          "Update Additional Info Data": {
            "additionalInfoData/update": "PUT/api/additionalInfoData",
          },
        },
        {
          "Delete Additional Info Data": {
            "additionalInfoData/delete": "DELETE/api/additionalInfoData",
          },
        },
        {
          "Add Additional Info Heading": {
            "addtionalInfoHeading/add": "POST/api/addtionalInfoHeading",
          },
        },
        {
          "Update Additional Info Heading": {
            "additionalInfoHeading/update": "PUT/api/additionalInfoHeading",
          },
        },
        {
          "Delete Additional Info Heading": {
            "addtionalInfoHeading/delete": "DELETE/api/addtionalInfoHeading",
          },
        },
      ],
      "Category Rights": [
        {
          "Add Category": {
            "category/add": "POST/api/category",
          },
        },
        {
          "Update Category": {
            "category/update": "PUT/api/category",
          },
        },
        {
          "Delete Category": {
            "category/delete": "DELETE/api/category",
          },
        },
      ],
      "Content Feedback Settings Rights": [
        {
          "Add Content Feedback Settings": {
            "content_feedback_settings/add":
              "POST/api/content_feedback_settings",
          },
        },
        {
          "Update Content Feedback Settings": {
            "content_feedback_settings/update":
              "PUT/api/content_feedback_settings",
          },
        },
        {
          "Delete Content Feedback Settings": {
            "content_feedback_settings/delete":
              "DELETE/api/content_feedback_settings",
          },
        },
        {
          "Add Content Feedback": {
            "content_feedback/add": "POST/api/content_feedback",
          },
        },
        {
          "Update Content Feedback": {
            "content_feedback/update": "PUT/api/content_feedback",
          },
        },
        {
          "Delete Content Feedback": {
            "content_feedback/delete": "DELETE/api/content_feedback",
          },
        },
      ],
      "FAQ Rights": [
        {
          "Add FAQ": {
            "faq/add": "POST/api/faq",
          },
        },
        {
          "Update FAQ": {
            "faq/update": "PUT/api/faq",
          },
        },
        {
          "Delete FAQ": {
            "faq/delete": "DELETE/api/faq",
          },
        },
      ],
      "TIPS Rights": [
        {
          "Add Tips": {
            "tips/add": "POST/api/tips",
          },
        },
        {
          "Update Tips": {
            "tips/update": "PUT/api/tips",
          },
        },
        {
          "Delete Tips": {
            "tips/delete": "DELETE/api/tips",
          },
        },
      ],
      "Video Ads Rights": [
        {
          "Add Video Ads": {
            "watch_ads_task/add": "POST/api/watch_ads_task",
          },
        },
        {
          "Update Video Ads": {
            "watch_ads_task/update": "PUT/api/watch_ads_task",
          },
        },
        {
          "Delete Video Ads": {
            "watch_ads_task/delete": "DELETE/api/watch_ads_task",
          },
        },
      ],
      "Terms and Conditions Rights": [
        {
          "Add Terms and Conditions": {
            "terms_conditions/add": "POST/api/terms_conditions",
          },
        },
        {
          "Update Terms and Conditions": {
            "terms_conditions/update": "PUT/api/terms_conditions",
          },
        },
        {
          "Delete Terms and Conditions": {
            "terms_conditions/delete": "DELETE/api/terms_conditions",
          },
        },
      ],
      "Survey Rights": [
        {
          "Add Survey": {
            "survey/add": "POST/api/survey",
          },
        },
        {
          "Update Survey": {
            "survey/update": "PUT/api/survey",
          },
        },
        {
          "Add Survey Questions": {
            "survey_questions/add": "POST/api/survey_questions",
          },
        },
        {
          "Delete Survey Questions": {
            "survey_questions/delete": "DELETE/api/survey_questions",
          },
        },
        {
          "Add Survey Question Answers": {
            "survey_question_answers/add": "POST/api/survey_question_answers",
          },
        },
      ],
      "Page Location Rights": [
        {
          "Add Page Location": {
            "page_location/add": "POST/api/page_location",
          },
        },
        {
          "Update Page Location": {
            "page_location/update": "PUT/api/page_location",
          },
        },
        {
          "Delete Page Location": {
            "page_location/delete": "DELETE/api/page_location",
          },
        },
      ],
      "Notify Triggers Rights": [
        {
          "Add Notify Triggers": {
            "notify/triggers/add": "POST/api/notify/triggers",
          },
        },
        {
          "Update Notify Triggers": {
            "notify/triggers/update": "PUT/api/notify/triggers",
          },
        },
        {
          "Delete Notify Triggers": {
            "notify/triggers/delete": "DELETE/api/notify/triggers",
          },
        },
      ],
      "Notify Object Rights": [
        {
          "Add Notify Object": {
            "notify/objects/add": "POST/api/notify/objects",
          },
        },
        {
          "Update Notify Object": {
            "notify/objects/update": "PUT/api/notify/objects",
          },
        },
        {
          "Delete Notify Object": {
            "notify/objects/delete": "DELETE/api/notify/objects",
          },
        },
        {
          "Add Notify groups": {
            "notify/groups/add": "POST/api/notify/groups",
          },
        },
        {
          "Update Notify groups": {
            "notify/groups/update": "PUT/api/notify/groups",
          },
        },
        {
          "Delete Notify groups": {
            "notify/groups/delete": "DELETE/api/notify/groups",
          },
        },
        {
          "Add Notify category": {
            "notify/categories/add": "POST/api/notify/categories",
          },
        },
        {
          "Update Notify category": {
            "notify/categories/update": "PUT/api/notify/categories",
          },
        },
        {
          "Delete Notify category": {
            "notify/categories/delete": "DELETE/api/notify/categories",
          },
        },
      ],
      "Mini Task Rights": [
        {
          "Add Notify Triggers": {
            "mini_task/add": "POST/api/mini_task",
          },
        },
      ],
      "Task Level Rights": [
        {
          "Add Task Level": {
            "task_level/post_level_task/add":
              "POST/api/task_level/post_level_task",
          },
        },
        {
          "Update Task Level": {
            "task_level/update_level_task/update":
              "POST/api/task_level/update_level_task",
          },
        },
        {
          "Delete Task Level": {
            "task_level/delete_level_task/delete":
              "POST/api/task_level/delete_level_task",
          },
        },
      ],
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
        action_id,
      },
      jwtKey,
      {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
      }
    );
    return token;
  };
  Common.prototype.manageUserAccount = async function (
    userId,
    coins,
    stars,
    trx_type
  ) {
    //trx_type = credit,debit
    var userAccount = await accountBalance.findOne({
      where: {
        ac_user_id: userId,
      },
    });
    if (userAccount) {
      var ac_balance = userAccount.ac_balance || 0;
      var ac_balance_stars = userAccount.ac_balance_stars || 0;
      if (trx_type === "credit") {
        coins = parseFloat(ac_balance) + parseFloat(coins);
        stars = parseFloat(ac_balance_stars) + parseFloat(stars);
      } else {
        coins = parseFloat(ac_balance) - parseFloat(coins);
        stars = parseFloat(ac_balance_stars) - parseFloat(stars);
      }
      /* to resolve nan issue */
      stars = stars || 0;
      coins = coins || 0;
      accountBalance.update(
        { ac_balance: coins, ac_balance_stars: stars },
        {
          where: {
            ac_user_id: userId,
          },
        }
      );
      return true;
    } else {
      accountBalance.create({
        ac_user_id: userId,
        ac_balance: coins,
        ac_balance_stars: stars,
        ac_account_no: "",
      });
      return true;
    }
  };
  Common.prototype.jsonTask = function (id, type, actionType) {
    // Single Task
    if (type === "Single") {
      if (actionType === "add") {
        Tasks.findOne({
          include: [
            {
              model: db.brands,
              attributes: [
                ["cr_co_id", "brand_id"],
                ["cr_co_name", "brand_name"],
                ["cr_co_logo_path", "brand_logo"],
              ],
            },
            {
              model: db.campaigns,
              attributes: [["cp_campaign_name", "campaign_name"]],
              include: [
                {
                  model: db.brands,
                  attributes: [
                    ["cr_co_id", "brand_id"],
                    ["cr_co_name", "brand_name"],
                    ["cr_co_logo_path", "brand_logo"],
                  ],
                },
              ],
            },
            {
              model: db.user_content_post,
              attributes: [
                ["ucpl_id", "post_id"],
                ["ucpl_content_data", "post_data"],
              ],
              required: false,
              where: {
                ucpl_added_by: 0,
                ucpl_status: 1,
              },
              order: [["ucpl_id", "DESC"]],
            },
          ],
          where: {
            ta_task_id: id,
          },
        }).then(function (result) {
          // for task
          result.dataValues.ta_type = "2";
          var add_data = {
            tj_type: type,
            tj_task_id: id,
            tj_data: result,
            tj_status: result.dataValues.ta_status,
          };

          tasks_json.create(add_data);
        });
      } else {
        Tasks.findOne({
          include: [
            {
              model: db.brands,
              attributes: [
                ["cr_co_id", "brand_id"],
                ["cr_co_name", "brand_name"],
                ["cr_co_logo_path", "brand_logo"],
              ],
            },
            {
              model: db.campaigns,
              attributes: [["cp_campaign_name", "campaign_name"]],
              include: [
                {
                  model: db.brands,
                  attributes: [
                    ["cr_co_id", "brand_id"],
                    ["cr_co_name", "brand_name"],
                    ["cr_co_logo_path", "brand_logo"],
                  ],
                },
              ],
            },
            {
              model: db.user_content_post,
              attributes: [
                ["ucpl_id", "post_id"],
                ["ucpl_content_data", "post_data"],
              ],
              required: false,
              where: {
                ucpl_added_by: 0,
                ucpl_status: 1,
              },
              order: [["ucpl_id", "DESC"]],
            },
          ],
          where: {
            ta_task_id: id,
          },
        }).then(function (result) {
          result.dataValues.ta_type = "2";
          var update_data = {
            tj_data: result,
            tj_status: result.dataValues.ta_status,
          };
          tasks_json.update(update_data, {
            where: {
              tj_task_id: id,
            },
          });
        });
      }
    }
    // end of Single Task
    // Contest Task
    if (type === "Contest") {
      if (actionType === "add") {
        Contest.findOne({
          include: [
            {
              model: db.brands,
              attributes: [
                ["cr_co_id", "brand_id"],
                ["cr_co_name", "brand_name"],
                ["cr_co_logo_path", "brand_logo"],
              ],
            },
            {
              model: db.campaigns,
              attributes: [["cp_campaign_name", "campaign_name"]],
              include: [
                {
                  model: db.brands,
                  attributes: [
                    ["cr_co_id", "brand_id"],
                    ["cr_co_name", "brand_name"],
                    ["cr_co_logo_path", "brand_logo"],
                  ],
                },
              ],
            },
            {
              model: db.user_content_post,
              attributes: [
                ["ucpl_id", "post_id"],
                ["ucpl_content_data", "post_data"],
              ],
              required: false,
              where: {
                ucpl_added_by: 0,
                ucpl_status: 1,
              },
              order: [["ucpl_id", "DESC"]],
            },
          ],
          attributes: [
            ["ct_do", "ta_do"],
            ["ct_desc", "ta_desc"],
            ["ct_name", "ta_name"],
            ["ct_type", "ta_type"],
            ["ct_sound", "ta_sound"],
            ["ct_status", "ta_status"],
            ["ct_dont_do", "ta_dont_do"],
            ["ct_hashtag", "ta_hashtag"],
            ["ct_id", "ta_task_id"],
            ["ct_end_date", "ta_end_date"],
            ["ct_mentioned", "ta_mentioned"],
            ["ct_created_at", "ta_created_at"],
            ["ct_start_date", "ta_start_date"],
            ["ct_updated_at", "ta_updated_at"],
            ["cp_campaign_id", "cp_campaign_id"],
            ["ct_header_image", "ta_header_image"],
            ["ct_token_budget", "ta_token_budget"],
            ["ct_estimated_user", "ta_estimated_user"],
            ["ct_insta_question", "ta_insta_question"],
            ["ct_budget_per_user", "ta_budget_per_user"],
            ["ct_stars_per_user", "ta_stars_per_user"],
            ["ct_oneline_summary", "ta_oneline_summary"],
            ["ct_videos_required", "ta_videos_required"],
            ["ct_contiue_spend_budget", "ta_contiue_spend_budget"],
            ["ct_bonus_rewards_benefits", "ta_bonus_rewards_benefits"],
            ["ct_post_insp_image", "ta_post_insp_image"],
            ["ct_photos_required", "ta_photos_required"],
            "ct_start_voting_date",
            "ct_end_voting_date",
            "ct_winner_date",
            "ct_winner_token",
            ["ct_total_available", "ta_total_available"],
          ],
          where: {
            ct_id: id,
          },
        }).then(function (result) {
          result.dataValues.ta_type = "1";
          var add_data = {
            tj_type: type,
            tj_task_id: id,
            tj_data: result,
            tj_status: result.dataValues.ta_status,
          };
          tasks_json.create(add_data);
        });
      } else {
        Contest.findOne({
          include: [
            {
              model: db.brands,
              attributes: [
                ["cr_co_id", "brand_id"],
                ["cr_co_name", "brand_name"],
                ["cr_co_logo_path", "brand_logo"],
              ],
            },
            {
              model: db.campaigns,
              attributes: [["cp_campaign_name", "campaign_name"]],
              include: [
                {
                  model: db.brands,
                  attributes: [
                    ["cr_co_id", "brand_id"],
                    ["cr_co_name", "brand_name"],
                    ["cr_co_logo_path", "brand_logo"],
                  ],
                },
              ],
            },
            {
              model: db.user_content_post,
              attributes: [
                ["ucpl_id", "post_id"],
                ["ucpl_content_data", "post_data"],
              ],
              required: false,
              where: {
                ucpl_added_by: 0,
                ucpl_status: 1,
              },
              order: [["ucpl_id", "DESC"]],
            },
          ],
          attributes: [
            ["ct_do", "ta_do"],
            ["ct_desc", "ta_desc"],
            ["ct_name", "ta_name"],
            ["ct_type", "ta_type"],
            ["ct_sound", "ta_sound"],
            ["ct_status", "ta_status"],
            ["ct_dont_do", "ta_dont_do"],
            ["ct_hashtag", "ta_hashtag"],
            ["ct_id", "ta_task_id"],
            ["ct_end_date", "ta_end_date"],
            ["ct_mentioned", "ta_mentioned"],
            ["ct_created_at", "ta_created_at"],
            ["ct_start_date", "ta_start_date"],
            ["ct_updated_at", "ta_updated_at"],
            ["cp_campaign_id", "cp_campaign_id"],
            ["ct_header_image", "ta_header_image"],
            ["ct_token_budget", "ta_token_budget"],
            ["ct_estimated_user", "ta_estimated_user"],
            ["ct_insta_question", "ta_insta_question"],
            ["ct_budget_per_user", "ta_budget_per_user"],
            ["ct_stars_per_user", "ta_stars_per_user"],
            ["ct_oneline_summary", "ta_oneline_summary"],
            ["ct_videos_required", "ta_videos_required"],
            ["ct_contiue_spend_budget", "ta_contiue_spend_budget"],
            ["ct_bonus_rewards_benefits", "ta_bonus_rewards_benefits"],
            ["ct_post_insp_image", "ta_post_insp_image"],
            ["ct_photos_required", "ta_photos_required"],
            "ct_start_voting_date",
            "ct_end_voting_date",
            "ct_winner_date",
            "ct_winner_token",
            ["ct_total_available", "ta_total_available"],
          ],
          where: {
            ct_id: id,
          },
        }).then(function (result) {
          result.dataValues.ta_type = "1";
          var update_data = {
            tj_data: result,
            tj_status: result.dataValues.ta_status,
          };
          tasks_json
            .update(update_data, {
              where: {
                tj_task_id: id,
              },
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    }
    // Single Task
    if (type === "Survey") {
      type = "Single";
      if (actionType === "add") {
        Survey.findOne({
          include: [
            {
              model: db.brands,
              attributes: [
                ["cr_co_id", "brand_id"],
                ["cr_co_name", "brand_name"],
                ["cr_co_logo_path", "brand_logo"],
              ],
            },
          ],
          where: {
            sr_id: id,
          },
        }).then(function (result) {
          result.dataValues.campaign = {};
          result.dataValues.campaign.brand = result.dataValues.brand;
          // delete result.dataValues.brand;
          result.dataValues.surveyId = result.dataValues.sr_id;
          result.dataValues.ta_name = result.dataValues.sr_title;
          result.dataValues.ta_type = "5";
          result.dataValues.ta_start_date = result.dataValues.sr_startdate_time;
          result.dataValues.ta_end_date = result.dataValues.sr_enddate_time;
          result.dataValues.ta_stars_per_user =
            result.dataValues.sr_stars_per_user;
          var add_data = {
            tj_type: type,
            tj_task_id: id,
            tj_data: result,
            tj_status: result.dataValues.sr_status,
          };
          tasks_json.create(add_data);
        });
      } else {
        Survey.findOne({
          include: [
            {
              model: db.brands,
              attributes: [
                ["cr_co_id", "brand_id"],
                ["cr_co_name", "brand_name"],
                ["cr_co_logo_path", "brand_logo"],
              ],
            },
          ],
          where: {
            sr_id: id,
          },
        }).then(function (result) {
          result.dataValues.campaign = {};
          result.dataValues.campaign.brand = result.dataValues.brand;
          //delete result.dataValues.brand;
          result.dataValues.surveyId = result.dataValues.sr_id;
          result.dataValues.ta_type = "5";
          result.dataValues.ta_name = result.dataValues.sr_title;
          result.dataValues.ta_start_date = result.dataValues.sr_startdate_time;
          result.dataValues.ta_end_date = result.dataValues.sr_enddate_time;
          result.dataValues.ta_stars_per_user =
            result.dataValues.sr_stars_per_user;
          var update_data = {
            tj_data: result,
            tj_status: result.dataValues.sr_status,
          };
          tasks_json.update(update_data, {
            where: {
              tj_task_id: id,
            },
          });
        });
      }
    }
    // Single Task
    if (type === "Watch Ad") {
      type = "Single";
      if (actionType === "add") {
        db.watch_ads_task
          .findOne({
            include: [
              {
                model: db.brands,
                attributes: [
                  ["cr_co_id", "brand_id"],
                  ["cr_co_name", "brand_name"],
                  ["cr_co_logo_path", "brand_logo"],
                ],
              },
            ],
            where: {
              watch_ads_task_id: id,
            },
          })
          .then(function (result) {
            result.dataValues.campaign = {};
            result.dataValues.watchAdId = result.dataValues.watch_ads_task_id;
            result.dataValues.ta_name = result.dataValues.task_name;
            result.dataValues.ta_type = "3";
            result.dataValues.ta_start_date = result.dataValues.start_date;
            result.dataValues.ta_end_date = result.dataValues.end_date;
            result.dataValues.ta_stars_per_user =
              result.dataValues.stars_given_value;
            var add_data = {
              tj_type: type,
              tj_task_id: id,
              tj_data: result,
              tj_status: result.dataValues.task_status,
            };
            tasks_json.create(add_data);
          });
      } else {
        db.watch_ads_task
          .findOne({
            include: [
              {
                model: db.brands,
                attributes: [
                  ["cr_co_id", "brand_id"],
                  ["cr_co_name", "brand_name"],
                  ["cr_co_logo_path", "brand_logo"],
                ],
              },
            ],
            where: {
              watch_ads_task_id: id,
            },
          })
          .then(function (result) {
            result.dataValues.campaign = {};
            result.dataValues.watchAdId = result.dataValues.watch_ads_task_id;
            result.dataValues.ta_name = result.dataValues.task_name;
            result.dataValues.ta_type = "3";
            result.dataValues.ta_start_date = result.dataValues.start_date;
            result.dataValues.ta_end_date = result.dataValues.end_date;
            result.dataValues.ta_stars_per_user =
              result.dataValues.stars_given_value;
            var update_data = {
              tj_data: result,
              tj_status: result.dataValues.task_status,
            };
            tasks_json.update(update_data, {
              where: {
                tj_task_id: id,
              },
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
      include: [
        {
          model: db.brandscore_engagement_settings,
        },
      ],
      where: {
        engagement_type: brandscoreDetail.engagement_type,
      },
    });
    var engagement_level = [];
    var engagement_level_details = {};
    if (engagementTypeDetails.brandscore_engagement_settings.length) {
      var brandscore_engagement_settings =
        engagementTypeDetails.brandscore_engagement_settings;
      for (const brandscore_engagement_settings_key in brandscore_engagement_settings) {
        if (
          brandscore_engagement_settings[brandscore_engagement_settings_key]
            .engagement_level <= brandscoreDetail.user_total
        ) {
          engagement_level.push(
            brandscore_engagement_settings[brandscore_engagement_settings_key]
              .engagement_level
          );
          engagement_level_details[
            brandscore_engagement_settings[
              brandscore_engagement_settings_key
            ].engagement_level
          ] =
            brandscore_engagement_settings[
              brandscore_engagement_settings_key
            ].brand_score;
        }
      }
      let scoreIncreaseDetails = await db.brandscore_increase.findOne({
        where: {
          event_id: brandscoreDetail.task_id,
          event_type: brandscoreDetail.event_type,
          user_id: brandscoreDetail.user_id,
          event_engagement_id: engagementTypeDetails.engagement_id,
        },
      });
      var engagementMaxlevel = Math.max.apply(null, engagement_level);
      if (engagement_level_details[engagementMaxlevel] != undefined) {
        var brandScore = engagement_level_details[engagementMaxlevel];
        const brandScoreIncreaseData = {
          brand_id: brandscoreDetail.brand_id,
          user_id: brandscoreDetail.user_id,
          event_id: brandscoreDetail.task_id,
          event_type: brandscoreDetail.event_type,
          event_hashtag: brandscoreDetail.event_hashtag,
          event_engagement_id: engagementTypeDetails.engagement_id,
          platform_id: 1,
          brandscore_user_score_increase: brandScore,
        };
        if (scoreIncreaseDetails) {
          brandscoreIncrease.update(brandScoreIncreaseData, {
            where: {
              brandscore_increase_id:
                scoreIncreaseDetails.brandscore_increase_id,
            },
          });
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
    console.log("Inside Send SMS Call: " + accID);
    console.log("Inside Send SMS Call: " + authToken);
    console.log("Inside Send SMS Call: " + fromPhone);
    var client = new twilio(accID, authToken);
    client.messages
      .create({
        body: msg,
        from: fromPhone,
        to: phone,
      })
      .then((message) => console.log(message.sid))
      .catch((err) => {
        console.log(err);
      });
  };
  Common.prototype.searchObject = function () {
    return {
      Profile: "profile",
      Comments: "comments",
      Tasks: "tasks",
      TasksJson: "tasksjson",
      Survey: "survey",
      Quizes: "quizes",
      Contest: "contest",
      Brand: "brand",
      Hashtags: "hashtags",
    };
  };

  Common.prototype.searchUserCount = function () {
    return 7;
  };
  Common.prototype.getContentReportUser = async function (
    contentReportTypes,
    UserId
  ) {
    var reportOptions = {
      attributes: ["content_report_type_id", "content_report_type"],
      where: {
        content_report_type: contentReportTypes,
        content_report_uid: UserId,
        cru_status: 1,
      },
    };
    return await db.content_report_user.findAll(reportOptions);
  };

  Common.prototype.contentReportTypes = function () {
    return {
      User: [
        {
          id: "u_id",
          db: db.users,
        },
        {
          id: "u_id",
          db: db.user_profile,
        },
      ],
      Task: [
        {
          id: "ta_task_id",
          db: db.tasks,
        },
        {
          id: "tj_task_id",
          db: db.tasks_json,
        },
      ],
      Brand: [
        {
          id: "cr_co_id",
          db: "db.brands",
        },
      ],
      Contest: [
        {
          id: "ct_id",
          db: db.contest_task,
        },
      ],
      Campaign: [
        {
          id: "cp_campaign_id",
          db: db.campaigns,
        },
      ],
      User_Task_Post: [
        {
          id: "ucpl_id",
          db: db.user_content_post,
        },
      ],
      Comment: [
        {
          id: "pc_post_id",
          db: db.post_comment,
        },
      ],
      Post_Report: [
        {
          id: "pr_id",
          db: db.post_report,
        },
      ],
    };
  };
  Common.prototype.validateSortParameters = function (sortOrder, sortBy) {
    sortOrder = sortOrder.toLowerCase();
    var error_message = "";
    if (sortOrder && sortOrder != "asc" && sortOrder != "desc") {
      error_message = "Invalid sortOrder";
    }
    if (sortBy) {
      var isValid = /^[a-zA-Z0-9,_]*$/.test(sortBy);
      if (!isValid) {
        error_message = "Invalid sortBy";
      }
      return error_message;
    }
  };
}
module.exports = new Common();
