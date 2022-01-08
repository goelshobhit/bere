const db = require("../models");
const NotifySent = db.notify_trig_sent;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new Notify Sent
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNotifySent = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const notifySent = {
        "notify_trig_id": body.hasOwnProperty("Notify Trigger Id") ? body["Notify Trigger Id"] : 0,
        "u_id": body.hasOwnProperty("User Id") ? body["User Id"] : 0,
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
    NotifySent.create(notifySent).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.notify_sent_trig_id,data.dataValues);
        res.status(201).send({			
            msg: "Notify Sent Created Successfully",
            notifyTrigId: data.notify_trig_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Notify Sent=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Notify Sent."
        });
    })
};

/**
 * Function to get all Notify Sent
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.notifySentListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'notify_sent_trig_id'
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
    var total = await NotifySent.count({
        where: options['where']
    });
    const notifySent_list = await NotifySent.findAll(options);
    res.status(200).send({
        data: notifySent_list,
		totalRecords:total
    });
};
/**
 * Function to get all Notify Sent Of The User
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.notifySentListingOfTheUser = async(req, res) => {
    const userId = req.header(process.env.UKEY_HEADER || "x-api-key");
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'notify_sent_trig_id'
	const sortOrder = req.query.sortOrder || 'DESC'
    
    var options = {
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {
            u_id: userId
        }
    };
    if(req.query.sortVal) {
        var sortValue = req.query.sortVal;
        options.where = sortValue ? {
            [sortBy]: `${sortValue}`
        } : null;
    }
    var total = await NotifySent.count({
        where: options['where']
    });
    const notifySent_list = await NotifySent.findAll(options);
    res.status(200).send({
        data: notifySent_list,
		totalRecords:total
    });
};
/**
 * Function to get single Notify Sent
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.notifyTriggerDetails = async(req, res) => {
    const notifySentTrigId = req.params.notifySentTrigId;
    var options = {
        where: {
            notify_sent_trig_id: notifySentTrigId
        }
    };
    const notifySent = await NotifySent.findOne(options);
    if(!notifySent){
        res.status(500).send({
            message: "Notify Sent not found"
        });
        return
    }
    res.status(200).send({
        data: notifySent
    });
};
/**
 * Function to update single Notify Sent
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateNotifySent = async(req, res) => {
    const id = req.params.notifySentTrigId;
    var NotifySentDetails = await NotifySent.findOne({
        where: {
            notify_sent_trig_id: id
        }
    });
    NotifySent.update(req.body, {
		returning:true,
        where: {
            notify_trig_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','notifySent',id,result.dataValues,NotifySentDetails);
            res.status(200).send({
                message: "Notify Sent updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Notify Sent with id=${id}. Maybe Notify Sent was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Notify Sent with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Notify Sent with id=" + id
        });
    });
};

/**
 * Function to delete Notify Sent
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteNotifySent = async (req, res) => {
    const notifySentDetails = await NotifySent.findOne({
            where: {
                notify_sent_trig_id: req.params.notifySentTrigId
            }
        });
    if(!notifySentDetails){
        res.status(500).send({
            message: "Could not delete Notify Sent with id=" + req.params.notifySentTrigId
          });
          return;
    }
    NotifySent.destroy({
        where: { 
            notify_sent_trig_id: req.params.notifySentTrigId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Notify Sent deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Notify Sent with id=" + req.params.notifySentTrigId
          });
          return;
        });
    }