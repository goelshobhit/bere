const db = require("../models");
const Tasks = db.tasks
const Hashtags = db.hashtags
const Contest = db.contest_task
const taskJson = db.tasks_json
const Op = db.Sequelize.Op;
const ledgerTransactions = db.ledger_transactions;
const upload = require("../middleware/upload");
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const Brand = db.brands;
const Posts = db.user_content_post;
const sharp = require('sharp');
const common = require("../common");
var ffmpeg = require('fluent-ffmpeg');
const User_profile = db.user_profile;
const levelTask = db.level_task;
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNewTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const body = req.body;
    console.log(body);
    const data = {
        "ta_name": body.hasOwnProperty("Task name") ? req.body["Task name"] : "",
        "cp_campaign_id": body.hasOwnProperty("Campaign id") ? req.body["Campaign id"] : "",
        "ta_type": body.hasOwnProperty("Task type") ? req.body["Task type"] : "",
        "ta_desc": body.hasOwnProperty("Task description") ? req.body["Task description"] : "",
        "ta_hashtag": body.hasOwnProperty("Task hashtags") ? req.body["Task hashtags"] : "",
        "ta_token_budget": body.hasOwnProperty("Task token budget") ? req.body["Task token budget"] : 0,
        "ta_budget_per_user": body.hasOwnProperty("Task budget per user") ? req.body["Task budget per user"] : 0,
        "ta_hearts_per_user": body.hasOwnProperty("Task hearts per user") ? req.body["Task hearts per user"] : 0,
        "ta_total_available": body.hasOwnProperty("Task total available") ? req.body["Task total available"] : 0,
        "ta_remaining_budget": body.hasOwnProperty("Task total available") ? req.body["Task total available"] : 0,
        "ta_estimated_user": body.hasOwnProperty("Task estimated user") ? req.body["Task estimated user"] : 0,
        "ta_do": body.hasOwnProperty("Task do") ? req.body["Task do"] : "",
        "ta_dont_do": body.hasOwnProperty("Task dont do") ? req.body["Task dont do"] : "",
        "ta_insta_question": body.hasOwnProperty("Task insta question") ? req.body["Task insta question"] : "",
        "ta_photos_required": body.hasOwnProperty("Task photos required") ? req.body["Task photos required"] : 0,
        "ta_videos_required": body.hasOwnProperty("Task videos required") ? req.body["Task videos required"] : 0,
        "ta_mentioned": body.hasOwnProperty("Task mentioned") ? req.body["Task mentioned"] : "",
        "ta_start_date": body.hasOwnProperty("Task start date") ? req.body["Task start date"] : new Date(),
        "ta_end_date": body.hasOwnProperty("Task end date") ? req.body["Task end date"] : new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
        "ta_status": body.hasOwnProperty("Task status") ? req.body["Task status"] : 0,
        "ta_oneline_summary": body.hasOwnProperty("Task oneline summary") ? req.body["Task oneline summary"] : "",
        "ta_contiue_spend_budget": body.hasOwnProperty("Continue after budget spend") ? req.body["Continue after budget spend"] : false
    }
    Tasks.create(data)
        .then(data => {
            if (req.body["Task hashtags"]) {
                const hashtagsArr = req.body["Task hashtags"];
                for (i = 0; i < hashtagsArr.length; i++) {
                    Hashtags.create({
                        ta_task_id: data.ta_task_id,
                        cp_campaign_id: req.body["Campaign id"],
                        th_hashtag_values: hashtagsArr[i],
                        th_type: 'Single'
                    });
                }
            }
            common.jsonTask(data.ta_task_id, 'Single', 'add');
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'task', data.ta_task_id, data.dataValues);
            res.status(201).send({
                msg: "Tasks Added Successfully",
                taskID: data.ta_task_id,
            });
        })
        .catch(err => {
            logger.log("error", err + ": Some error occurred while creating the Tasks");
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Tasks."
            });
        });
}
/**
 * Function to get all Tasks
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.listing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'ta_task_id'
    const sortOrder = req.query.sortOrder || 'ASC'
    const sortVal = req.query.sortVal;
    var UserId = req.header(process.env.UKEY_HEADER || "x-api-key");
    var todayDate = new Date();
    todayDate.toLocaleString('en-US', { timeZone: 'Asia/Calcutta' })
    console.log(todayDate);
    const contentUserTaskIds = await common.getContentReportUser(['Task', 'Campaign', 'User Task Post'], UserId);
    let taskIdsValues = [];
    let CampaignIdsValues = [];
    let userTaskPostIdsValues = [];
    if (contentUserTaskIds.length) {
        contentUserTaskIds.forEach(element => {
            if (element.content_report_type == 'Task') {
                taskIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'Campaign') {
                CampaignIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'User Task Post') {
                userTaskPostIdsValues.push(element.content_report_type_id);
            }
        });
    }

    var options = {
        include: [
            {
                model: db.campaigns,
                attributes: [
                    ["cp_campaign_name", "Campaign Name"]
                ],
                where: { is_autotakedown: 0 }
            },
            {
                model: Posts,
                attributes:
                    ["ucpl_u_id", "ucpl_content_id"],
                required: false,
                where: {
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
            ta_start_date: {
                [Op.lte]: todayDate
            },
            ta_end_date: {
                [Op.gte]: todayDate
            },
            ta_status: 2
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
    if (CampaignIdsValues.length) {
        options['where']['cp_campaign_id'] = {
            [Op.not]: CampaignIdsValues
        }
    }
    options['where']['is_autotakedown'] = 0;
    var total = await Tasks.count({
        where: options['where']
    });
    const tasks_list = await Tasks.findAll(options);
    res.status(200).send({
        data: tasks_list,
        totalRecords: total
    });
}
/**
 * Function to get all Tasks
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.jsonlisting = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'tj_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;
    const Uid = req.header(process.env.UKEY_HEADER || "x-api-key");
    var todayDate = new Date();
    todayDate.toLocaleString('en-US', { timeZone: 'Asia/Calcutta' })
    const contentUserTaskIds = await common.getContentReportUser(['Task'], Uid);
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
        attributes: [["tj_type", "task_type"], ["tj_task_id", "task_id"], ["tj_data", "task_data"], ["tj_status", "task_status"]],
        where: {
            tj_data: {
                ta_start_date: {
                    [Op.lte]: todayDate
                },
                ta_end_date: {
                    [Op.gte]: todayDate
                }
            },
            tj_task_id: {
                [Op.not]: taskIdsValues
            },
            is_autotakedown: 0
        }
    };
    var total = await taskJson.count({
        where: options['where']
    });
    const tasks_list = await taskJson.findAll(options);
    res.status(200).send({
        data: tasks_list,
        totalRecords: total,
        media_token: common.imageToken(Uid)
    });
}

/**
 * Function to get Tasks details 
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.taskDetail = async (req, res) => {
    console.log(req.query.pageSize + "pageSize");
    const pageSize = parseInt(req.query.pageSize || 9);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const taskID = req.params.taskID;
    const task = await Tasks.findOne({
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
                attributes: [["ucpl_content_id", "ucpl_content_id"], ["ucpl_id", "post_id"], ['ucpl_content_data', 'post_data']],
                required: false,
                limit: pageSize,
                offset: skipCount,
                where: {
                    ucpl_status: 1
                },
                order: [
                    ['ucpl_added_by', 'ASC']
                ]
            }
        ],
        where: {
            ta_task_id: taskID
        }
    });
    if (!task) {
        res.status(500).send({
            message: "task not found"
        });
        return
    }
    res.status(200).send({
        data: task,
        taskDetails: common.taskStatusArr()[task.ta_status],
        media_token: common.imageToken(taskID)
    })
}
/**
 * Function to get contest details 
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.contestDetail = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 9);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const taskID = req.params.ct_id;
    const task = await Contest.findOne({
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
                attributes: [["ucpl_content_id", "ucpl_content_id"], ["ucpl_id", "post_id"], ['ucpl_content_data', 'post_data']],
                required: false,
                limit: pageSize,
                offset: skipCount,
                where: {
                    ucpl_status: 1
                },
                order: [
                    ['ucpl_added_by', 'ASC']
                ]
            }
        ],
        where: {
            ct_id: taskID
        }
    });
    if (!task) {
        res.status(500).send({
            message: "task not found"
        });
        return
    }
    res.status(200).send({
        data: task,
        taskDetails: common.taskStatusArr()[task.ct_status],
        media_token: common.imageToken(taskID)
    })
}
/**
 * Function to update Task details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateTasks = async (req, res) => {
    const id = req.params.taskID;
    const task = await Tasks.findOne({
        where: {
            ta_task_id: id
        }
    });
    Tasks.update(req.body, {
        returning: true,
        where: {
            ta_task_id: id
        }
    }).then(function ([num, [result]]) {
        if (num == 1) {
            if (req.body.ta_hashtag) {
                Hashtags.destroy({
                    where: {
                        ta_task_id: id
                    }
                });
                const hashtagsArr = req.body.ta_hashtag;
                for (i = 0; i < hashtagsArr.length; i++) {
                    Hashtags.create({
                        ta_task_id: id,
                        cp_campaign_id: task.cp_campaign_id,
                        th_hashtag_values: hashtagsArr[i]
                    });
                }
            }
            common.jsonTask(id, 'Single', 'update');
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'update', 'task', id, result.dataValues, task);
            res.status(200).send({
                message: "Task updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Task with id=${id}. Maybe Task was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err + ":Error updating Task with id=" + id);
        res.status(500).send({
            message: "Error updating Task with id=" + id
        });
    });
}
/**
 * Function to upload media files
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.mediaUpload = async (req, res) => {
    try {
        var x = [];
        let updateData = {};
        await upload(req, res);
        if (req.files.length <= 0 || !req.body.media_action || !req.body.actionID) {
            return res.status(400).send({
                message: "Media action ,tblalias,at least one file and id required"
            });
        }
        for (i in req.files) {
            const match = ["audio/mp3", "audio/mpeg", "audio/wav", "audio/mp4", "audio/aac", "audio/amr", "audio/flac", "audio/ts", "audio/m4a", "audio/mkv", "audio/ogg", "video/mov", "video/mp4", "video/3gp", "video/mkv", "video/webm", "video/m4v", "video/avi", "video/ts"];
            if (match.indexOf(req.files[i].mimetype) === -1) {
                sharp(req.files[i].path).resize(465, 360).withMetadata().toFile('uploads/thumbnails/' + req.files[i].filename, (err, resizeImage) => {
                    if (err) {
                        logger.log("error", err + ":Error creating thumbnail for " + req.body.actionID + req.body.tblAlias);
                    }
                });
            } else {
                ffmpeg(req.files[i].path)
                    .on('end', function () {
                        console.log('thumbnail');
                    })
                    .on('error', function (err) {
                        logger.log("error", err + ":Error creating video thumbnail for " + req.body.actionID + req.body.tblAlias);
                    })
                    .screenshots({
                        count: 1,
                        folder: 'uploads/thumbnails',
                        filename: req.files[i].filename
                    });
            }
        }
        const media_action = req.body.media_action;
        // upload contest images files 
        if (req.body.tblAlias == "contest") {
            if (media_action == "ct_bonus_rewards_benefits") {
                var xFile = [];
                let updateData = {};
                for (i in req.files) {
                    var item = req.files[i].filename;
                    xFile.push(item);
                }
                updateData[media_action] = {
                    details: req.body.note,
                    attachments: xFile
                };
                console.log(updateData);
                Contest.update(updateData, {
                    where: {
                        ct_id: req.body.actionID
                    }
                }).then(num => {
                    common.jsonTask(req.body.actionID, 'Contest', 'update');
                });
                return res.status(200).send({
                    message: "Benefits File uploaded successfully"
                });
            }

            const updateVals = {
                [media_action]: req.files[0].filename
            };
            Contest.update(updateVals, {
                where: {
                    ct_id: req.body.actionID
                }
            }).then(num => {
                common.jsonTask(req.body.actionID, 'Contest', 'update');
            });
            return res.status(200).send({
                message: "Contest Media uploaded successfully"
            });
        }
        // upload/update task media
        if (req.body.tblAlias == "post" && media_action == "thumb") {
            const postID = req.body.actionID;
            var post_details = await Posts.findOne({
                attributes: ['ucpl_content_data', 'ta_task_id', 'ucpl_content_type', 'ucpl_id'],
                where: {
                    ucpl_content_id: postID
                }
            });

            for (i in req.files) {
                var item = req.files[i].filename;
                x.push(item);
            }
            updateData["ucpl_content_data"] = {
                insta_caption: post_details.ucpl_content_data.insta_caption,
                insta_friends: post_details.ucpl_content_data.insta_friends,
                media: post_details.ucpl_content_data.media ? post_details.ucpl_content_data.media : [],
                thumbs: x
            };
            var Transactions_details = await ledgerTransactions.findOne({
                attributes: ['trx_source'],
                where: {
                    trx_source: {
                        post_id: post_details.ucpl_id
                    }
                }
            });
            if (Transactions_details && Transactions_details.trx_source) {
                let updateTrans = {
                    trx_source: {
                        brand_details: Transactions_details.trx_source.brand_details,
                        post_details: {
                            insta_caption: post_details.ucpl_content_data.insta_caption,
                            insta_friends: post_details.ucpl_content_data.insta_friends,
                            media: post_details.ucpl_content_data.media ? post_details.ucpl_content_data.media : [],
                            thumbs: x
                        },
                        task_details: Transactions_details.trx_source.task_details,
                        post_id: post_details.ucpl_id
                    },
                }
                ledgerTransactions.update(updateTrans, {
                    where: {
                        trx_source: {
                            post_id: post_details.ucpl_id
                        }
                    }
                });
            }
            Posts.update(updateData, {
                where: {
                    ucpl_content_id: postID
                }
            }).then(num => {
                if (post_details.ucpl_content_type === 2) {
                    common.jsonTask(post_details.ta_task_id, 'Contest', 'update');
                } else {
                    common.jsonTask(post_details.ta_task_id, 'Single', 'update');
                }
            });
            return res.status(200).send({
                message: "thumb uploaded"
            });
        }
        if (req.body.tblAlias == "post") {
            const postID = req.body.actionID;
            var post_details = await Posts.findOne({
                attributes: ['ucpl_content_data', 'ta_task_id', 'ucpl_content_type', 'ucpl_id'],
                where: {
                    ucpl_content_id: postID
                }
            });
            for (i in req.files) {
                var item = req.files[i].filename;
                x.push(item);
            }
            var Transactions_details = await ledgerTransactions.findOne({
                attributes: ['trx_source'],
                where: {
                    trx_source: {
                        post_id: post_details.ucpl_id
                    }
                }
            });
            if (Transactions_details && Transactions_details.trx_source) {
                let updateTrans = {
                    trx_source: {
                        brand_details: Transactions_details.trx_source.brand_details,
                        post_details: {
                            insta_caption: post_details.ucpl_content_data.insta_caption,
                            insta_friends: post_details.ucpl_content_data.insta_friends,
                            media: x,
                            thumb: post_details.ucpl_content_data.thumb ? post_details.ucpl_content_data.thumb : []
                        },
                        task_details: Transactions_details.trx_source.task_details,
                        post_id: post_details.ucpl_id
                    },
                }
                ledgerTransactions.update(updateTrans, {
                    where: {
                        trx_source: {
                            post_id: post_details.ucpl_id
                        }
                    }
                });
            }
            updateData[media_action] = {
                insta_caption: post_details.ucpl_content_data.insta_caption,
                insta_friends: post_details.ucpl_content_data.insta_friends,
                media: x,
                thumb: post_details.ucpl_content_data.thumb ? post_details.ucpl_content_data.thumb : []
            };
            Posts.update(updateData, {
                where: {
                    ucpl_content_id: postID
                }
            }).then(num => {
                if (post_details.ucpl_content_type === 2) {
                    common.jsonTask(post_details.ta_task_id, 'Contest', 'update');
                } else {
                    common.jsonTask(post_details.ta_task_id, 'Single', 'update');
                }
            });
            return res.status(200).send({
                message: "File uploaded successfully"
            });
        }
        if (req.body.tblAlias == "task") {
            const taskID = req.body.actionID;
            if (media_action == "ta_header_image" || media_action == "ta_sound") {
                const updateVals = {
                    [media_action]: req.files[0].filename
                };
                Tasks.update(updateVals, {
                    where: {
                        ta_task_id: taskID
                    }
                }).then(num => {
                    common.jsonTask(taskID, 'Single', 'update');
                });
                return res.status(200).send({
                    message: "File uploaded successfully"
                });
            }
            if (media_action == "ta_bonus_rewards_benefits") {
                var xFile = [];
                let updateData = {};
                for (i in req.files) {
                    var item = req.files[i].filename;
                    xFile.push(item);
                }
                updateData[media_action] = {
                    details: req.body.note,
                    attachments: xFile
                };
                console.log(updateData);
                Tasks.update(updateData, {
                    where: {
                        ta_task_id: taskID
                    }
                }).then(num => {
                    common.jsonTask(taskID, 'Single', 'update');
                });
                return res.status(200).send({
                    message: "Benefits File uploaded successfully"
                });
            }
            var task_details = await Tasks.findOne({
                attributes: ['ta_post_insp_image', 'ta_header_image', 'ta_task_id'],
                where: {
                    ta_task_id: taskID
                }
            });
            for (i in req.files) {
                var item = req.files[i].filename;
                x.push(item);
            }
            if (task_details[media_action] !== null && Object.keys(task_details[media_action]).length > 0 && media_action == "ta_post_insp_image") {
                for (i in task_details[media_action]) {
                    var item = task_details[media_action][i];
                    x.push(item);
                }
            }
            updateData[media_action] = x;
            console.log(updateData);
            Tasks.update(updateData, {
                where: {
                    ta_task_id: taskID
                }
            }).then(num => {
                common.jsonTask(taskID, 'Single', 'update');
            });

            return res.status(200).send({
                message: "file uploaded successfully"
            });
        }
        // upload/update task media
        if (req.body.tblAlias == "brand") {
            const taskID = req.body.actionID;
            const updateVals = {
                [media_action]: req.files[0].filename
            };
            Brand.update(updateVals, {
                where: {
                    cr_co_id: taskID
                }
            });
            return res.status(200).send({
                message: "file uploaded successfully"
            });
        }
        if (req.body.tblAlias == "level_task") {
            const levelTaskID = req.body.actionID;
            const updateVals = {
                [media_action]: req.files[0].filename
            };
            levelTask.update(updateVals, {
                where: {
                    level_task_id: levelTaskID
                }
            }).then(num => {
                if (num == 1) {
                    res.status(200).send({
                        message: "task banner image uploaded successfully."
                    });
                    return;
                } else {
                    res.status(400).send({
                        message: `Cannot update task banner image with id=${levelTaskID}. Maybe task level was not found or req.body is empty!`
                    });
                    return;
                }
            }).catch(err => {
                logger.log("error", err + ":Error updating task banner image with id=" + levelTaskID);
                res.status(500).send({
                    message: err + " : task level id -" + levelTaskID
                });
                return;
            });
        }
        if (req.body.tblAlias == "shipping_confirmation") {
            const scId = req.body.actionID;
            const updateVals = {
                [media_action]: req.files[0].filename
            };
            levelTask.update(updateVals, {
                where: {
                    sc_id: scId
                }
            }).then(num => {
                if (num == 1) {
                    res.status(200).send({
                        message: "shipping confirmation product image uploaded successfully."
                    });
                    return;
                } else {
                    res.status(400).send({
                        message: `Cannot update shipping confirmation product image with id=${scId}. Maybe task level was not found or req.body is empty!`
                    });
                    return;
                }
            }).catch(err => {
                logger.log("error", err + ":Error updating shipping confirmation product image with id=" + scId);
                res.status(500).send({
                    message: err + " : shipping confirmation id -" + scId
                });
                return;
            });
        }
        if (req.body.tblAlias == "user") {
            const userID = req.body.actionID;
            console.log(req.body);
            const updateVals = {
                [media_action]: req.files[0].filename
            };
            console.log(updateVals);
            User_profile.update(updateVals, {
                where: {
                    u_id: userID
                }
            }).then(num => {
                if (num == 1) {
                    res.status(200).send({
                        message: "profile pic uploaded successfully."
                    });
                    return;
                } else {
                    res.status(400).send({
                        message: `Cannot update user profile pic with id=${id}. Maybe user was not found or req.body is empty!`
                    });
                    return;
                }
            }).catch(err => {
                logger.log("error", err + ":Error updating user profile pic with id=" + userID);
                res.status(500).send({
                    message: err + " : profile pic id -" + userID
                });
                return;
            });
        }
    } catch (error) {
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).send({
                message: "Too many files to upload."
            });
        }
        return res.status(500).send({
            message: `Error when trying upload many files: ${error}`
        });
    }
}
/**
 * Function to add new contest
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNewContest = async (req, res) => {
    const body = req.body;
    const data = {
        "ct_name": body.hasOwnProperty("Task name") ? req.body["Task name"] : "",
        "cp_campaign_id": body.hasOwnProperty("Campaign id") ? req.body["Campaign id"] : "",
        "ct_type": body.hasOwnProperty("Task type") ? req.body["Task type"] : "",
        "ct_desc": body.hasOwnProperty("Task description") ? req.body["Task description"] : "",
        "ct_hashtag": body.hasOwnProperty("Task hashtags") ? req.body["Task hashtags"] : "",
        "ct_token_budget": body.hasOwnProperty("Task token budget") ? req.body["Task token budget"] : 0,
        "ct_budget_per_user": body.hasOwnProperty("Task budget per user") ? req.body["Task budget per user"] : 0,
        "ct_hearts_per_user": body.hasOwnProperty("Task hearts per user") ? req.body["Task hearts per user"] : 0,
        "ct_total_available": body.hasOwnProperty("Task total available") ? req.body["Task total available"] : 0,
        "ct_estimated_user": body.hasOwnProperty("Task estimated user") ? req.body["Task estimated user"] : 0,
        "ct_do": body.hasOwnProperty("Task do") ? req.body["Task do"] : "",
        "ct_dont_do": body.hasOwnProperty("Task dont do") ? req.body["Task dont do"] : "",
        "ct_insta_question": body.hasOwnProperty("Task insta question") ? req.body["Task insta question"] : "",
        "ct_photos_required": body.hasOwnProperty("Task photos required") ? req.body["Task photos required"] : 0,
        "ct_videos_required": body.hasOwnProperty("Task videos required") ? req.body["Task videos required"] : 0,
        "ct_mentioned": body.hasOwnProperty("Task mentioned") ? req.body["Task mentioned"] : "",
        "ct_start_date": body.hasOwnProperty("Task start date") ? req.body["Task start date"] : new Date(),
        "ct_end_date": body.hasOwnProperty("Task end date") ? req.body["Task end date"] : new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
        "ct_status": body.hasOwnProperty("Task status") ? req.body["Task status"] : 0,
        "ct_oneline_summary": body.hasOwnProperty("Task oneline summary") ? req.body["Task oneline summary"] : "",
        "ct_contiue_spend_budget": body.hasOwnProperty("Continue after budget spend") ? req.body["Continue after budget spend"] : false,
        "ct_start_voting_date": body.hasOwnProperty("voting start date") ? req.body["voting start date"] : new Date(),
        "ct_end_voting_date": body.hasOwnProperty("voting end date") ? req.body["voting end date"] : new Date(),
        "ct_winner_date": body.hasOwnProperty("winner date") ? req.body["winner date"] : new Date(),
        "ct_winner_token": body.hasOwnProperty("winner token") ? req.body["winner token"] : 0
    }
    Contest.create(data)
        .then(data => {
            if (req.body["Task hashtags"]) {
                const hashtagsArr = req.body["Task hashtags"];
                for (i = 0; i < hashtagsArr.length; i++) {
                    Hashtags.create({
                        ta_task_id: data.ct_id,
                        cp_campaign_id: req.body["Campaign id"],
                        th_hashtag_values: hashtagsArr[i],
                        th_type: 'Contest'
                    });
                }
            }
            common.jsonTask(data.ct_id, 'Contest', 'add');
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'Contest', data.ct_id, data.dataValues);
            res.status(201).send({
                msg: "Contest Added Successfully",
                ct_id: data.ct_id,
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Contest."
            });
        });
}
/**
 * Function to update contest details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateContest = async (req, res) => {
    const id = req.params.taskID;
    const task = await Contest.findOne({
        where: {
            ct_id: id
        }
    });
    Contest.update(req.body, {
        where: {
            ct_id: id
        },
        returning: true
    }).then(function ([num, [result]]) {
        if (num == 1) {
            if (req.body.ta_hashtag) {
                Hashtags.destroy({
                    where: {
                        ta_task_id: id
                    }
                });
                const hashtagsArr = req.body.ta_hashtag;
                for (i = 0; i < hashtagsArr.length; i++) {
                    Hashtags.create({
                        ta_task_id: id,
                        cp_campaign_id: task.cp_campaign_id,
                        th_hashtag_values: hashtagsArr[i],
                        th_type: 'Contest'
                    });
                }
            }
            common.jsonTask(id, 'Contest', 'update');
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'update', 'Contest', id, result.dataValues, task);
            res.status(200).send({
                message: "Contest updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Contest with id=${id}. Maybe Contest was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        console.log(err)
        res.status(500).send({
            message: err + "Error updating Contest with id=" + id
        });
    });
}
/**
 * Function to get all Contest
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.listingContest = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'ct_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;
    var todayDate = new Date();
    var UserId = req.header(process.env.UKEY_HEADER || "x-api-key");
    todayDate.toLocaleString('en-US', { timeZone: 'Asia/Calcutta' })
    console.log(todayDate);
    
    const contentUserTaskIds = await common.getContentReportUser(['Contest', 'Campaign'], UserId);

    let contestIdsValues = [];
    let CampaignIdsValues = [];
    if (contentUserTaskIds.length) {
        contentUserTaskIds.forEach(element => {
            if (element.content_report_type == 'Contest') {
                contestIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'Campaign') {
                CampaignIdsValues.push(element.content_report_type_id);
            }
        });
    }


    var options = {
        include: [{
            model: db.campaigns,
            attributes: [
                ["cp_campaign_name", "Campaign Name"]
            ],
            where: { is_autotakedown: 0 }
        }
        ],
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {
            ct_start_date: {
                [Op.lte]: todayDate
            },
            ct_end_date: {
                [Op.gte]: todayDate
            }
            // ct_status:2
        }
    };
    if (req.query.sortVal && (req.query.sortBy == "ct_name" || req.query.sortBy == "ct_type")) {
        var sortValue = req.query.sortVal.trim();
        options.where = {
            [sortBy]: {
                [Op.iLike]: `%${sortValue}%`
            }
        }
    } else if (req.query.sortVal && req.query.sortBy == "ct_hashtag") {
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
    if (contestIdsValues.length) {
        options['where']['ct_id'] = {
            [Op.not]: contestIdsValues
        }
    }
    options['where']['is_autotakedown'] = 0;
    if (CampaignIdsValues.length) {
        options['where']['cp_campaign_id'] = {
            [Op.not]: CampaignIdsValues
        }
    }
    var total = await Contest.count({
        where: options['where']
    });
    const tasks_list = await Contest.findAll(options);
    res.status(200).send({
        data: tasks_list,
        totalRecords: total
    });
}