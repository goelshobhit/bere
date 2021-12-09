const db = require("../../models");
const BonusTicketRules = db.bonus_ticket_rules;
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new Bonus Ticket Rules
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createBonusTicketRules = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const bonusTicketRules = {
        "bonus_tickets_rules": body.hasOwnProperty("Bonus Ticket Rules") ? body["Bonus Ticket Rules"] : "",
        "bonus_tickets_how_it_works": body.hasOwnProperty("How It Works") ? body["How It Works"] : "",
        "bonus_tickets_cashout_rules": body.hasOwnProperty("Cashout Rules") ? body["Cashout Rules"] : "",
       }
    BonusTicketRules.create(bonusTicketRules).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.bonus_tickets_rules_id,data.dataValues);
        res.status(201).send({			
            msg: "Bonus Ticket Rules Created Successfully",
            bonusTicketsRulesId: data.bonus_tickets_rules_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Bonus Ticket Rules=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Bonus Ticket Rules."
        });
    })
};

/**
 * Function to get all Bonus Ticket Rules
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusTicketRulesListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'bonus_tickets_rules_id'
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
    var total = await BonusTicketRules.count({
        where: options['where']
    });
    const bonusTicketRules_list = await BonusTicketRules.findAll(options);
    res.status(200).send({
        data: bonusTicketRules_list,
		totalRecords:total
    });
};
/**
 * Function to get single Bonus Ticket Rules
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusTicketRulesDetails = async(req, res) => {
    const bonusTicketsRulesId = req.params.bonusTicketsRulesId;
    var options = {
        where: {
            bonus_tickets_rules_id: bonusTicketsRulesId
        }
    };
    const bonusTicketRules = await BonusTicketRules.findOne(options);
    if(!bonusTicketRules){
        res.status(500).send({
            message: "Bonus Ticket Rules not found"
        });
        return
    }
    res.status(200).send({
        data: bonusTicketRules
    });
};
/**
 * Function to update single Bonus Ticket Rules
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateBonusTicketRules = async(req, res) => {
    const id = req.params.bonusTicketsRulesId;
    const body = req.body;
    var BonusTicketRulesDetails = await BonusTicketRules.findOne({
        where: {
            bonus_tickets_rules_id: id
        }
    });
    const bonusTicketRules = {
        "bonus_tickets_rules": body.hasOwnProperty("Bonus Ticket Rules") ? body["Bonus Ticket Rules"] : "",
        "bonus_tickets_how_it_works": body.hasOwnProperty("How It Works") ? body["How It Works"] : "",
        "bonus_tickets_cashout_rules": body.hasOwnProperty("Cashout Rules") ? body["Cashout Rules"] : "",
       }
    BonusTicketRules.update(bonusTicketRules, {
		returning:true,
        where: {
            bonus_tickets_rules_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','BonusTicketRules',id,result.dataValues,BonusTicketRulesDetails);
            res.status(200).send({
                message: "Bonus Ticket Rules updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Bonus Ticket Rules with id=${id}. Maybe Bonus Ticket Rules was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Bonus Ticket Rules with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Bonus Ticket Rules with id=" + id
        });
    });
};

/**
 * Function to delete Bonus Ticket Rules
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteBonusTicketRules = async (req, res) => {
    const BonusTicketRulesDetails = await BonusTicketRules.findOne({
            where: {
                bonus_tickets_rules_id: req.params.bonusTicketsRulesId
            }
        });
    if(!BonusTicketRulesDetails){
        res.status(500).send({
            message: "Could not delete Bonus Ticket Rules with id=" + req.params.bonusTicketsRulesId
          });
          return;
    }
    BonusTicketRules.destroy({
        where: { 
            bonus_tickets_rules_id: req.params.bonusTicketsRulesId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Bonus Ticket Rules deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Bonus Ticket Rules with id=" + req.params.bonusTicketsRulesId
          });
          return;
        });
    }