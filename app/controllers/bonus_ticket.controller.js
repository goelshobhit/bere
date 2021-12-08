const db = require("../models");
const BonusTicket = db.bonus_ticket;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new Bonus Ticket
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createBonusTicket = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const bonusTicket = {
        "bonus_summary_id": body.hasOwnProperty("Bonus Summary") ? body["Bonus Summary"] : 0,
        "bonus_ticket_entry_timestamp": body.hasOwnProperty("Entry Timestamp") ? body["Entry Timestamp"] : "",
        "bonus_ticket_contest_start_timestamp": body.hasOwnProperty("Start Timestamp") ? body["Start Timestamp"] : "",
        "bonus_ticket_contest_end_timestamp": body.hasOwnProperty("End Timestamp") ? body["End Timestamp"] : "",
        "bonus_ticket_rules_id": body.hasOwnProperty("Rules Id") ? body["Rules Id"] : 0,
        "bonus_ticket_rules": body.hasOwnProperty("Rules") ? body["Rules"] : "",
        "bonus_ticket_usrid": body.hasOwnProperty("User Id") ? body["User Id"] : 0,
        "bonus_ticket_entry1": body.hasOwnProperty("Entry1") ? body["Entry1"] : 0,
        "bonus_ticket_winning": body.hasOwnProperty("Winning") ? body["Winning"] : 0,
        "bonus_ticket_bonus_taskid": body.hasOwnProperty("Task Id") ? body["Task Id"] : 0,
        }
    BonusTicket.create(bonusTicket).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.bonus_ticket_id,data.dataValues);
        res.status(201).send({			
            msg: "BonusTicket Created Successfully",
            bonusTicketId: data.bonus_ticket_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Bonus Ticket=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Bonus Ticket."
        });
    })
};

/**
 * Function to get all Bonus Ticket
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusTicketListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'bonus_ticket_id'
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
    var total = await BonusTicket.count({
        where: options['where']
    });
    const bonusTicket_list = await BonusTicket.findAll(options);
    res.status(200).send({
        data: bonusTicket_list,
		totalRecords:total
    });
};
/**
 * Function to get single Bonus Ticket
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusTicketDetails = async(req, res) => {
    const bonusTicketId = req.params.bonusTicketId;
    var options = {
        where: {
            bonus_ticket_id: bonusTicketId
        }
    };
    const bonusTicket = await BonusTicket.findOne(options);
    if(!bonusTicket){
        res.status(500).send({
            message: "Bonus Ticket not found"
        });
        return
    }
    res.status(200).send({
        data: bonusTicket
    });
};
/**
 * Function to update single Bonus Ticket
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateBonusTicket = async(req, res) => {
    const id = req.params.bonusTicketId;
    const body = req.body;
    var BonusTicketDetails = await BonusTicket.findOne({
        where: {
            bonus_ticket_id: id
        }
    });
    const bonusTicket = {
        "bonus_summary_id": body.hasOwnProperty("Bonus Summary") ? body["Bonus Summary"] : 0,
        "bonus_ticket_entry_timestamp": body.hasOwnProperty("Entry Timestamp") ? body["Entry Timestamp"] : "",
        "bonus_ticket_contest_start_timestamp": body.hasOwnProperty("Start Timestamp") ? body["Start Timestamp"] : "",
        "bonus_ticket_contest_end_timestamp": body.hasOwnProperty("End Timestamp") ? body["End Timestamp"] : "",
        "bonus_ticket_rules_id": body.hasOwnProperty("Rules Id") ? body["Rules Id"] : 0,
        "bonus_ticket_rules": body.hasOwnProperty("Rules") ? body["Rules"] : "",
        "bonus_ticket_usrid": body.hasOwnProperty("User Id") ? body["User Id"] : 0,
        "bonus_ticket_entry1": body.hasOwnProperty("Entry1") ? body["Entry1"] : 0,
        "bonus_ticket_winning": body.hasOwnProperty("Winning") ? body["Winning"] : 0,
        "bonus_ticket_bonus_taskid": body.hasOwnProperty("Task Id") ? body["Task Id"] : 0,
    }
    BonusTicket.update(bonusTicket, {
		returning:true,
        where: {
            bonus_ticket_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','BonusTicket',id,result.dataValues,BonusTicketDetails);
            res.status(200).send({
                message: "Bonus Ticket updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Bonus Ticket with id=${id}. Maybe Bonus Ticket was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Bonus Ticket with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Bonus Ticket with id=" + id
        });
    });
};

/**
 * Function to delete Bonus Ticket
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteBonusTicket = async (req, res) => {
    const BonusTicketDetails = await BonusTicket.findOne({
            where: {
                bonus_ticket_id: req.params.bonusTicketId
            }
        });
    if(!BonusTicketDetails){
        res.status(500).send({
            message: "Could not delete Bonus Ticket with id=" + req.params.bonusTicketId
          });
          return;
    }
    BonusTicket.destroy({
        where: { 
            bonus_ticket_id: req.params.bonusTicketId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Bonus Ticket deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Bonus Ticket with id=" + req.params.bonusTicketId
          });
          return;
        });
    }