const db = require("../models");
const WinnerAlgo = db.winner_algo;
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
exports.addWinner = async(req, res) => {
    
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const WinnerAlgoData = {
        "bonus_task_id": body.hasOwnProperty("Bonus Task Id") ? body["Bonus Task Id"] : 0,
        "bonus_task_complete_time": body.hasOwnProperty("Bonus Task Completion Date") ? body["Bonus Task Completion Date"] : '',
        "winner_user_id": body.hasOwnProperty("Winner User Id") ? body["Winner User Id"] : ""
        }
        WinnerAlgo.create(WinnerAlgoData).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','winner_algo',data.winner_algo_id,data.dataValues);
        res.status(201).send({			
            msg: "Winner Algo Added Successfully",
            WinnerAlgoId: data.winner_algo_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while adding Winner=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while Winner."
        });
    })
};

/**
 * Function to get all ticket distributions
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.winnerListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'Winner_algo_id'
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
    var total = await WinnerAlgo.count({
        where: options['where']
    });
    const Winner_list = await WinnerAlgo.findAll(options);
    res.status(200).send({
        data: Winner_list,
		totalRecords:total
    });
};