const db = require("../models");
const Brand = db.brands;
const miniTask = db.mini_task;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const { isNull } = require("util");
const Op = db.Sequelize.Op;

/**
 * Function to add mini task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.addMiniTask = async (req, res) => {
    const body = req.body;
   
    const miniTaskData = {
        "mini_task_object_type": body.hasOwnProperty("Mini Task Object Type") ? req.body["Mini Task Object Type"] : 0,
        "mini_task_qty": body.hasOwnProperty("Mini Task Qty") ? req.body["Mini Task Qty"] : 0,
        "mini_task_time_state": body.hasOwnProperty("Mini Task Time State") ? req.body["Mini Task Time State"] : 0,
        "mini_task_reward_type": body.hasOwnProperty("Mini Task Reward Type") ? req.body["Mini Task Reward Type"] : 0,
        "mini_task_image_url": body.hasOwnProperty("Mini Task Image Url") ? req.body["Mini Task Image Url"] : '',
        "mini_task_reward_amount": body.hasOwnProperty("Mini Task Reward Amount") ? req.body["Mini Task Reward Amount"] : 0,
        "mini_task_status": body.hasOwnProperty("Mini Task Status") ? req.body["Mini Task Status"] : 0,
        "mini_task_app_placement_page": body.hasOwnProperty("Mini Task App Placement Page") ? req.body["Mini Task App Placement Page"] : '',
        "mini_task_increase_in_hardness": body.hasOwnProperty("Mini Task Increase In Hardness") ? req.body["Mini Task Increase In Hardness"] : 0,
        "mini_task_hardness": body.hasOwnProperty("Mini Task Hardness") ? req.body["Mini Task Hardness"] : 0,
        "mini_task_hardness_action_description": body.hasOwnProperty("Mini Task Hardness Action Description") ? req.body["Mini Task Hardness Action Description"] : '',
        "mini_tasks_hardness_action": body.hasOwnProperty("Mini Task Hardness Action") ? req.body["Mini Task Hardness Action"] : []
    }
    miniTask.create(miniTaskData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'voting', data.mini_task_id, data.dataValues);
            res.status(201).send({
                msg: "Mini task Added Successfully",
                miniTaskId: data.mini_task_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while adding the Mini task=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while adding the Mini Task."
            });
        });
}


/**
 * Function to get all voting listing
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.miniTaskListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'mini_task_id'
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
    if (req.query.miniTaskId) {
        options['where']['mini_task_id'] = req.query.miniTaskId;
    }
    var total = await miniTask.count({
        where: options['where']
    });
    const minitask_list = await miniTask.findAll(options);
    res.status(200).send({
        data: minitask_list,
        totalRecords: total
    });
}


