const db = require("../models");
const TicketsDistribution = db.tickets_distribution;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new Video Ads
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.addUserTickets = async(req, res) => {
    
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const ticketDistributionData = {
        "tickets_distribution_user_id": body.hasOwnProperty("User Id") ? body["User Id"] : 0,
        "tickets_distribution_user_tickets_earned": body.hasOwnProperty("Ticket Earned") ? body["Ticket Earned"] : 0,
        "tickets_distribution_random_number_algo": body.hasOwnProperty("Random Number Algo") ? body["Random Number Algo"] : ""
        }
        TicketsDistribution.create(ticketDistributionData).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.tickets_distribution_id,data.dataValues);
        res.status(201).send({			
            msg: "Ticket Distribution Done Successfully",
            ticketsDistributionId: data.tickets_distribution_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while Ticket Distribution=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while Ticket Distribution."
        });
    })
};

/**
 * Function to get all ticket distributions
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.ticketDistributionListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'tickets_distribution_id'
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
    var total = await TicketsDistribution.count({
        where: options['where']
    });
    const ticketsdistribution_list = await TicketsDistribution.findAll(options);
    res.status(200).send({
        data: ticketsdistribution_list,
		totalRecords:total
    });
};