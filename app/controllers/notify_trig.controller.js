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
        "notify_event_id": body.hasOwnProperty("Event Id") ? body["Event Id"] : 0,
        "notify_method": body.hasOwnProperty("Method") ? body["Method"] : "",
        "notify_type": body.hasOwnProperty("Type") ? body["Type"] : "",
        "notify_trig_pushalert": body.hasOwnProperty("Pushalert") ? body["Pushalert"] : "",
        "notify_trig_msg": body.hasOwnProperty("Message") ? body["Message"] : "",
        "notify_trig_grp_id": body.hasOwnProperty("Group Id") ? body["Group Id"] : 0,
        "notify_group_name": body.hasOwnProperty("Group Name") ? body["Group Name"] : "",
        "notify_send_date": body.hasOwnProperty("Send Date") ? body["Send Date"] : new Date(),
        "notify_ack": body.hasOwnProperty("Ack") ? body["Ack"] : new Date(),
        "notify_trig_status": body.hasOwnProperty("Trigger Status") ? body["Trigger Status"] : "",
        "notify_trig_push_id": body.hasOwnProperty("Trigger Push Id") ? body["Trigger Push Id"] : 0,
        "cr_co_id": body.hasOwnProperty("Brand Id") ? body["Brand Id"] : 0
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
    const body = req.body
    const id = req.params.notifyTrigId;
    var NotifyTriggerDetails = await NotifyTrigger.findOne({
        where: {
            notify_trig_id: id
        }
    });
    const notifyTrig = {
        "notify_event_id": body.hasOwnProperty("Event Id") ? body["Event Id"] : 0,
        "notify_method": body.hasOwnProperty("Method") ? body["Method"] : "",
        "notify_type": body.hasOwnProperty("Type") ? body["Type"] : "",
        "notify_trig_pushalert": body.hasOwnProperty("Pushalert") ? body["Pushalert"] : "",
        "notify_trig_msg": body.hasOwnProperty("Message") ? body["Message"] : "",
        "notify_trig_grp_id": body.hasOwnProperty("Group Id") ? body["Group Id"] : 0,
        "notify_group_name": body.hasOwnProperty("Group Name") ? body["Group Name"] : "",
        "notify_send_date": body.hasOwnProperty("Send Date") ? body["Send Date"] : new Date(),
        "notify_ack": body.hasOwnProperty("Ack") ? body["Ack"] : new Date(),
        "notify_trig_status": body.hasOwnProperty("Trigger Status") ? body["Trigger Status"] : "",
        "notify_trig_push_id": body.hasOwnProperty("Trigger Push Id") ? body["Trigger Push Id"] : 0,
        "cr_co_id": body.hasOwnProperty("Brand Id") ? body["Brand Id"] : 0
    }
    NotifyTrigger.update(notifyTrig, {
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