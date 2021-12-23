const db = require("../models");
const BrandScoretask = db.brandscore_task;
const BrandScore = db.brand_score;
const User_profile = db.user_profile;
const logger = require("../middleware/logger");
const audit_log = db.audit_log;
const {
    validationResult
} = require("express-validator");
const { brandscore_task } = require("../models");

/**
 * Function to add Brand Score task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.AddBrandScoreTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const body = req.body;
    const brandScoreTaskdata = {
        "brandscore_brand_id": body.hasOwnProperty("Brand Id") ? req.body["Brand Id"] : 0,
        "brandscore_task_id": body.hasOwnProperty("Task Id") ? req.body["Task Id"] : 0,
        "brandscore_user_id": body.hasOwnProperty("User Id") ? req.body["User Id"] : 0,
        "brandscore_task_reach_count": body.hasOwnProperty("Reach Count") ? req.body["Reach Count"] : 0,
        "brandscore_task_comments_count": body.hasOwnProperty("Comments Count") ? req.body["Comments Count"] : 0,
        "brandscore_task_pics_count": body.hasOwnProperty("Pics Count") ? req.body["Pics Count"] : 0,
        "brandscore_task_video_count": body.hasOwnProperty("Video Count") ? req.body["Video Count"] : 0,
        "brandscore_task_likes_count": body.hasOwnProperty("Likes Count") ? req.body["Likes Count"] : 0,
        "brandscore_task_hashtag_name": body.hasOwnProperty("Hashtag Name") ? req.body["Hashtag Name"] : '',
        "brandscore_task_tot_tickets_count": body.hasOwnProperty("Total Tickets Count") ? req.body["Total Tickets Count"] : 0,
        "brandscore_task_name": body.hasOwnProperty("Task Name") ? req.body["Task Name"] : '',
        "brandscore_task_award_unlock": body.hasOwnProperty("Award Unlock") ? req.body["Award Unlock"] : 0,
        "brandscore_task_award_lock": body.hasOwnProperty("Award Lock") ? req.body["Award Lock"] : 0,
        "brandscore_task_award_limit_count": body.hasOwnProperty("Award Limit Count") ? req.body["Award Limit Count"] : 0,
        "brandscore_score_count": body.hasOwnProperty("Score Count") ? req.body["Score Count"] : 0
    }
    BrandScoretask.create(brandScoreTaskdata)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'brandscore_task', data.brandscore_id, data.dataValues);
            res.status(201).send({
                msg: "Brandscore Task Added Successfully",
                taskID: data.brandscore_id,
            });
        })
        .catch(err => {
            logger.log("error", err + ": Some error occurred while creating the Brandscore Task");
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Brandscore Task."
            });
        });
}

/**
 * Function to get all brandScore Task listing
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.brandScoreTasklisting = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'brandscore_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    var options = {
        include: [
            {
                model: db.brands,
                attributes: [
                    ["cr_co_name", "Brand Name"]
                ],
                where: { is_autotakedown: 0 }
            },
            {
                model: User_profile,
                attributes: [["u_display_name", "user_name"]],
                required: false,
                where: {
                    is_autotakedown: 0
                }
            }
        ],
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if (req.query.sortVal) {
        var sortValue = req.query.sortVal;
        options.where = sortValue ? {
            [sortBy]: `${sortValue}`
        } : null;
    }
    if (req.query.taskId) {
        options['where']['brandscore_task_id'] = req.query.taskId;
    }
    if (req.query.brandId) {
        options['where']['brandscore_brand_id'] = req.query.brandId;
    }
    var total = await brandscore_task.count({
        where: options['where']
    });
    const brandScoreTaskList = await brandscore_task.findAll(options);
    res.status(200).send({
        data: brandScoreTaskList,
        totalRecords: total
    });
};

/**
 * Function to get all brandScore Task listing
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.brandScoreListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'brandscore_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    var options = {
        include: [
            {
                model: db.brands,
                attributes: [
                    ["cr_co_name", "Brand Name"]
                ],
                where: { is_autotakedown: 0 }
            },
            {
                model: User_profile,
                attributes: [["u_display_name", "user_name"]],
                required: false,
                where: {
                    is_autotakedown: 0
                }
            }
        ],
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if (req.query.sortVal) {
        var sortValue = req.query.sortVal;
        options.where = sortValue ? {
            [sortBy]: `${sortValue}`
        } : null;
    }
    if (req.query.taskId) {
        options['where']['brandscore_task_id'] = req.query.taskId;
    }
    if (req.query.brandId) {
        options['where']['brandscore_brand_id'] = req.query.brandId;
    }
    if (req.query.userId) {
        options['where']['brandscore_user_id'] = req.query.userId;
    }
    var total = await BrandScore.count({
        where: options['where']
    });
    const brandScoreList = await BrandScore.findAll(options);
    res.status(200).send({
        data: brandScoreList,
        totalRecords: total
    });
};

/**
 * Function to add Brand Score
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.AddBrandScore = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const body = req.body;
    const brandScoreData = {
        "brandscore_brand_id": body.hasOwnProperty("Brand Id") ? req.body["Brand Id"] : 0,
        "brandscore_task_id": body.hasOwnProperty("Task Id") ? req.body["Task Id"] : 0,
        "brandscore_user_id": body.hasOwnProperty("User Id") ? req.body["User Id"] : 0,
        "brandscore_task_reach_score": body.hasOwnProperty("Reach Score") ? req.body["Reach Score"] : 0,
        "brandscore_task_comments_score": body.hasOwnProperty("Comments Score") ? req.body["Comments Score"] : 0,
        "brandscore_task_pics_count_score": body.hasOwnProperty("Pics Count Score") ? req.body["Pics Count Score"] : 0,
        "brandscore_task_video_count_score": body.hasOwnProperty("Video Count Score") ? req.body["Video Count Score"] : 0,
        "brandscore_task_likes_count_score": body.hasOwnProperty("Likes Count Score") ? req.body["Likes Count Score"] : 0,
        "brandscore_task_hashtag_name_score": body.hasOwnProperty("Hashtag Name Score") ? req.body["Hashtag Name Score"] : '',
        "brandscore_task_tot_tickets_count_score": body.hasOwnProperty("Total Tickets Count Score") ? req.body["Total Tickets Count Score"] : 0,
        "brandscore_task_name": body.hasOwnProperty("Task Name") ? req.body["Task Name"] : 0,
        "brandscore_task_award_lock_count_score": body.hasOwnProperty("Award lock Count Score") ? req.body["Award lock Count Score"] : 0,
        "brandscore_task_award_limit_count": body.hasOwnProperty("Award Limit Count") ? req.body["Award Limit Count"] : 0,
        "brandscore_score_total_count": body.hasOwnProperty("Score Total Count") ? req.body["Score Total Count"] : 0,
        "riddim_reach": body.hasOwnProperty("Riddim Reach") ? req.body["Riddim Reach"] : 0,
        "riddim_engagment": body.hasOwnProperty("Riddim Engagment") ? req.body["Riddim Engagment"] : 0,
        "share_off_riddim": body.hasOwnProperty("Share Off Riddim") ? req.body["Share Off Riddim"] : 0,
        "post_deletion": body.hasOwnProperty("Post Deletion") ? req.body["Post Deletion"] : 0,
        "brand_vote": body.hasOwnProperty("Brand Vote") ? req.body["Brand Vote"] : 0,
        "video_uploaded": body.hasOwnProperty("Video Uploaded") ? req.body["Video Uploaded"] : '',
        "score_decrease_del_post": body.hasOwnProperty("Score Decrease Del Post") ? req.body["Score Decrease Del Post"] : 0
    }
    BrandScore.create(brandScoreData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'brandscore_task', data.brandscore_id, data.dataValues);
            res.status(201).send({
                msg: "Brandscore Added Successfully",
                taskID: data.brandscore_id,
            });
        })
        .catch(err => {
            logger.log("error", err + ": Some error occurred while creating the Brandscore");
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Brandscore."
            });
        });
}

/**
 * Function to update Brand Score Task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateBrandScoreTask = async (req, res) => {
    const body = req.body;
    const id = req.params.brandScoreId;
    var brandScoreDetails = await BrandScoretask.findOne({
        where: {
            brandscore_id: id
        }
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const brandScoreTaskdata = {
        "brandscore_brand_id": body.hasOwnProperty("Brand Id") ? req.body["Brand Id"] : 0,
        "brandscore_task_id": body.hasOwnProperty("Task Id") ? req.body["Task Id"] : 0,
        "brandscore_user_id": body.hasOwnProperty("User Id") ? req.body["User Id"] : 0,
        "brandscore_task_reach_count": body.hasOwnProperty("Reach Count") ? req.body["Reach Count"] : 0,
        "brandscore_task_comments_count": body.hasOwnProperty("Comments Count") ? req.body["Comments Count"] : 0,
        "brandscore_task_pics_count": body.hasOwnProperty("Pics Count") ? req.body["Pics Count"] : 0,
        "brandscore_task_video_count": body.hasOwnProperty("Video Count") ? req.body["Video Count"] : 0,
        "brandscore_task_likes_count": body.hasOwnProperty("Likes Count") ? req.body["Likes Count"] : 0,
        "brandscore_task_hashtag_name": body.hasOwnProperty("Hashtag Name") ? req.body["Hashtag Name"] : '',
        "brandscore_task_tot_tickets_count": body.hasOwnProperty("Total Tickets Count") ? req.body["Total Tickets Count"] : 0,
        "brandscore_task_name": body.hasOwnProperty("Task Name") ? req.body["Task Name"] : '',
        "brandscore_task_award_unlock": body.hasOwnProperty("Award Unlock") ? req.body["Award Unlock"] : 0,
        "brandscore_task_award_lock": body.hasOwnProperty("Award Lock") ? req.body["Award Lock"] : 0,
        "brandscore_task_award_limit_count": body.hasOwnProperty("Award Limit Count") ? req.body["Award Limit Count"] : 0,
        "brandscore_score_count": body.hasOwnProperty("Score Count") ? req.body["Score Count"] : 0
    }

    BrandScoretask.update(brandScoreTaskdata, {
        returning: true,
        where: {
            brandscore_id: id
        }
    }).then(function ([num, [result]]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'update', 'brandscore_task', id, result.dataValues, brandScoreDetails);
            res.status(200).send({
                message: "Brand Score Task Updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Brand Score Task with id=${id}. Maybe Brand Score Task was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err + ":Error updating Brand Score Task with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Brand Score Task with id=" + id
        });
    });
};

/**
* Function to update Brand Score
* @param  {object}  req expressJs request object
* @param  {object}  res expressJs response object
* @return {Promise}
*/
exports.updateBrandScore = async (req, res) => {
    const body = req.body;
    const id = req.params.brandScoreId;
    var brandScoreDetails = await BrandScore.findOne({
        where: {
            brandscore_id: id
        }
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const brandScoreData = {
        "brandscore_brand_id": body.hasOwnProperty("Brand Id") ? req.body["Brand Id"] : 0,
        "brandscore_task_id": body.hasOwnProperty("Task Id") ? req.body["Task Id"] : 0,
        "brandscore_user_id": body.hasOwnProperty("User Id") ? req.body["User Id"] : 0,
        "brandscore_task_reach_score": body.hasOwnProperty("Reach Score") ? req.body["Reach Score"] : 0,
        "brandscore_task_comments_score": body.hasOwnProperty("Comments Score") ? req.body["Comments Score"] : 0,
        "brandscore_task_pics_count_score": body.hasOwnProperty("Pics Count Score") ? req.body["Pics Count Score"] : 0,
        "brandscore_task_video_count_score": body.hasOwnProperty("Video Count Score") ? req.body["Video Count Score"] : 0,
        "brandscore_task_likes_count_score": body.hasOwnProperty("Likes Count Score") ? req.body["Likes Count Score"] : 0,
        "brandscore_task_hashtag_name_score": body.hasOwnProperty("Hashtag Name Score") ? req.body["Hashtag Name Score"] : '',
        "brandscore_task_tot_tickets_count_score": body.hasOwnProperty("Total Tickets Count Score") ? req.body["Total Tickets Count Score"] : 0,
        "brandscore_task_name": body.hasOwnProperty("Task Name") ? req.body["Task Name"] : 0,
        "brandscore_task_award_lock_count_score": body.hasOwnProperty("Award lock Count Score") ? req.body["Award lock Count Score"] : 0,
        "brandscore_task_award_limit_count": body.hasOwnProperty("Award Limit Count") ? req.body["Award Limit Count"] : 0,
        "brandscore_score_total_count": body.hasOwnProperty("Score Total Count") ? req.body["Score Total Count"] : 0,
        "riddim_reach": body.hasOwnProperty("Riddim Reach") ? req.body["Riddim Reach"] : 0,
        "riddim_engagment": body.hasOwnProperty("Riddim Engagment") ? req.body["Riddim Engagment"] : 0,
        "share_off_riddim": body.hasOwnProperty("Share Off Riddim") ? req.body["Share Off Riddim"] : 0,
        "post_deletion": body.hasOwnProperty("Post Deletion") ? req.body["Post Deletion"] : 0,
        "brand_vote": body.hasOwnProperty("Brand Vote") ? req.body["Brand Vote"] : 0,
        "video_uploaded": body.hasOwnProperty("Video Uploaded") ? req.body["Video Uploaded"] : '',
        "score_decrease_del_post": body.hasOwnProperty("Score Decrease Del Post") ? req.body["Score Decrease Del Post"] : 0
    }
    BrandScore.update(brandScoreData, {
        returning: true,
        where: {
            brandscore_id: id
        }
    }).then(function ([num, [result]]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'update', 'brandscore_task', id, result.dataValues, brandScoreDetails);
            res.status(200).send({
                message: "Brand Score Updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Brand Score with id=${id}. MaybeBrand Score task was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err + ":Error updating Brand Score with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Brand Score with id=" + id
        });
    });
};
/**
 * Function to delete Brand Score Task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteBrandScoreTask = async (req, res) => {
    const brandScoreDetails = await BrandScoretask.findOne({
        where: {
            brandscore_id: req.params.brandScoreId
        }
    });
    if (!brandScoreDetails) {
        res.status(500).send({
            message: "Could not delete Brand Score task with id=" + req.params.brandScoreId
        });
        return;
    }
    BrandScoretask.destroy({
        where: {
            brandscore_id: req.params.brandScoreId
        }
    })
        .then(num => {
            res.status(200).send({
                message: "Brand Score Task deleted successfully!"
            });
            return;
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Brand Score Task with id=" + req.params.brandScoreId
            });
            return;
        });
}

/**
 * Function to delete Brand Score
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteBrandScore = async (req, res) => {
    const brandScoreDetails = await BrandScore.findOne({
        where: {
            brandscore_id: req.params.brandScoreId
        }
    });
    if (!brandScoreDetails) {
        res.status(500).send({
            message: "Could not delete Brand Score with id=" + req.params.brandScoreId
        });
        return;
    }
    BrandScore.destroy({
        where: {
            brandscore_id: req.params.brandScoreId
        }
    })
        .then(num => {
            res.status(200).send({
                message: "Brand Score deleted successfully!"
            });
            return;
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Brand Score with id=" + req.params.brandScoreId
            });
            return;
        });
}

