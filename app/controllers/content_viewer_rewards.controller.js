const db = require("../models");
const contentViewerReward = db.content_viewer_rewards;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add content viewer reward
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.AddcontentViewerReward = async(req, res) => {
    
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    var UserId= req.header(process.env.UKEY_HEADER || "x-api-key");
    const contentViewerRewardData = {
        "user_id": body.hasOwnProperty("User Id") ? body["User Id"] : UserId,
        "video_task_id": body["Video Task Id"],
        "money_pouch_amount": body.hasOwnProperty("Money Pouch Amount") ? body["Money Pouch Amount"] : "",
        "money_pouch_countdown": body.hasOwnProperty("Money Pouch Countdown") ? body["Money Pouch Countdown"] : 0,
        "total_video_watched": body.hasOwnProperty("Total Video Watched") ? body["Total Video Watched"] : 0
        }
    contentViewerReward.create(contentViewerRewardData).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.cvr_id,data.dataValues);
        res.status(201).send({			
            msg: "Content Viewer Reward Added Successfully",
            ContentViewerRewardId: data.cvr_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Content Viewer Reward=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Content Viewer Reward."
        });
    })
};

/**
 * Function to get all Video Ads
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.contentViewerRewardListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'cvr_id'
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
    var total = await contentViewerReward.count({
        where: options['where']
    });
    const contentViewerList = await contentViewerReward.findAll(options);
    res.status(200).send({
        data: contentViewerList,
		totalRecords:total
    });
};