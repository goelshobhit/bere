const db = require("../models");
const NotifyEvent = db.notify_event;
const Op = db.Sequelize.Op;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new Notify Event
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNotifyEvent = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const notifyEvent = {
        "notify_event_name": body.hasOwnProperty("Event Name") ? body["Event Name"] : 0,
        "notify_event_type": body.hasOwnProperty("Event Type") ? body["Event Type"] : 0,
        "cr_co_id": body.hasOwnProperty("Brand Id") ? body["Brand Id"] : 0,
        "notify_event_date": body.hasOwnProperty("Event Date") ? body["Event Date"] : new Date(),
        "notify_event_usrid": body.hasOwnProperty("Event Usrid") ? body["Event Usrid"] : 0,
        "notify_event_usrOptin": body.hasOwnProperty("Event UsrOptin") ? body["Event UsrOptin"] : 0,
        "notify_event_usrOptOut": body.hasOwnProperty("Event UsrOptOut") ? body["Event UsrOptOut"] : 0,
        "notify_event_usrOptOut_date": body.hasOwnProperty("Event UsrOptOut Date") ? body["Event UsrOptOut Date"] : 0,
    }
    NotifyEvent.create(notifyEvent).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.notify_event_id,data.dataValues);
        res.status(201).send({			
            msg: "Notify Event Created Successfully",
            campID: data.notify_event_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Notify Event=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Notify Event."
        });
    })
};

/**
 * Function to get all Notify Event
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.notifyEventListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'notify_event_id'
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
                notify_event_name: {
                        [Op.iLike]: `%${sortValue}%`
                    }
                }
            ]
        } : null;			
    }
    var total = await NotifyEvent.count({
        where: options['where']
    });
    const notifyEvent_list = await NotifyEvent.findAll(options);
    res.status(200).send({
        data: notifyEvent_list,
		totalRecords:total
    });
};
/**
 * Function to get single Notify Event
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.notifyEventDetails = async(req, res) => {
    const notifyEventId = req.params.notifyEventId;
    var options = {
        where: {
            notify_event_id: notifyEventId
        }
    };
    const notifyEvent = await NotifyEvent.findOne(options);
    if(!notifyEvent){
        res.status(500).send({
            message: "Notify Event not found"
        });
        return
    }
    res.status(200).send({
        data: notifyEvent
    });
};
/**
 * Function to update single Notify Event
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateNotifyEvent = async(req, res) => {
    const id = req.params.notifyEventId;
    const body = req.body;
    var NotifyEventDetails = await NotifyEvent.findOne({
        where: {
            notify_event_id: id
        }
    });
    const notifyEvent = {
        "notify_event_name": body.hasOwnProperty("Event Name") ? body["Event Name"] : 0,
        "notify_event_type": body.hasOwnProperty("Event Type") ? body["Event Type"] : 0,
        "cr_co_id": body.hasOwnProperty("Brand Id") ? body["Brand Id"] : 0,
        "notify_event_date": body.hasOwnProperty("Event Date") ? body["Event Date"] : new Date(),
        "notify_event_usrid": body.hasOwnProperty("Event Usrid") ? body["Event Usrid"] : 0,
        "notify_event_usrOptin": body.hasOwnProperty("Event UsrOptin") ? body["Event UsrOptin"] : 0,
        "notify_event_usrOptOut": body.hasOwnProperty("Event UsrOptOut") ? body["Event UsrOptOut"] : 0,
        "notify_event_usrOptOut_date": body.hasOwnProperty("Event UsrOptOut Date") ? body["Event UsrOptOut Date"] : 0,
    }
    NotifyEvent.update(notifyEvent, {
		returning:true,
        where: {
            notify_event_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','notifyEvent',id,result.dataValues,NotifyEventDetails);
            res.status(200).send({
                message: "Notify Event updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Notify Event with id=${id}. Maybe Notify Event was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Notify Event with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Notify Event with id=" + id
        });
    });
};

/**
 * Function to delete Notify Event
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteNotifyEvent = async (req, res) => {
    const notifyEventDetails = await NotifyEvent.findOne({
            where: {
                notify_event_id: req.params.notify_event_id
            }
        });
    if(!notifyEventDetails){
        res.status(500).send({
            message: "Could not delete Notify Event with id=" + req.params.notify_event_id
          });
          return;
    }
    NotifyEvent.destroy({
        where: { 
            notify_event_id: req.params.notify_event_id
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Notify Event deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Notify Event with id=" + req.params.notify_event_id
          });
          return;
        });
    }