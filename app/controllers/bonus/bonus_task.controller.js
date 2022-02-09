const db = require("../../models");
const BonusTask = db.bonus_task;
const audit_log = db.audit_log
const common = require("../../common");
const logger = require("../../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new Bonus Task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createBonusTask = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const bonusTaskData = {
        "bonus_task_brand_id": body.hasOwnProperty("Brand Id") ? body["Brand Id"] : 0,
        "bonus_task_usr_id": body.hasOwnProperty("User Id") ? body["User Id"] : 0,
        "bonus_task_caption1": body.hasOwnProperty("Caption 1") ? body["Caption 1"] : "",
        "bonus_task_caption2": body.hasOwnProperty("Caption 2") ? body["Caption 2"] : "",
        "bonus_task_caption3": body.hasOwnProperty("Caption 3") ? body["Caption 3"] : "",
        "bonus_task_own_caption": body.hasOwnProperty("Own Caption") ? body["Own Caption"] : "",
        "bonus_task_title": body.hasOwnProperty("Task Title") ? body["Task Title"] : "",
        "bonus_task_summary_content": body.hasOwnProperty("Summary Content") ? body["Summary Content"] : "",
        "bonus_task_image_url": body.hasOwnProperty("Image Url") ? body["Image Url"] : "",
        "bonus_task_video_url": body.hasOwnProperty("Video Url") ? body["Video Url"] : "",
        "bonus_task_completion_date": body.hasOwnProperty("Completion Date") ? body["Completion Date"] : "",
        "bonus_task_entry_date": body.hasOwnProperty("Entry Date") ? body["Entry Date"] : "",
        "bonus_task_hashtag": body.hasOwnProperty("Hashtag") ? body["Hashtag"] : "",
        "bonus_task_images": body.hasOwnProperty("Bonus Task Images") ? body["Bonus Task Images"] : ""
    }
        BonusTask.create(bonusTaskData).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.bonus_task_id,data.dataValues);
        res.status(201).send({			
            msg: "Bonus Task Created Successfully",
            bonusTaskId: data.bonus_task_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Bonus Task=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Bonus Task."
        });
    })
};

/**
 * Function to get all Bonus Task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusTaskListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'bonus_task_id'
	const sortOrder = req.query.sortOrder || 'DESC'
    
    var options = {
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    
    if(req.query.sortVal) {
        var sortValue = req.query.sortVal;
        options.where = sortValue ? {
            [sortBy]: `${sortValue}`
        } : null;
    }
    if (req.query.brandId) {
        options['where']['bonus_task_brand_id'] = req.query.brandId;
    }
    if (req.query.taskId) {
        options['where']['bonus_task_id'] = req.query.taskId;
    }
    if (req.query.userId) {
        options['where']['bonus_task_usr_id'] = req.query.userId;
    }
    var total = await BonusTask.count({
        where: options['where']
    });
    const bonusTask_list = await BonusTask.findAll(options);
    if (bonusTask_list.length) {
        for (const bonus_list_key in bonusTask_list) {
            bonusTask_list[bonus_list_key].dataValues.media_token = common.imageToken(bonusTask_list[bonus_list_key].bonus_task_id);
        }
    }
    
    res.status(200).send({
        data: bonusTask_list,
		totalRecords:total
    });
};
/**
 * Function to get single Bonus Task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusTaskDetails = async(req, res) => {
    const bonusTaskId = req.params.bonusTaskId;
    var options = {
        where: {
            bonus_task_id: bonusTaskId
        }
    };
    const bonusTask = await BonusTask.findOne(options);
    if(!bonusTask){
        res.status(500).send({
            message: "Bonus Task not found"
        });
        return
    }
    res.status(200).send({
        data: bonusTask,
		media_token: common.imageToken(bonusTaskId)
    });
};
/**
 * Function to update single Bonus Task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateBonusTask = async(req, res) => {
    const id = req.params.bonusTaskId;
    var BonusTaskDetails = await BonusTask.findOne({
        where: {
            bonus_task_id: id
        }
    });
    BonusTask.update(req.body, {
		returning:true,
        where: {
            bonus_task_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','BonusTaskDetails',id,result.dataValues,BonusTaskDetails);
            res.status(200).send({
                message: "Bonus Task updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Bonus Task with id=${id}. Maybe Bonus Task was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Bonus Task with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Bonus Task with id=" + id
        });
    });
};

/**
 * Function to delete Bonus Task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteBonusTask = async (req, res) => {
    const BonusTaskDetails = await BonusTask.findOne({
            where: {
                bonus_task_id: req.params.bonusTaskId
            }
        });
    if(!BonusTaskDetails){
        res.status(500).send({
            message: "Could not delete Bonus Task with id=" + req.params.bonusTaskId
          });
          return;
    }
    BonusTask.destroy({
        where: { 
            bonus_task_id: req.params.bonusTaskId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Bonus Task deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Bonus Task with id=" + req.params.bonusTaskId
          });
          return;
        });
    }