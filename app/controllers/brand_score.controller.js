const db = require("../models");
const EngagementType = db.brandscore_engagement_type;
const EngagementSettings = db.brandscore_engagement_settings;
const brandscoreIncrease = db.brandscore_increase;
const BrandScore = db.brand_score;
const BrandScoretask = db.brandscore_task;
const User_profile = db.user_profile;
const logger = require("../middleware/logger");
const audit_log = db.audit_log;
const {
    validationResult
} = require("express-validator");
const { brandscore_task } = require("../models");

/**
 * Function to add Brand Score engagement type
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.AddEngagementType = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const body = req.body;
    if (!body["Engagement Type"]) {
        res.status(500).send({
          msg:
            "Engagement Type is required."
        });
        return;
      }
    const engagementTypeData = {
        "engagement_type": body.hasOwnProperty("Engagement Type") ? req.body["Engagement Type"] : ''
    }
    EngagementType.create(engagementTypeData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'brandscore_engagement_type', data.engagement_id, data.dataValues);
            res.status(201).send({
                msg: "Brandscore Engagement Type Added Successfully",
                engagementId: data.engagement_id,
            });
        })
        .catch(err => {
            logger.log("error", err + ": Some error occurred while creating the Brandscore Engagement Type");
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Brandscore Engagement Type."
            });
        });
}

/**
 * Function to update Engagement Type
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.updateEngagementType = async(req, res) => {
    const id = req.params.engagementId;
    var engagemenDetails = await EngagementType.findOne({
        where: {
            engagement_id: id
        }
    });
    EngagementType.update(req.body, {
        returning: true,
        where: {
            engagement_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','brandscore_engagement_type',id,result.dataValues,engagemenDetails);
            res.status(200).send({
                message: "Brandscore Engagement Type updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Brandscore Engagement Type with id=${id}. Maybe Brandscore Engagement Type was not found or req.body is empty!`
            });
        }
    }).catch(err => {
       logger.log("error", err+": Error updating Brandscore Engagement Type with id=" + id);
        res.status(500).send({
            message: err+"Error updating Brandscore Engagement Type with id=" + id
        });
    });
 }

 /**
 * Function to delete Engagement Type
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteEngagementType = async (req, res) => {
    const engagementTypeDetails = await EngagementType.findOne({
            where: {
                engagement_id: req.params.engagementId
            }
        });
    if(!engagementTypeDetails){
        res.status(500).send({
            message: "Could not delete Brandscore Engagement Type with id=" + req.params.engagementId
          });
          return;
    }
    EngagementType.destroy({
        where: { 
            engagement_id: req.params.engagementId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Brandscore Engagement Type deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Brandscore Engagement Type with id=" + req.params.engagementId
          });
          return;
        });
    };

 /**
 * Function to get all Engagement Types
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.EngagementTypelisting = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'engagement_id'
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
        var sortValue = req.query.sortVal;
        options.where = sortValue ? {
            [sortBy]: `${sortValue}`
        } : null;
    }
    if (req.query.engagementId) {
        options['where']['engagement_id'] = req.query.engagementId;
    }
    
    var total = await EngagementType.count({
        where: options['where']
    });
    const EngagementTypeListing = await EngagementType.findAll(options);
    res.status(200).send({
        data: EngagementTypeListing,
        totalRecords: total
    });
};

 /**
 * Function to get all Engagement Setting
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.engagementSettinglisting = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'bes_id'
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
        var sortValue = req.query.sortVal;
        options.where = sortValue ? {
            [sortBy]: `${sortValue}`
        } : null;
    }
    if (req.query.engagementSettingId) {
        options['where']['bes_id'] = req.query.engagementSettingId;
    }
    
    var total = await EngagementSettings.count({
        where: options['where']
    });
    const EngagementTypeListing = await EngagementSettings.findAll(options);
    res.status(200).send({
        data: EngagementTypeListing,
        totalRecords: total
    });
};

/**
 * Function to add Brand Score engagement settings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.AddEngagementSettings = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const body = req.body;
    if (!body["Engagement Id"]) {
        res.status(500).send({
          msg:
            "Engagement Id is required."
        });
        return;
      }
    if (!body["Engagement Level"]) {
        res.status(500).send({
          msg:
            "Engagement Level is required."
        });
        return;
      }
    const engagementSettingData = {
        "engagement_id": body.hasOwnProperty("Engagement Id") ? req.body["Engagement Id"] : 0,
        "engagement_level": body.hasOwnProperty("Engagement Level") ? req.body["Engagement Level"] : 0,
        "brand_score": body.hasOwnProperty("Brand Score") ? req.body["Brand Score"] : 0
    }
    EngagementSettings.create(engagementSettingData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'brandscore_engagement_settings', data.bes_id, data.dataValues);
            res.status(201).send({
                msg: "Brandscore Engagement Settings Added Successfully",
                engagementSettingId: data.bes_id
            });
        })
        .catch(err => {
            logger.log("error", err + ": Some error occurred while creating the Brandscore Engagement Settings");
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Brandscore Engagement Settings."
            });
        });
}

/**
 * Function to update Engagement Setting
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.updateEngagementSettings = async(req, res) => {
    const id = req.params.engagementSettingId;
    var engagementSettingDetails = await EngagementSettings.findOne({
        where: {
            bes_id: id
        }
    });
    EngagementSettings.update(req.body, {
        returning: true,
        where: {
            bes_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','brandscore_engagement_settings',id,result.dataValues,engagementSettingDetails);
            res.status(200).send({
                message: "Brandscore Engagement Settings updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Brandscore Engagement Settings with id=${id}. Maybe Brandscore Engagement Type was not found or req.body is empty!`
            });
        }
    }).catch(err => {
       logger.log("error", err+": Error updating Brandscore Engagement Settings with id=" + id);
        res.status(500).send({
            message: err+"Error updating Brandscore Engagement Settings with id=" + id
        });
    });
 }

 /**
 * Function to delete Engagement Setting
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteEngagementSettings = async (req, res) => {
    const engagementSettingsDetails = await EngagementSettings.findOne({
            where: {
                bes_id: req.params.engagementSettingId
            }
        });
    if(!engagementSettingsDetails){
        res.status(500).send({
            message: "Could not delete Brandscore Engagement Setting with id=" + req.params.engagementSettingId
          });
          return;
    }
    EngagementSettings.destroy({
        where: { 
            bes_id: req.params.engagementSettingId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Brandscore Engagement Setting deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Brandscore Engagement Setting with id=" + req.params.engagementSettingId
          });
          return;
        });
    };


/**
 * Function to add Brand Score engagement settings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.IncreaseBrandScore = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const body = req.body;
    if (!body["Event Type"]) {
        res.status(500).send({
          msg:
            "Event Type is required."
        });
        return;
      }
    const brandScoreIncreaseData = {
        "brand_id": body.hasOwnProperty("Brand Id") ? body["Brand Id"] : 0,
        "user_id": body.hasOwnProperty("User Id") ? body["User Id"] : 0,
        "event_id": body.hasOwnProperty("Event Id") ? body["Event Id"] : 0,
        "event_type": body.hasOwnProperty("Event Type") ? body["Event Type"] : '',
        "event_hashtag": body.hasOwnProperty("Event Hashtag") ? body["Event Hashtag"] : 0,
        "event_engagement_id": body.hasOwnProperty("Event Engagement Id") ? body["Event Engagement Id"] : 0,
        "platform_id": body.hasOwnProperty("Platform Id") ? body["Platform Id"] : 0,
        "brandscore_user_score_increase": body.hasOwnProperty("Brandscore User Score Increase") ? body["Brandscore User Score Increase"] : 0
    }
    brandscoreIncrease.create(brandScoreIncreaseData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'brandscore_increase', data.brandscore_increase_id, data.dataValues);
            res.status(201).send({
                msg: "Brandscore Increase Added Successfully",
                brandscoreIncreaseId: data.brandscore_increase_id
            });
        })
        .catch(err => {
            logger.log("error", err + ": Some error occurred while creating the Brandscore Increase.");
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Brandscore Increase."
            });
        });
}

 /**
 * Function to get all brandscore increase
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.brandscoreIncreaselisting = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'brandscore_increase_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    var options = {
        include: [
            {
                model: db.brands,
                required: false,
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
            },
            {
                model: db.tasks,
                required: false,
                attributes: [
                    ["ta_name", "Task Name"]
                ]
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
    if (req.query.brandscoreIncreaseId) {
        options['where']['brandscore_increase_id'] = req.query.brandscoreIncreaseId;
    }
    if (req.query.brandId) {
        options['where']['brand_id'] = req.query.brandId;
    }
    if (req.query.userId) {
        options['where']['user_id'] = req.query.userId;
    }
    if (req.query.eventId) {
        options['where']['event_id'] = req.query.eventId;
    }
    
    var total = await brandscoreIncrease.count({
        where: options['where']
    });
    const EngagementTypeListing = await brandscoreIncrease.findAll(options);
    res.status(200).send({
        data: EngagementTypeListing,
        totalRecords: total
    });
};

/**
 * Function to update increase Brand Score
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateIncreaseBrandScore = async(req, res) => {
    const id = req.params.brandscoreIncreaseId;
    var increaseBrandScoreDetails = await brandscoreIncrease.findOne({
        where: {
            brandscore_increase_id: id
        }
    });
    brandscoreIncrease.update(req.body, {
        returning: true,
        where: {
            brandscore_increase_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','brandscore_increase',id,result.dataValues,increaseBrandScoreDetails);
            res.status(200).send({
                message: "Brandscore Increase updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Brandscore Increase with id=${id}. Maybe Brandscore Increase was not found or req.body is empty!`
            });
        }
    }).catch(err => {
       logger.log("error", err+": Error updating Brandscore Increase with id=" + id);
        res.status(500).send({
            message: err+"Error updating Brandscore Increase with id=" + id
        });
    });
 }

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
    var userId = req.header(process.env.UKEY_HEADER || "x-api-key");
    const brandScoreTaskdata = {
        "brandscore_brand_id": body.hasOwnProperty("Brand Id") ? req.body["Brand Id"] : 0,
        "brandscore_task_id": body.hasOwnProperty("Task Id") ? req.body["Task Id"] : 0,
        "brandscore_user_id": body.hasOwnProperty("User Id") ? req.body["User Id"] : userId,
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
    var userId = req.header(process.env.UKEY_HEADER || "x-api-key");
    const body = req.body;
    const brandScoreData = {
        "brandscore_brand_id": body.hasOwnProperty("Brand Id") ? req.body["Brand Id"] : 0,
        "brandscore_task_id": body.hasOwnProperty("Task Id") ? req.body["Task Id"] : 0,
        "brandscore_user_id": body.hasOwnProperty("User Id") ? req.body["User Id"] : userId,
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
        "score_decrease_del_post": body.hasOwnProperty("Score Decrease Del Post") ? req.body["Score Decrease Del Post"] : 0,
        "brandscore_unlock": body.hasOwnProperty("Brandscore Unlock") ? req.body["Brandscore Unlock"] : 0
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
    BrandScoretask.update(req.body, {
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
    BrandScore.update(req.body, {
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

