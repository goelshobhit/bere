const db = require("../models");
const NotifyTrigger = db.notify_trig;
const Op = db.Sequelize.Op;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new Notify Trigger
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNotifyTrigger = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const notifyTrig = {
        "Event Id": body.hasOwnProperty("Event Id") ? body["Event Id"] : null,
        "Method": body.hasOwnProperty("Method") ? body["Method"] : "",
        "Type": body.hasOwnProperty("Type") ? body["Type"] : "",
        "Pushalert": body.hasOwnProperty("Pushalert") ? body["Pushalert"] : "",
        "Message": body.hasOwnProperty("Message") ? body["Message"] : "",
        "Group Id": body.hasOwnProperty("Group Id") ? body["Group Id"] : null,
        "Group Name": body.hasOwnProperty("Group Name") ? body["Group Name"] : "",
        "Send Date": body.hasOwnProperty("Send Date") ? body["Send Date"] : new Date(),
        "Ack": body.hasOwnProperty("Ack") ? body["Ack"] : new Date(),
        "Trigger Status": body.hasOwnProperty("Trigger Status") ? body["Trigger Status"] : "",
        "Trigger Push Id": body.hasOwnProperty("Trigger Push Id") ? body["Trigger Push Id"] : null,
        "Brand Id": body.hasOwnProperty("Brand Id") ? body["Brand Id"] : null,
        "Object Id": body.hasOwnProperty("Object Id") ? body["Object Id"] : null
    }
    NotifyTrigger.create(notifyTrig).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.notify_trig_id,data.dataValues);
        res.status(201).send({			
            msg: "Notify Trigger Created Successfully",
            notifyTrigId: data.notify_trig_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Notify Trigger=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Notify Trigger."
        });
    })
};

/**
 * Function to get all Notify Trigger
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.notifyTriggerListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'notify_trig_id'
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
    var total = await NotifyTrigger.count({
        where: options['where']
    });
    const notifyTrigger_list = await NotifyTrigger.findAll(options);
    res.status(200).send({
        data: notifyTrigger_list,
		totalRecords:total
    });
};
/**
 * Function to get single Notify Trigger
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.notifyTriggerDetails = async(req, res) => {
    const notifyTrigId = req.params.notifyTrigId;
    var options = {
        where: {
            notify_trig_id: notifyTrigId
        }
    };
    const notifyTrigger = await NotifyTrigger.findOne(options);
    if(!notifyTrigger){
        res.status(500).send({
            message: "Notify Trigger not found"
        });
        return
    }
    res.status(200).send({
        data: notifyTrigger
    });
};
/**
 * Function to update single Notify Trigger
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateNotifyTrigger = async(req, res) => {
    const id = req.params.notifyTrigId;
    var NotifyTriggerDetails = await NotifyTrigger.findOne({
        where: {
            notify_trig_id: id
        }
    });
    NotifyTrigger.update(req.body, {
		returning:true,
        where: {
            notify_trig_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','notifyTrigger',id,result.dataValues,NotifyTriggerDetails);
            res.status(200).send({
                message: "Notify Trigger updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Notify Trigger with id=${id}. Maybe Notify Trigger was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Notify Trigger with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Notify Trigger with id=" + id
        });
    });
};

/**
 * Function to delete Notify Trigger
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteNotifyTrigger = async (req, res) => {
    const notifyTriggerDetails = await NotifyTrigger.findOne({
            where: {
                notify_trig_id: req.params.notifyTrigId
            }
        });
    if(!notifyTriggerDetails){
        res.status(500).send({
            message: "Could not delete Notify Trigger with id=" + req.params.notifyTrigId
          });
          return;
    }
    NotifyTrigger.destroy({
        where: { 
            notify_trig_id: req.params.notifyTrigId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Notify Trigger deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Notify Trigger with id=" + req.params.notifyTrigId
          });
          return;
        });
    }