const db = require("../models");
const VideoAds = db.video_ads;
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
exports.createVideoAds = async(req, res) => {
    
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const videoAds = {
        "cr_co_id": body.hasOwnProperty("Brand Id") ? body["Brand Id"] : 0,
        "video_ads_name": body.hasOwnProperty("Ads Name") ? body["Ads Name"] : 0,
        "video_ads_url": body.hasOwnProperty("Ads Url") ? body["Ads Url"] : "",
        "video_ads_timestamp": body.hasOwnProperty("Ads Timestamp") ? body["Ads Timestamp"] : "",
        "video_ads_lenght_secs": body.hasOwnProperty("Ads Lenght Secs") ? body["Ads Lenght Secs"] : 0,
        "video_ads_status": body.hasOwnProperty("Ads Status") ? body["Ads Status"] : 0,
        "video_ads_public": body.hasOwnProperty("Ads Public") ? body["Ads Public"] : 0,
        "video_ads_brand_tier": body.hasOwnProperty("Ads Brand Tier") ? body["Ads Brand Tier"] : 0,
        "video_ads_campaign_type": body.hasOwnProperty("Ads Campaign Type") ? body["Ads Campaign Type"] : 0,
        "video_ads_budget": body.hasOwnProperty("Ads Budget") ? body["Ads Budget"] : 0,
        "video_budget_left": body.hasOwnProperty("Budget Left") ? body["Budget Left"] : 0,
        "video_tokens_given": body.hasOwnProperty("Tokens Given") ? body["Tokens Given"] : 0,
        "video_stars_given": body.hasOwnProperty("Stars Given") ? body["Stars Given"] : 0,
        "video_tokens_given_value": body.hasOwnProperty("Tokens Given Value") ? body["Tokens Given Value"] : 0,
        "video_stars_given_value": body.hasOwnProperty("Stars Given Value") ? body["Stars Given Value"] : 0,
        }
    VideoAds.create(videoAds).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.video_ads_id,data.dataValues);
        res.status(201).send({			
            msg: "Video Ads Created Successfully",
            videoAdsId: data.video_ads_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Video Ads=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Video Ads."
        });
    })
};

/**
 * Function to get all Video Ads
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.videoAdsListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'video_ads_id'
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
    var total = await VideoAds.count({
        where: options['where']
    });
    const videoAds_list = await VideoAds.findAll(options);
    res.status(200).send({
        data: videoAds_list,
		totalRecords:total
    });
};
/**
 * Function to get single Video Ads
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.videoAdsDetails = async(req, res) => {
    const videoAdsId = req.params.videoAdsId;
    var options = {
        where: {
            video_ads_id: videoAdsId
        }
    };
    const videoAds = await VideoAds.findOne(options);
    if(!videoAds){
        res.status(500).send({
            message: "Video Ads not found"
        });
        return
    }
    res.status(200).send({
        data: videoAds
    });
};
/**
 * Function to update single Video Ads
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateVideoAds = async(req, res) => {
    const id = req.params.videoAdsId;
    var VideoAdsDetails = await VideoAds.findOne({
        where: {
            video_ads_id: id
        }
    });
    VideoAds.update(req.body, {
		returning:true,
        where: {
            video_ads_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','videoAds',id,result.dataValues,VideoAdsDetails);
            res.status(200).send({
                message: "Video Ads updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Video Ads with id=${id}. Maybe Video Ads was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Video Ads with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Video Ads with id=" + id
        });
    });
};

/**
 * Function to delete Video Ads
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteVideoAds = async (req, res) => {
    const videoAdsDetails = await VideoAds.findOne({
            where: {
                video_ads_id: req.params.videoAdsId
            }
        });
    if(!videoAdsDetails){
        res.status(500).send({
            message: "Could not delete Video Ads with id=" + req.params.videoAdsId
          });
          return;
    }
    VideoAds.destroy({
        where: { 
            video_ads_id: req.params.videoAdsId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Video Ads deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Video Ads with id=" + req.params.videoAdsId
          });
          return;
        });
    };