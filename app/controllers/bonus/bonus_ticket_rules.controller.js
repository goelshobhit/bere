const db = require("../../models");
const BonusTicketRules = db.bonus_ticket_rules;
const BonusRuleDetail = db.bonus_ticket_rule_detail;
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
exports.createBonusTicketRules = async (req, res) => {
    const body = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }

    const bonusTicketRule = {
        "bonus_ticket_rule_name": body.hasOwnProperty("Bonus Ticket Rule Name") ? body["Bonus Ticket Rule Name"] : "",
        "bonus_ticket_how_it_works": body.hasOwnProperty("Bonus Ticket How It Work") ? body["Bonus Ticket How It Work"] : "",
        "bonus_ticket_cashout_rules": body.hasOwnProperty("Bonus Ticket Cashout Rules") ? body["Bonus Ticket Cashout Rules"] : ""
    }
    var bonus_ticket_rules_id = '';
    var errorMessage = '';
    await BonusTicketRules.create(bonusTicketRule)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'Survey', data.bonus_ticket_rules_id, data.dataValues);
            bonus_ticket_rules_id = data.bonus_ticket_rules_id;
        })
        .catch(err => {
            logger.log("error", "Some error occurred while creating the Bonus Ticket Rules=" + err);
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Bonus Ticket Rules."
            });
        });
    var bonusTicketRequestRules = body.hasOwnProperty("Bonus Ticket Rule Details") ? body["Bonus Ticket Rule Details"] : '';
    if (bonusTicketRequestRules.length) {
        var requestedBonusTicketType = bonusTicketRequestRules.map(function (item) {
            return item['Bonus Rule Type']
        });
        requestedBonusTicketType = requestedBonusTicketType.filter(function (e) { return e === 0 || e });
        if (requestedBonusTicketType.length != bonusTicketRequestRules.length) {
            return res.status(400).send({
                msg: "Bonus Rule Type is required in all rules"
            });
        }
        for (const bonusTicketRuleKey in bonusTicketRequestRules) {
            var socialNetworks = '';
            if (bonusTicketRequestRules[bonusTicketRuleKey]['Social Networks'] != undefined) {
                socialNetworks = bonusTicketRequestRules[bonusTicketRuleKey]['Social Networks'];
            }
            await BonusRuleDetail.create({
                "bonus_ticket_rules_id": bonus_ticket_rules_id,
                "bonus_ticket_rule_type": bonusTicketRequestRules[bonusTicketRuleKey]['Bonus Rule Type'],
                "bonus_ticket_social_networks": socialNetworks,
                "bonus_rules": bonusTicketRequestRules[bonusTicketRuleKey]['Bonus Rules']
            }).then(bonusRuleData => {
                audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'bonus_rules', bonusRuleData.bonus_ticket_rule_detail_id, bonusRuleData.dataValues);
            })
                .catch(err => {
                    logger.log("error", "Some error occurred while creating the Bonus Ticket Rules=" + err);
                    errorMessage = err || "Some error occurred while give Reward.";
                });
        }
    }
    if (errorMessage) {
        res.status(500).send({
            msg: errorMessage
        });
    } else {
        res.status(201).send({
            msg: "Bonus Ticket Rules Added Successfully",
            bonusTicketRulesId: bonus_ticket_rules_id

        });
    }
};

/**
 * Function to get all Bonus Ticket Rules
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusTicketRulesListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'bonus_ticket_rules_id'
    const sortOrder = req.query.sortOrder || 'DESC'

    var options = {
        include: [{
            model: BonusRuleDetail
        }],
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
    if (req.query.bonusTicketRulesId) {
        options['where']['bonus_ticket_rules_id'] = req.query.bonusTicketRulesId;
    }
    var total = await BonusTicketRules.count({
        where: options['where']
    });
    const bonusTicketRules_list = await BonusTicketRules.findAll(options);
    res.status(200).send({
        data: bonusTicketRules_list,
        totalRecords: total
    });
};
/**
 * Function to get single Bonus Ticket Rules
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusTicketRulesDetails = async (req, res) => {
    const bonusTicketsRulesId = req.params.bonusTicketsRulesId;
    var options = {
        include: [{
            model: BonusRuleDetail
        }],
        where: {
            bonus_ticket_rules_id: bonusTicketsRulesId
        }
    };
    const bonusTicketRules = await BonusTicketRules.findOne(options);
    if (!bonusTicketRules) {
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
exports.updateBonusTicketRules = async (req, res) => {
    var isError = 0;
    const id = req.params.bonusTicketsRulesId;
    var options = {
        include: [{
            model: BonusRuleDetail
        }],
        where: { bonus_ticket_rules_id: id }
    };
    var BonusTicketRulesDetails = await BonusTicketRules.findOne(options);
    let bonusTicketDBRulesIds = [];
    if (BonusTicketRulesDetails.bonus_ticket_rule_details) {
        bonusTicketDBRulesIds = BonusTicketRulesDetails.bonus_ticket_rule_details.map(function (item) {
            return item.bonus_ticket_rule_detail_id
        });
    }

    var requested_body = JSON.parse(JSON.stringify(req.body));
    let requestedBonusTicketRuleIds = [];
    if (requested_body.hasOwnProperty('bonus_ticket_rule_details')) {
        delete requested_body['bonus_ticket_rule_details'];
        requestedBonusTicketRuleIds = req.body["bonus_ticket_rule_details"].map(function (item) {
            return item.bonus_ticket_rule_detail_id
        });
    }
    var errorMessage = '';
    if (requested_body && requested_body.bonus_ticket_rule_name != undefined) {
        await BonusTicketRules.update(requested_body, {
            returning: true,
            where: {
                bonus_ticket_rules_id: id
            }
        }).then(function ([num, [result]]) {
            if (num == 1) {
                audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'update', 'BonusTicketRules', id, result.dataValues, BonusTicketRulesDetails);

            } else {
                isError = 1;
                res.status(400).send({
                    message: `Cannot update Bonus Ticket Rules with id=${id}. Maybe Bonus Ticket Rules was not found or req.body is empty!`
                });
            }
        }).catch(err => {
            isError = 1;
            logger.log("error", err + ":Error updating Bonus Ticket Rules with id=" + id);
            console.log(err)
            return res.status(500).send({
                message: "Error updating Bonus Ticket Rules with id=" + id
            });
        });
    }

    if (isError == 0) {
        var bonusTicketRequestRules = req.body.hasOwnProperty("bonus_ticket_rule_details") ? req.body["bonus_ticket_rule_details"] : '';
        if (bonusTicketRequestRules.length) {
            for (const bonusTicketRuleKey in bonusTicketRequestRules) {
                var socialNetworks = '';
                if (bonusTicketRequestRules[bonusTicketRuleKey]['bonus_ticket_social_networks'] != undefined) {
                    socialNetworks = bonusTicketRequestRules[bonusTicketRuleKey]['bonus_ticket_social_networks'];
                }
                if (bonusTicketRequestRules[bonusTicketRuleKey]['bonus_ticket_rule_detail_id'] != undefined) {
                    var requested_rule_detail_id = bonusTicketRequestRules[bonusTicketRuleKey]['bonus_ticket_rule_detail_id'];
                    await BonusRuleDetail.update(bonusTicketRequestRules[bonusTicketRuleKey], {
                        returning: true,
                        where: {
                            bonus_ticket_rule_detail_id: requested_rule_detail_id
                        }
                    }).then(function ([bonus_rule_detail_num, [bonus_rule_result]]) {

                    }).catch(err => {
                        isError = 1;
                        logger.log("error", err + ":Error updating Bonus Ticket Rule Detail with id=" + requested_rule_detail_id);
                        console.log(err)
                        errorMessage = err.message || "Error updating Bonus Ticket Rule Detail with id=" + requested_rule_detail_id;
                    });
                } else {
                    if (bonusTicketRuleKey != 'diff') {
                        await BonusRuleDetail.create({
                            "bonus_ticket_rules_id": id,
                            "bonus_ticket_rule_type": bonusTicketRequestRules[bonusTicketRuleKey]['bonus_ticket_rule_type'],
                            "bonus_rules": bonusTicketRequestRules[bonusTicketRuleKey]['bonus_rules'],
                            "bonus_ticket_social_networks": socialNetworks
                        }).then(bonus_rule_detail => {
                            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'bonus_rule_detail', bonus_rule_detail.bonus_ticket_rule_detail_id, bonus_rule_detail.dataValues);

                        })
                        .catch(err => {
                            isError = 1;
                            logger.log("error", "Some error occurred while creating the Bonus Ticket Rule Detail=" + err);
                            errorMessage = err.message || "Error while creating Bonus Ticket Rule Detail";

                        });
                    }

                }

            }
        }
        if (errorMessage) {
            return res.status(500).send({
                msg: errorMessage
            });
        } else {
            Array.prototype.diff = function (a) {
                return this.filter(function (i) { return a.indexOf(i) < 0; });
            };
            const deletedBonusRuleIds = bonusTicketDBRulesIds.diff(requestedBonusTicketRuleIds);
            if (isError == 0 && deletedBonusRuleIds.length) {
                BonusRuleDetail.destroy({
                    where: {
                        bonus_ticket_rule_detail_id: deletedBonusRuleIds
                    }
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Could not delete Bonus Ticket Rules."
                    });
                    return;
                });
            }
        }
    }



    if (isError == 0) {
        return res.status(200).send({
            message: "Bonus Ticket Rules updated successfully."
        });
    }
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
            bonus_ticket_rules_id: req.params.bonusTicketsRulesId
        }
    });
    if (!BonusTicketRulesDetails) {
        res.status(500).send({
            message: "Could not delete Bonus Ticket Rules with id=" + req.params.bonusTicketsRulesId
        });
        return;
    }
    BonusTicketRules.destroy({
        where: {
            bonus_ticket_rules_id: req.params.bonusTicketsRulesId
        }
    })
        .then(num => {
            BonusRuleDetail.destroy({
                where: {
                    bonus_ticket_rules_id: req.params.bonusTicketsRulesId
                }
            })
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