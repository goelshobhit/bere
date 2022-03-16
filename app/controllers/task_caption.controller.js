const db = require("../models");
const Brand = db.brands;
const taskCaption = db.task_caption;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const { isNull } = require("util");
const Op = db.Sequelize.Op;

/**
 * Function to save Shared Task Caption
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.taskCaptionSharedUser = async (req, res) => {
    const body = req.body;
   
    const sharedUserTaskData = {
        "task_caption_hashtags": body.hasOwnProperty("Task Caption Hashtags") ? req.body["Task Caption Hashtags"] : [],
        "task_caption_user_id": body.hasOwnProperty("User Id") ? req.body["User Id"] : 0,
        "task_spots_available": body.hasOwnProperty("Task Spots Available") ? req.body["Task Spots Available"] : 0,
        "shared_social_media_id": body.hasOwnProperty("Shared Social Media Id") ? req.body["Mini Task Reward Type"] : 0,
        "task_caption_timestamp": body.hasOwnProperty("Task Caption Timestamp") ? req.body["Task Caption Timestamp"] : new Date(),
        "Task_caption_rules": body.hasOwnProperty("Task Caption Rules") ? req.body["Task Caption Rules"] : 0
    }
   
    taskCaption.create(sharedUserTaskData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'task_caption', data.task_caption_id, data.dataValues);
            res.status(201).send({
                msg: "Shared Task Caption Saved Successfully",
                taskCaptionId: data.task_caption_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while saving the Task Caption Shared By User=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while Task Caption Shared By User."
            });
        });
}


/**
 * Function to get all voting listing
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.taskCaptionSharedListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'task_caption_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    var options = {
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if (req.query.sortVal) {
        var sortValue = req.query.sortVal.trim();
        options.where = sortValue ? {
            [Op.or]: [{
                cr_co_name: {
                    [Op.iLike]: `%${sortValue}%`
                }
            }
            ]
        } : null;
    }
    if (req.query.taskCaptionId) {
        options['where']['task_caption_id'] = req.query.taskCaptionId;
    }
    var total = await taskCaption.count({
        where: options['where']
    });
    const taskcaption_list = await taskCaption.findAll(options);
    res.status(200).send({
        data: taskcaption_list,
        totalRecords: total
    });
}


