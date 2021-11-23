const db = require("../models");
const VideoAdsSubmit = db.video_ads_submit;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new Video Ads Submit
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createVideoAdsSubmit = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const videoAdsSubmit = {
        "u_id": body.hasOwnProperty("User Id") ? body["User Id"] : 0,
        "video_ads_submit_watch_timestamp": body.hasOwnProperty("Watch Timestamp") ? body["Watch Timestamp"] : "",
        "video_ads_submit_watch_completion": body.hasOwnProperty("Watch Completion") ? body["Watch Completion"] : 0,
        "video_ads_submit_timestamp": body.hasOwnProperty("Submit Timestamp") ? body["Submit Timestamp"] : "",
        "video_ads_submit_reward_ack": body.hasOwnProperty("Reward Ack") ? body["Reward Ack"] : 0,
        }
    VideoAdsSubmit.create(videoAdsSubmit).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.video_ads_submit_id,data.dataValues);
        res.status(201).send({			
            msg: "Video Ads Submit Created Successfully",
            videoAdsSubmitId: data.video_ads_submit_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Video Ads Submit=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Video Ads Submit."
        });
    })
};

/**
 * Function to get all Video Ads Submit
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.videoAdsSubmitListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'video_ads_submit_id'
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
    var total = await VideoAdsSubmit.count({
        where: options['where']
    });
    const videoAdsSubmit_list = await VideoAdsSubmit.findAll(options);
    res.status(200).send({
        data: videoAdsSubmit_list,
		totalRecords:total
    });
};
/**
 * Function to get single Video Ads Submit
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.videoAdsSubmitDetails = async(req, res) => {
    const videoAdsSubmitId = req.params.videoAdsSubmitId;
    var options = {
        where: {
            video_ads_submit_id: videoAdsSubmitId
        }
    };
    const videoAdsSubmit = await VideoAdsSubmit.findOne(options);
    if(!videoAdsSubmit){
        res.status(500).send({
            message: "Video Ads Submit not found"
        });
        return
    }
    res.status(200).send({
        data: videoAdsSubmit
    });
};
/**
 * Function to update single Video Ads Submit
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateVideoAdsSubmit = async(req, res) => {
    const body = req.body
    const id = req.params.videoAdsSubmitId;
    var VideoAdsSubmitDetails = await VideoAdsSubmit.findOne({
        where: {
            video_ads_submit_id: id
        }
    });
    const videoAdsSubmit = {
        "u_id": body.hasOwnProperty("User Id") ? body["User Id"] : 0,
        "video_ads_submit_watch_timestamp": body.hasOwnProperty("Watch Timestamp") ? body["Watch Timestamp"] : "",
        "video_ads_submit_watch_completion": body.hasOwnProperty("Watch Completion") ? body["Watch Completion"] : 0,
        "video_ads_submit_timestamp": body.hasOwnProperty("Submit Timestamp") ? body["Submit Timestamp"] : "",
        "video_ads_submit_reward_ack": body.hasOwnProperty("Reward Ack") ? body["Reward Ack"] : 0,
        }
    VideoAdsSubmit.update(videoAdsSubmit, {
		returning:true,
        where: {
            video_ads_submit_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','videoAdsSubmit',id,result.dataValues,VideoAdsSubmitDetails);
            res.status(200).send({
                message: "Video Ads Submit updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Video Ads Submit with id=${id}. Maybe Video Ads Submit was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Video Ads Submit with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Video Ads Submit with id=" + id
        });
    });
};

/**
 * Function to delete Video Ads Submit
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteVideoAdsSubmit = async (req, res) => {
    const videoAdsDetails = await VideoAdsSubmit.findOne({
            where: {
                video_ads_submit_id: req.params.videoAdsSubmitId
            }
        });
    if(!videoAdsDetails){
        res.status(500).send({
            message: "Could not delete Video Ads Submit with id=" + req.params.videoAdsSubmitId
          });
          return;
    }
    VideoAdsSubmit.destroy({
        where: { 
            video_ads_submit_id: req.params.videoAdsSubmitId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Video Ads Submit deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Video Ads Submit with id=" + req.params.videoAdsSubmitId
          });
          return;
        });
    }