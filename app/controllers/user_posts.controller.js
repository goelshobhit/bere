const db = require("../models");
const Posts = db.user_content_post;
const Tasks = db.tasks
const Brand = db.brands;
const ledgerTransactions = db.ledger_transactions;
const Contest = db.contest_task
const reactions = db.post_user_reactions;
const Comment = db.post_comment
const budgetHistory = db.budget_history;
const Op = db.Sequelize.Op;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const User_profile = db.user_profile;
const bonus_set = db.bonus_set;
const BonusTicketRules = db.bonus_ticket_rules;
const BonusTicketRule = db.bonus_ticket_rule;
const bonusTicketDetails = db.bonus_ticket_details;
const bonus_user = db.bonus_usr;

const common = require("../common");
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
/**
 * Function to add new Hashtag
 * @param  {object} req expressJs request object
 * @param  {object} res expressJs response object
 * @return {Promise}
*/
exports.createNewPost = async (req, res) => {
    const body = req.body;
    if (!req.body["Task id"] || !req.body["Post hashtags"] || !req.body["Post insta answers"] || !req.body["Post insta friends"]) {
        res.status(400).send({
            message: "Hashtag name ,hash tags,insta answers and friends are required."
        });
        return;
    }
    var content_id = makeid(3);
    var content_data = {
        insta_caption: req.body["Post insta answers"],
        media: [],
        insta_friends: req.body["Post insta friends"],
        thumbs: []
    }
    var userId = req.body["userId"] ? req.body["userId"] : req.header(process.env.UKEY_HEADER || "x-api-key");
    var addedBY = req.body["userId"] ? 0 : 1;

    if (parseInt(req.body["Post Type"]) === 1) {
        let TaskDetails = await Tasks.findOne({
            include: [{
                model: db.campaigns,
                attributes: ["cr_co_id"]
            }],
            where: {
                ta_task_id: req.body["Task id"]
            },
            attributes: ["ta_name", "ta_total_available", "ta_budget_per_user", "ta_stars_per_user", "ta_remaining_budget", "ta_task_id", 'bonus_set_id', 'bonus_reward_type', 'tickets_per_task_submissions']
        });
        if (!TaskDetails || !TaskDetails.campaign.cr_co_id) {
            res.status(400).send({
                msg: "Invalid campaign"
            });
            return;
        }
        const BrandDetails = await Brand.findOne({
            where: {
                cr_co_id: TaskDetails.campaign.cr_co_id
            },
            attributes: ["cr_co_alias", "cr_co_name", "cr_co_logo_path", "cr_co_id"]
        });
        if (BrandDetails && BrandDetails.cr_co_alias && BrandDetails.cr_co_alias !== "null") {
            content_id = BrandDetails.cr_co_alias;
        }
        var brandView = {
            id: BrandDetails.cr_co_id,
            name: BrandDetails.cr_co_name,
            logo: BrandDetails.cr_co_logo_path
        };

        var available_budget = TaskDetails.ta_remaining_budget ? parseInt(TaskDetails.ta_remaining_budget) - parseInt(TaskDetails.ta_budget_per_user) : parseInt(TaskDetails.ta_total_available) - parseInt(TaskDetails.ta_budget_per_user);
        var userProfile = await User_profile.findOne({ attributes: ['u_stars', 'u_budget'], where: { u_id: userId } });
        const profileData = {
            u_stars: userProfile.u_stars ? parseInt(userProfile.u_stars) + parseInt(TaskDetails.ta_stars_per_user) : TaskDetails.ta_stars_per_user,
            u_budget: userProfile.u_budget ? parseInt(userProfile.u_budget) + parseInt(TaskDetails.ta_budget_per_user) : TaskDetails.ta_budget_per_user
        };
        budgetHistory.create({
            u_id: userId,
            ta_task_id: req.body["Task id"],
            bud_budget: TaskDetails.ta_budget_per_user,
            bud_heart: TaskDetails.ta_stars_per_user,
            bud_available: available_budget
        }).catch(err => {
            logger.log("error", err + ": Error occurred while creating the budgetHistory for user:" + userId);
        });
        User_profile.update(profileData, {
            where: {
                u_id: userId
            }
        }).catch(err => {
            logger.log("error", err + ": Error occurred while updating the u_stars for user:" + userId);
        });
        Tasks.update({ ta_remaining_budget: available_budget }, {
            where: {
                ta_task_id: req.body["Task id"]
            }
        }).catch(err => {
            logger.log("error", err + ": Error occurred while ta_remaining_budget the Tasks:" + req.body["Task id"]);
        });
        var contentId = content_id + "_" + req.header(process.env.UKEY_HEADER || "x-api-key") + "_" + new Date().getTime();
        const data = {
            "ta_task_id": req.body["Task id"],
            "ucpl_content_hashtags": req.body["Post hashtags"],
            "custom_hashtags": req.body["Custom Hashtags"] ? req.body["Custom Hashtags"] : '',
            "caption": req.body["Caption"] ? req.body["Caption"] : '',
            "video_response": req.body["Video Response"] ? req.body["Video Response"] : '',
            "ucpl_content_type": req.body["Post Type"] ? req.body["Post Type"] : 1,
            "ucpl_content_id": contentId,
            "ucpl_u_id": userId,
            "ucpl_content_data": content_data,
            "ucpl_status": 1,
            "ucpl_instagram_select": 0,
            "ucpl_content_likes_count": 0,
            "ucpl_content_hearts": 0,
            "ucpl_content_stars": 0,
            "ucpl_user_fav": [],
            "upcl_brand_details": brandView,
            "ucpl_added_by": addedBY
        }
        var is_bonus_set_active = 0;
        if (TaskDetails.bonus_reward_type == '2') {
            var todayDate = new Date().getDate();
            var bonusSetActiveDetails = {};
            if (TaskDetails.bonus_set_id) {
                var bonusSetDetails = await bonus_set.findOne({
                    where: {
                        bonus_set_id: TaskDetails.bonus_set_id
                    }
                });
                if (bonusSetDetails) {
                    if (bonusSetDetails.bonus_set_start_date) {
                        var startDate = new Date(bonusSetDetails.bonus_set_start_date);
                        var bonus_set_end_date = startDate.setDate(startDate.getDate() + bonusSetDetails.bonus_set_duration);
                        bonus_set_end_date.toLocaleString('en-US', { timeZone: 'Asia/Calcutta' })
                        let bonus_set_end_date_new = new Date(bonus_set_end_date);

                        if (bonusSetDetails.bonus_set_start_date.getDate() <= todayDate && todayDate <= bonus_set_end_date_new) {
                            is_bonus_set_active = 1;
                            bonusSetActiveDetails = bonusSetDetails;
                        } else {
                            is_bonus_set_active = 0;
                        }
                    }

                }
            }
            if (is_bonus_set_active == 0) {
                const bonus_set_list = await bonus_set.findAll({
                    where: {
                        bonus_set_default: 1
                    }
                });
                bonus_set_list.forEach(element => {
                    if (element.bonus_set_start_date) {
                        var startDate = new Date(element.bonus_set_start_date);
                        var bonus_set_end_date = startDate.setDate(startDate.getDate() + element.bonus_set_duration);
                        bonus_set_end_date.toLocaleString('en-US', { timeZone: 'Asia/Calcutta' })
                        let bonus_set_end_date_new = new Date(bonus_set_end_date);
                        if (bonusSetDetails.bonus_set_start_date.getDate() <= todayDate && todayDate <= bonus_set_end_date_new && is_bonus_set_active == 0) {
                            is_bonus_set_active = 1;
                            bonusSetActiveDetails = bonusSetDetails;
                        }
                    }
                });

            }
        }
        if (bonusSetActiveDetails) {
            const bonusUserDetails = await bonus_user.findOne({
                where: {
                    bonus_usr_id: userId
                }
            });
            if (bonusSetActiveDetails.bonus_tickets_rules_ids.length) {
                var riddim_total_tickets = 0;
                var followers_total_tickets = 0;
                var not_won_total_tickets = 0;
                var riddim_rule_id = 0;
                var followers_rule_id = 0;
                var not_won_rule_id = 0;
                //var total_tickets = {};
                const bonusTicketRules_list = await BonusTicketRules.findAll({
                    include: [{
                        model: BonusTicketRule,
                        attributes: [
                            'bonus_tickets_rule_name'
                        ]
                    }],
                    where: {
                        bonus_tickets_rules_autoid: bonusSetActiveDetails.bonus_tickets_rules_ids
                    }
                });
                //    return res.status(200).send({
                //         message : bonusTicketRules_list
                //     });

                if (bonusTicketRules_list.length) {
                    bonusTicketRules_list.forEach(element => {
                        if (element.bonus_ticket_rule.dataValues.bonus_tickets_rule_name == 'Riddim level' || element.bonus_ticket_rule.dataValues.bonus_tickets_rule_name == 'Followers' || element.bonus_ticket_rule.dataValues.bonus_tickets_rule_name == 'History (Not won)') {
                            var riddimLevel = bonusUserDetails.bonus_usr_riddim_level;
                            var followers = bonusUserDetails.bonus_usr_followers_riddim;
                            var history_not_won = bonusUserDetails.bonus_usr_history_not_won;
                            // return res.status(200).send({
                            //     message : element.bonus_tickets_rules,
                            //     level : riddimLevel
                            // });

                            if (element.bonus_tickets_rules) {
                                for (const bonus_key in element.bonus_tickets_rules) {
                                    var ranges = bonus_key.split("-");
                                    const min_range = ranges[0].trim();
                                    const max_range = ranges[1].trim();
                                    if (element.bonus_ticket_rule.dataValues.bonus_tickets_rule_name == 'Riddim level' && min_range <= riddimLevel && riddimLevel <= max_range) {
                                        riddim_total_tickets = element.bonus_tickets_rules[bonus_key];
                                        riddim_rule_id = element.bonus_tickets_rules_autoid;
                                        //total_tickets['riddim_total_tickets']['total_tickets'] =  element.bonus_tickets_rules[bonus_key];
                                    }
                                    if (element.bonus_ticket_rule.dataValues.bonus_tickets_rule_name == 'Followers' && min_range <= followers && followers <= max_range) {
                                        followers_total_tickets = element.bonus_tickets_rules[bonus_key];
                                        followers_rule_id = element.bonus_tickets_rules_autoid;
                                        // total_tickets['followers_total_tickets']['total_tickets'] =  element.bonus_tickets_rules[bonus_key];
                                    }

                                    if (element.bonus_ticket_rule.dataValues.bonus_tickets_rule_name == 'History (Not won)' && min_range <= history_not_won && history_not_won <= max_range) {
                                        not_won_total_tickets = element.bonus_tickets_rules[bonus_key];
                                        not_won_rule_id = element.bonus_tickets_rules_autoid;
                                        // total_tickets['not_won_total_tickets']['total_tickets'] =  element.bonus_tickets_rules[bonus_key];
                                    }
                                }
                            }
                        }
                    });
                    // return res.status(200).send({
                    //     message: bonusTicketRules_list,
                    //     bonusUserDetails: bonusUserDetails
                    // });
                    if (riddim_total_tickets) {
                        bonusTicketDetails.create({
                            user_id: userId,
                            bonus_set_id: bonusSetActiveDetails.bonus_set_id,
                            event_id: req.body["Task id"],
                            event_type: 'Task',
                            bonus_ticket_rules_id: riddim_rule_id,
                            tickets_earned_for: 'Riddim level',
                            tickets_earned: riddim_total_tickets
                        }).catch(err => {
                            logger.log("error", err + ": Error occurred while creating the bonus ticket details for user riddim level:" + userId);
                        });
                    }
                    if (followers_total_tickets) {
                        bonusTicketDetails.create({
                            user_id: userId,
                            bonus_set_id: bonusSetActiveDetails.bonus_set_id,
                            event_id: req.body["Task id"],
                            event_type: 'Task',
                            bonus_ticket_rules_id: followers_rule_id,
                            tickets_earned_for: 'Followers',
                            tickets_earned: followers_total_tickets
                        }).catch(err => {
                            logger.log("error", err + ": Error occurred while creating the bonus ticket details for user riddim level:" + userId);
                        });
                    }
                    if (not_won_total_tickets) {
                        bonusTicketDetails.create({
                            user_id: userId,
                            bonus_set_id: bonusSetActiveDetails.bonus_set_id,
                            event_id: req.body["Task id"],
                            event_type: 'Task',
                            bonus_ticket_rules_id: not_won_rule_id,
                            tickets_earned_for: 'History (Not won)',
                            tickets_earned: not_won_total_tickets
                        }).catch(err => {
                            logger.log("error", err + ": Error occurred while creating the bonus ticket details for user riddim level:" + userId);
                        });
                    }
                }
            }
        }
        if (TaskDetails.tickets_per_task_submissions) {
            bonusTicketDetails.create({
                user_id: userId,
                bonus_set_id: 0,
                event_id: req.body["Task id"],
                event_type: 'Task',
                bonus_ticket_rules_id: 0,
                tickets_earned_for: 'Task Submission',
                tickets_earned: TaskDetails.tickets_per_task_submissions
            }).catch(err => {
                logger.log("error", err + ": Error occurred while creating the bonus ticket details for user:" + userId);
            });
        }
            Posts.create(data)
            .then(data => {
                audit_log.saveAuditLog(userId, 'add', 'user_content_post', data.ucpl_id, data.dataValues);
                common.jsonTask(req.body["Task id"], 'Single', 'update');
                let trData = {
                    trx_user_id: userId,
                    trx_unique_id: data.ucpl_id + "-" + userId + "-" + new Date().getTime(),
                    trx_type: 1,
                    trx_coins: TaskDetails.ta_budget_per_user,
                    trx_stars: TaskDetails.ta_stars_per_user,
                    trx_date_timestamp: new Date().getTime(),
                    trx_source: {
                        "brand_details": brandView,
                        "post_details": content_data,
                        "task_details": TaskDetails,
                        "task_type": "Single",
                        "postid": data.ucpl_id
                    },
                    trx_approval_status: 0,
                    trx_description: TaskDetails.ta_name
                };
                console.log(trData)
                ledgerTransactions.create(trData).catch(err => {
                    logger.log("error", err + ": Error occurred while ledgerTransactions for :" + userId);
                });
                common.manageUserAccount(userId, TaskDetails.ta_budget_per_user, TaskDetails.ta_stars_per_user, 'credit');
                res.status(201).send({
                    content_id: contentId,
                    message: "Posts Added Successfully"
                });
            })
            .catch(err => {
                logger.log("error", err + ":Some error occurred while creating the post");
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Hashtag."
                });
            });
    }
    if (parseInt(req.body["Post Type"]) === 2) {
        let TaskDetails = await Contest.findOne({
            include: [{
                model: db.campaigns,
                attributes: ["cr_co_id"]
            }],
            where: {
                ct_id: req.body["Task id"]
            },
            attributes: [
                ["ct_name", "ta_name"], ["ct_total_available", "ta_total_available"], ["ct_budget_per_user", "ta_budget_per_user"], ["ct_stars_per_user", "ta_stars_per_user"], ["ct_id", "ta_task_id"]
            ]
        });
        if (!TaskDetails || !TaskDetails.campaign.cr_co_id) {
            res.status(400).send({
                msg: "Invalid campaign or contest"
            });
            return;
        }
        const BrandDetails = await Brand.findOne({
            where: {
                cr_co_id: TaskDetails.campaign.cr_co_id
            },
            attributes: ["cr_co_alias", "cr_co_name", "cr_co_logo_path", "cr_co_id"]
        });
        if (BrandDetails && BrandDetails.cr_co_alias && BrandDetails.cr_co_alias !== "null") {
            content_id = BrandDetails.cr_co_alias;
        }
        var brandView = {
            id: BrandDetails.cr_co_id,
            name: BrandDetails.cr_co_name,
            logo: BrandDetails.cr_co_logo_path
        };

        var available_budget = TaskDetails.dataValues.ta_remaining_budget ? parseInt(TaskDetails.dataValues.ta_remaining_budget) - parseInt(TaskDetails.dataValues.ta_budget_per_user) : parseInt(TaskDetails.dataValues.ta_total_available) - parseInt(TaskDetails.dataValues.ta_budget_per_user);
        var userProfile = await User_profile.findOne({ attributes: ['u_stars', 'u_budget'], where: { u_id: userId } });
        let profileData = {
            u_stars: userProfile.u_stars && parseInt(userProfile.u_stars) > 0 ? parseInt(userProfile.u_stars) + parseInt(TaskDetails.dataValues.ta_stars_per_user) : TaskDetails.dataValues.ta_stars_per_user,
            u_budget: userProfile.u_budget && parseInt(userProfile.u_budget) > 0 ? parseInt(userProfile.u_budget) + parseInt(TaskDetails.dataValues.ta_budget_per_user) : TaskDetails.dataValues.ta_budget_per_user
        };
        budgetHistory.create({
            u_id: userId,
            ta_task_id: req.body["Task id"],
            bud_budget: TaskDetails.dataValues.ta_budget_per_user,
            bud_heart: TaskDetails.dataValues.ta_stars_per_user,
            bud_available: available_budget
        }).catch(err => {
            logger.log("error", err + ": Error occurred while creating the budgetHistory for user:" + userId);
        });
        User_profile.update(profileData, {
            where: {
                u_id: userId
            }
        }).catch(err => {
            logger.log("error", err + ": Error occurred while creating the  u_stars for user:" + userId);
        });
        var contentId = content_id + "_" + req.header(process.env.UKEY_HEADER || "x-api-key") + "_" + new Date().getTime();
        const data = {
            "ta_task_id": req.body["Task id"],
            "ucpl_content_hashtags": req.body["Post hashtags"],
            "custom_hashtags": req.body["Custom Hashtags"] ? req.body["Custom Hashtags"] : '',
            "caption": req.body["Caption"] ? req.body["Caption"] : '',
            "video_response": req.body["Video Response"] ? req.body["Video Response"] : '',
            "ucpl_content_type": req.body["Post Type"] ? req.body["Post Type"] : 1,
            "ucpl_content_id": contentId,
            "ucpl_u_id": userId,
            "ucpl_content_data": content_data,
            "ucpl_status": 1,
            "ucpl_instagram_select": 0,
            "ucpl_content_likes_count": 0,
            "ucpl_content_hearts": 0,
            "ucpl_content_stars": 0,
            "ucpl_user_fav": [],
            "upcl_brand_details": brandView,
            "ucpl_added_by": addedBY
        }
        Posts.create(data)
            .then(data => {
                ledgerTransactions.create({
                    trx_user_id: userId,
                    trx_unique_id: data.ucpl_id + "-" + userId + "-" + new Date().getTime(),
                    trx_type: 1,
                    trx_coins: 0,
                    trx_stars: TaskDetails.dataValues.ta_stars_per_user,
                    trx_date_timestamp: new Date().getTime(),
                    trx_source: {
                        brand_details: brandView,
                        post_details: content_data,
                        task_details: TaskDetails.dataValues,
                        postid: data.ucpl_id,
                        task_type: "Contest"
                    },
                    trx_approval_status: 0,
                    trx_description: TaskDetails.dataValues.ta_name
                }).catch(err => {
                    logger.log("error", err + ": Error occurred while creating the ledgerTransactions for user:" + userId);
                });
                common.manageUserAccount(userId, 0, TaskDetails.dataValues.ta_stars_per_user, 'credit');
                common.jsonTask(req.body["Task id"], 'Contest', 'update');
                audit_log.saveAuditLog(userId, 'add', 'user_content_post', data.ucpl_id, data.dataValues);
                res.status(201).send({
                    content_id: contentId,
                    message: "Posts Added Successfully"
                });

            })
            .catch(err => {
                logger.log("error", err + ":Some error occurred while creating the post");
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Hashtag."
                });
            });
    }
}

/**
 * Function to get all Hashtag
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.listing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'ucpl_content_likes_count'
    const sortOrder = req.query.sortOrder || 'asc'
    const sortVal = req.query.sortVal;
    const Uid = req.header(process.env.UKEY_HEADER || "x-api-key");

    const contentUserTaskIds = await common.getContentReportUser(['Task', 'Contest', 'User Task Post', 'User'], Uid);

    let taskIdsValues = [];
    let userIdsValues = [];
    let ConsentIdsValues = [];
    let userTaskPostIdsValues = [];
    if (contentUserTaskIds.length) {
        contentUserTaskIds.forEach(element => {
            if (element.content_report_type == 'Task') {
                taskIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'User') {
                userIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'Contest') {
                ConsentIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'User Task Post') {
                userTaskPostIdsValues.push(element.content_report_type_id);
            }
        });
    }
    var options = {
        include: [
            {
                model: db.user_profile,
                attributes: ["u_id", ["u_display_name", "post_username"], ["u_prof_img_path", "post_user_imgpath"]],
                required: false,
                where: {
                    is_autotakedown: 0, u_id: {
                        [Op.not]: userIdsValues
                    }
                }
            },
            {
                model: db.tasks,
                as: 'taskPosts',
                attributes: ["ta_task_id", "ta_name"],
                required: false,
                where: {
                    is_autotakedown: 0, ta_task_id: {
                        [Op.not]: taskIdsValues
                    }
                }
            },
            {
                model: Contest,
                as: 'contestPosts',
                attributes: [["ct_id", "ta_task_id"], ["ct_name", "ta_name"]],
                required: false,
                where: {
                    is_autotakedown: 0, ct_id: {
                        [Op.not]: ConsentIdsValues
                    }
                }
            },
            {
                model: db.post_user_reactions,
                attributes: [["pu_re_text", "my_reaction"]],
                where: { u_id: Uid },
                required: false,
                limit: 1,
                order: [
                    ['pu_re_id', 'DESC']
                ]
            }
        ],
        attributes: [
            "ucpl_id", "ucpl_content_id",
            ["ucpl_content_data", "post_data"],
            ["ucpl_content_likes_count", 'post_likes'],
            ["ucpl_content_hearts", 'post_hearts'],
            ["ucpl_content_stars", 'post_stars'],
            ["ucpl_status", 'post_status'],
            ["ucpl_reaction_counter", 'post_reaction'],
            "custom_hashtags", "caption", "video_response",
            ["upcl_brand_details", 'post_brand'],
            [db.sequelize.literal('(SELECT COUNT(*) FROM post_comment WHERE post_comment.ucpl_id = user_content_post.ucpl_id)'), 'post_comment_count'],
            ["ucpl_content_hashtags", 'post_hashtags'], ['ucpl_user_fav', 'post_fav_users'], ['ucpl_created_at', 'post_createdAt'], "ucpl_added_by"],
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {
            ucpl_status: 1,
            ucpl_content_data: {
                media: {
                    [Op.not]: "[]"
                }
            }
        }
    };
    if (req.query.sortVal) {
        var sortValue = req.query.sortVal;
        options.where = sortValue ? {
            [sortBy]: `${sortValue}`
        } : null;
    }
    if (userTaskPostIdsValues.length) {
        options['where']['ucpl_id'] = {
            [Op.not]: userTaskPostIdsValues
        }
    }
    options['where']['is_autotakedown'] = 0;

    var total = await Posts.count({
        where: options['where']
    });
    const post_list = await Posts.findAll(options);
    res.status(200).send({
        data: post_list,
        totalRecords: total,
        media_token: common.imageToken(Uid)
    });
}
/**
 * Function to get all Post
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.userPostlisting = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'ucpl_content_likes_count'
    const sortOrder = req.query.sortOrder || 'asc'
    const userId = req.query.userId;
    const sortId = req.query.sortId;
    const Uid = req.header(process.env.UKEY_HEADER || "x-api-key");
    const contentUserTaskIds = await common.getContentReportUser(['Task', 'Contest', 'User Task Post', 'User'], Uid);

    let taskIdsValues = [];
    let userIdsValues = [];
    let ConsentIdsValues = [];
    let userTaskPostIdsValues = [];
    if (contentUserTaskIds.length) {
        contentUserTaskIds.forEach(element => {
            if (element.content_report_type == 'Task') {
                taskIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'User') {
                userIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'Contest') {
                ConsentIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'User Task Post') {
                userTaskPostIdsValues.push(element.content_report_type_id);
            }
        });
    }

    var options = {
        include: [
            {
                model: db.user_profile,
                attributes: ["u_id", ["u_display_name", "post_username"], ["u_prof_img_path", "post_user_imgpath"]],
                required: false,
                where: {
                    is_autotakedown: 0, u_id: {
                        [Op.not]: userIdsValues
                    }
                }
            },
            {
                model: db.tasks,
                as: 'taskPosts',
                attributes: ["ta_task_id", "ta_name"],
                required: false,
                where: {
                    is_autotakedown: 0, ta_task_id: {
                        [Op.not]: taskIdsValues
                    }
                }
            },
            {
                model: Contest,
                as: 'contestPosts',
                attributes: [["ct_id", "ta_task_id"], ["ct_name", "ta_name"]],
                required: false,
                where: {
                    is_autotakedown: 0, ct_id: {
                        [Op.not]: ConsentIdsValues
                    }
                }
            },
            {
                model: db.post_user_reactions,
                attributes: [["pu_re_text", "my_reaction"]],
                where: { u_id: Uid },
                required: false,
                limit: 1,
                order: [
                    ['pu_re_id', 'DESC']
                ]
            }
        ],
        attributes: [
            "ucpl_id", "ucpl_content_id",
            ["ucpl_content_data", "post_data"],
            ["ucpl_content_likes_count", 'post_likes'],
            ["ucpl_content_hearts", 'post_hearts'],
            ["ucpl_content_stars", 'post_stars'],
            ["ucpl_status", 'post_status'],
            ["ucpl_reaction_counter", 'post_reaction'],
            "custom_hashtags", "caption", "video_response",
            ["upcl_brand_details", 'post_brand'],
            [db.sequelize.literal('(SELECT COUNT(*) FROM post_comment WHERE post_comment.ucpl_id = user_content_post.ucpl_id)'), 'post_comment_count'],
            ["ucpl_content_hashtags", 'post_hashtags'], ['ucpl_user_fav', 'post_fav_users'], ['ucpl_created_at', 'post_createdAt'], "ucpl_added_by"],
        limit: pageSize,
        offset: skipCount,
        order: sortId ? [[db.sequelize.literal("ucpl_id <> " + sortId)]] : [[sortBy, sortOrder]],
        where: {
            ucpl_status: 1,
            ucpl_u_id: userId,
            ucpl_content_data: {
                media: {
                    [Op.not]: "[]"
                }
            }
        }
    };
    if (userTaskPostIdsValues.length) {
        options['where']['ucpl_id'] = {
            [Op.not]: userTaskPostIdsValues
        }
    }
    options['where']['is_autotakedown'] = 0;
    var total = await Posts.count({
        where: options['where']
    });
    const post_list = await Posts.findAll(options);
    res.status(200).send({
        data: post_list,
        totalRecords: total,
        media_token: common.imageToken(Uid)
    });
}
/**
 * Function to get all Post by taskid
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.taskPostlisting = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'ucpl_content_likes_count'
    const sortOrder = req.query.sortOrder || 'asc'
    const taskId = req.query.taskId;
    const sortId = req.query.sortId;
    const Uid = req.header(process.env.UKEY_HEADER || "x-api-key");
    const contentUserTaskIds = await common.getContentReportUser(['Task', 'Contest', 'User Task Post', 'User'], Uid);

    let taskIdsValues = [];
    let userIdsValues = [];
    let ConsentIdsValues = [];
    let userTaskPostIdsValues = [];
    if (contentUserTaskIds.length) {
        contentUserTaskIds.forEach(element => {
            if (element.content_report_type == 'Task') {
                taskIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'User') {
                userIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'Contest') {
                ConsentIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'User Task Post') {
                userTaskPostIdsValues.push(element.content_report_type_id);
            }
        });
    }

    var options = {
        include: [
            {
                model: db.user_profile,
                attributes: ["u_id", ["u_display_name", "post_username"], ["u_prof_img_path", "post_user_imgpath"]],
                required: false,
                where: {
                    is_autotakedown: 0, u_id: {
                        [Op.not]: userIdsValues
                    }
                }
            },
            {
                model: db.tasks,
                as: 'taskPosts',
                attributes: ["ta_task_id", "ta_name"],
                required: false,
                where: {
                    is_autotakedown: 0, ta_task_id: {
                        [Op.not]: taskIdsValues
                    }
                }
            },
            {
                model: Contest,
                as: 'contestPosts',
                attributes: [["ct_id", "ta_task_id"], ["ct_name", "ta_name"]],
                required: false,
                where: {
                    is_autotakedown: 0, ct_id: {
                        [Op.not]: ConsentIdsValues
                    }
                }
            },
            {
                model: db.post_user_reactions,
                attributes: [["pu_re_text", "my_reaction"]],
                where: { u_id: Uid },
                required: false,
                limit: 1,
                order: [
                    ['pu_re_id', 'DESC']
                ]
            }
        ],
        attributes: [
            "ucpl_id", "ucpl_content_id",
            ["ucpl_content_data", "post_data"],
            ["ucpl_content_likes_count", 'post_likes'],
            ["ucpl_content_hearts", 'post_hearts'],
            ["ucpl_content_stars", 'post_stars'],
            ["ucpl_status", 'post_status'],
            ["ucpl_reaction_counter", 'post_reaction'],
            "custom_hashtags", "caption", "video_response",
            ["upcl_brand_details", 'post_brand'],
            [db.sequelize.literal('(SELECT COUNT(*) FROM post_comment WHERE post_comment.ucpl_id = user_content_post.ucpl_id)'), 'post_comment_count'],
            ["ucpl_content_hashtags", 'post_hashtags'], ['ucpl_user_fav', 'post_fav_users'], ['ucpl_created_at', 'post_createdAt'], "ucpl_added_by"],
        limit: pageSize,
        offset: skipCount,
        order: sortId ? [[db.sequelize.literal("ucpl_id <> " + sortId)]] : [[sortBy, sortOrder]],
        where: {
            ucpl_status: 1,
            ta_task_id: taskId,
            ucpl_content_data: {
                media: {
                    [Op.not]: "[]"
                }
            }
        }
    };
    if (userTaskPostIdsValues.length) {
        options['where']['ucpl_id'] = {
            [Op.not]: userTaskPostIdsValues
        }
    }

    options['where']['is_autotakedown'] = 0;
    var total = await Posts.count({
        where: options['where']
    });
    const post_list = await Posts.findAll(options);
    res.status(200).send({
        data: post_list,
        totalRecords: total,
        media_token: common.imageToken(Uid)
    });
}

/**
 * Function to get all Hashtag
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.relatedPosts = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'ucpl_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;
    const content_id = req.query.content_id;
    const task_id = req.query.task_id;
    const Uid = req.header(process.env.UKEY_HEADER || "x-api-key");
    const contentUserTaskIds = await common.getContentReportUser(['Task', 'Contest', 'User Task Post'], Uid);

    let taskIdsValues = [];
    let ConsentIdsValues = [];
    let userTaskPostIdsValues = [];
    if (contentUserTaskIds.length) {
        contentUserTaskIds.forEach(element => {
            if (element.content_report_type == 'Task') {
                taskIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'Contest') {
                ConsentIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'User Task Post') {
                userTaskPostIdsValues.push(element.content_report_type_id);
            }
        });
    }
    var options = {
        include: [
            {
                model: db.tasks,
                as: 'taskPosts',
                attributes: ["ta_task_id", "ta_name"],
                required: false,
                where: {
                    is_autotakedown: 0, ta_task_id: {
                        [Op.not]: taskIdsValues
                    }
                }
            },
            {
                model: Contest,
                as: 'contestPosts',
                attributes: [["ct_id", "ta_task_id"], ["ct_name", "ta_name"]],
                required: false,
                where: {
                    is_autotakedown: 0, ct_id: {
                        [Op.not]: ConsentIdsValues
                    }
                }
            },
        ],
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {
            ucpl_content_id: {
                [Op.not]: content_id
            },
            ta_task_id: task_id,
            ucpl_status: 1
        }
    };
    if (req.query.sortVal) {
        var sortValue = req.query.sortVal;
        options.where = sortValue ? {
            [sortBy]: `${sortValue}`
        } : null;
    }
    if (userTaskPostIdsValues.length) {
        options['where']['ucpl_id'] = {
            [Op.not]: userTaskPostIdsValues
        }
    }

    options['where']['is_autotakedown'] = 0;
    var total = await Posts.count({
        where: options['where']
    });
    const post_list = await Posts.findAll(options);
    res.status(200).send({
        data: post_list,
        totalRecords: total
    });
}
/**
 * Function to get Post details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.postDetail = async (req, res) => {
    const postID = req.params.content_id;
    const Uid = req.header(process.env.UKEY_HEADER || "x-api-key");
    const PostDetails = await Posts.findOne({
        include: [
            {
                model: db.user_profile,
                attributes: ["u_id", ["u_display_name", "post_username"], ["u_prof_img_path", "post_user_imgpath"]],
                required: false
            },
            {
                model: db.post_user_reactions,
                attributes: [["pu_re_text", "my_reaction"]],
                where: { u_id: Uid },
                required: false,
                limit: 1,
                order: [
                    ['pu_re_id', 'DESC']
                ]
            }
        ],
        attributes: [
            "ucpl_id", "ucpl_content_id",
            ["ucpl_content_data", "post_data"],
            ["ucpl_content_likes_count", 'post_likes'],
            ["ucpl_content_hearts", 'post_hearts'],
            ["ucpl_content_stars", 'post_stars'],
            ["ucpl_status", 'post_status'],
            ["ucpl_reaction_counter", 'post_reaction'],
            "custom_hashtags", "caption", "video_response",
            ["upcl_brand_details", 'post_brand'],
            [db.sequelize.literal('(SELECT COUNT(*) FROM post_comment WHERE post_comment.ucpl_id = user_content_post.ucpl_id)'), 'post_comment_count'],
            ["ucpl_content_hashtags", 'post_hashtags'], ['ucpl_user_fav', 'post_fav_users'], ['ucpl_created_at', 'post_createdAt']],
        where: {
            ucpl_content_id: postID
        }
    });
    if (!PostDetails) {
        res.status(500).send({
            message: "post not found"
        });
        return
    }
    res.status(200).send({
        data: PostDetails,
        media_token: common.imageToken(postID)
    })
}
/**
 * Function to get Post details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.postDetailBYid = async (req, res) => {
    const postID = req.params.post_id;
    const Uid = req.header(process.env.UKEY_HEADER || "x-api-key");
    const PostDetails = await Posts.findOne({
        include: [
            {
                model: db.user_profile,
                attributes: ["u_id", ["u_display_name", "post_username"], ["u_prof_img_path", "post_user_imgpath"]],
                required: false
            },
            {
                model: db.tasks,
                as: 'taskPosts',
                attributes: ["ta_task_id", "ta_name"],
                required: false
            },
            {
                model: Contest,
                as: 'contestPosts',
                attributes: [["ct_id", "ta_task_id"], ["ct_name", "ta_name"]],
                required: false
            },
            {
                model: db.post_user_reactions,
                attributes: [["pu_re_text", "my_reaction"]],
                where: { u_id: Uid },
                required: false,
                limit: 1,
                order: [
                    ['pu_re_id', 'DESC']
                ]
            }
        ],
        attributes: [
            "ucpl_id", "ucpl_content_id",
            ["ucpl_content_data", "post_data"],
            ["ucpl_content_likes_count", 'post_likes'],
            ["ucpl_content_hearts", 'post_hearts'],
            ["ucpl_content_stars", 'post_stars'],
            ["ucpl_status", 'post_status'],
            ["ucpl_reaction_counter", 'post_reaction'],
            "custom_hashtags", "caption", "video_response",
            ["upcl_brand_details", 'post_brand'],
            [db.sequelize.literal('(SELECT COUNT(*) FROM post_comment WHERE post_comment.ucpl_id = user_content_post.ucpl_id)'), 'post_comment_count'],
            ["ucpl_content_hashtags", 'post_hashtags'], ['ucpl_user_fav', 'post_fav_users'], ['ucpl_created_at', 'post_createdAt'], "ucpl_added_by"],
        where: {
            ucpl_id: postID
        }
    });
    if (!PostDetails) {
        res.status(500).send({
            message: "post not found"
        });
        return
    }
    res.status(200).send({
        data: PostDetails,
        media_token: common.imageToken(postID)
    })
}
/**
 * Function to add,delete favourite Post
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.favouritePost = async (req, res) => {
    const postID = req.params.post_id;
    const Uid = parseInt(req.header(process.env.UKEY_HEADER || "x-api-key"));
    var postDetails = await Posts.findOne({
        where: {
            ucpl_id: postID
        },
        attributes: ['ucpl_user_fav']
    });
    if (!postDetails) {
        res.status(500).send({
            message: "post not found"
        });
        return
    }
    if (postDetails.ucpl_user_fav) {
        var hasFav = Object.values(postDetails.ucpl_user_fav).includes(Uid);
        if (!hasFav) {
            var favArr = postDetails.ucpl_user_fav;
            if (req.body.addToFav == 1) {
                favArr.push(Uid);
            }
        } else {
            var favArr = postDetails.ucpl_user_fav;
            if (req.body.addToFav !== 1) {
                const index = favArr.indexOf(Uid);
                if (index > -1) {
                    favArr.splice(index, 1);
                }
            }
        }
    } else {
        var favArr = [];
        if (req.body.addToFav == 1) {
            favArr.push(Uid);
        }
    }
    console.log(favArr);
    Posts.update({
        "ucpl_user_fav": favArr
    }, {
        where: {
            ucpl_id: postID
        }
    });
    res.status(200).send({
        message: req.body["addToFav"] ? "Added to favourite" : "Removed from favourite"
    })
}
/**
 * Function to delete  Post
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deletePost = async (req, res) => {
    var userId = req.header(process.env.UKEY_HEADER || "x-api-key");
    if (!req.params.post_id || !userId) {
        res.status(403).send({
            message: "post id required"
        });
        return;
    }
    var postDetails = await Posts.findOne({
        where: {
            ucpl_id: req.params.post_id,
            ucpl_u_id: userId
        }
    });
    if (!postDetails) {
        res.status(400).send({
            message: "Can not delete other user post"
        });
        return;
    }
    Posts.update({ ucpl_status: 2 }, {
        returning: true,
        where: {
            ucpl_id: req.params.post_id
        }
    }).then(function ([num, [result]]) {
        console.log(result.dataValues.ucpl_id);
        console.log(result.dataValues.ta_task_id);
        audit_log.saveAuditLog(userId, 'delete', 'user_content_post', result.dataValues.ucpl_id, result.dataValues);
        common.jsonTask(result.dataValues.ta_task_id, 'Single', 'update');
        res.status(200).send({
            message: "Post Deleted"
        });
    });
}
/**
 * Function to add,delete  Post to not interested
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.notInterestedPost = async (req, res) => {
    const postID = req.params.post_id;
    const Uid = parseInt(req.header(process.env.UKEY_HEADER || "x-api-key"));
    var postDetails = await Posts.findOne({
        where: {
            ucpl_content_id: postID
        },
        attributes: ['ucpl_not_interested']
    });
    if (!postDetails) {
        res.status(500).send({
            message: "post not found"
        });
        return
    }
    if (postDetails.ucpl_not_interested) {
        var hasFav = Object.values(postDetails.ucpl_not_interested).includes(Uid);
        if (!hasFav) {
            var favArr = postDetails.ucpl_not_interested;
            if (req.body.notInterested == 1) {
                favArr.push(Uid);
            }
        } else {
            var favArr = postDetails.ucpl_not_interested;
            if (req.body.notInterested !== 1) {
                const index = favArr.indexOf(Uid);
                if (index > -1) {
                    favArr.splice(index, 1);
                }
            }
        }
    } else {
        var favArr = [];
        if (req.body.notInterested == 1) {
            favArr.push(Uid);
        }
    }
    Posts.update({
        "ucpl_not_interested": favArr
    }, {
        where: {
            ucpl_content_id: postID
        }
    });
    res.status(200).send({
        message: req.body["notInterested"] ? "Post added not interested" : "Removed from added not interested"
    })
}