const db = require("../models");
const NotifyObject = db.notify_object;
const Op = db.Sequelize.Op;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new NotifyObject
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNotifyObject = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const notifyObjectData = {
        "notify_object_name": body.hasOwnProperty("Object Name") ? body["Object Name"] : "",
        "notify_object_description": body.hasOwnProperty("Object Description") ? body["Object Description"] : null,
        "notify_object_task_id": body.hasOwnProperty("Task Id") ? body["Task Id"] : null,
    }
    NotifyObject.create(notifyObjectData).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.notify_object_id,data.dataValues);
        res.status(201).send({			
            msg: "NotifyObject Created Successfully",
            notifyObjectId: data.notify_object_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the NotifyObject=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the NotifyObject."
        });
    })
};

/**
 * Function to get all NotifyObject
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.NotifyObjectListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'notify_object_id'
	const sortOrder = req.query.sortOrder || 'DESC'
    
    var options = {
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
                notify_object_name: {
                        [Op.iLike]: `%${sortValue}%`
                    }
                }
            ]
        } : null;			
    }
    var total = await NotifyObject.count({
        where: options['where']
    });
    const NotifyObject_list = await NotifyObject.findAll(options);
    res.status(200).send({
        data: NotifyObject_list,
		totalRecords:total
    });
};
/**
 * Function to get single NotifyObject
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.NotifyObjectDetails = async(req, res) => {
    const notifyObjectId = req.params.notifyObjectId;
    var options = {
        where: {
            notify_object_id: notifyObjectId
        }
    };
    const NotifyObject = await NotifyObject.findOne(options);
    if(!NotifyObject){
        res.status(500).send({
            message: "NotifyObject not found"
        });
        return
    }
    res.status(200).send({
        data: NotifyObject
    });
};
/**
 * Function to update single NotifyObject
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateNotifyObject = async(req, res) => {
    const id = req.params.notifyObjectId;
    var NotifyObjectDetails = await NotifyObject.findOne({
        where: {
            notify_object_id: id
        }
    });
    NotifyObject.update(req.body, {
		returning:true,
        where: {
            notify_object_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','NotifyObject',id,result.dataValues,NotifyObjectDetails);
            res.status(200).send({
                message: "NotifyObject updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update NotifyObject with id=${id}. Maybe NotifyObject was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating NotifyObject with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating NotifyObject with id=" + id
        });
    });
};

/**
 * Function to delete NotifyObject
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteNotifyObject = async (req, res) => {
    const NotifyObjectDetails = await NotifyObject.findOne({
            where: {
                notify_object_id: req.params.notifyObjectId
            }
        });
    if(!NotifyObjectDetails){
        res.status(500).send({
            message: "Could not delete NotifyObject with id=" + req.params.notifyObjectId
          });
          return;
    }
    NotifyObject.destroy({
        where: { 
            notify_object_id: req.params.notifyObjectId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "NotifyObject deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete NotifyObject with id=" + req.params.notifyObjectId
          });
          return;
        });
    }