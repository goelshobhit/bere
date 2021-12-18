const db = require("../../models");
const RewardCount = db.reward_count;
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new Reward Count
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createRewardCount = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const data = {
        "reward_count_dist_id": body.hasOwnProperty("Dist Id") ? body["Dist Id"] : 0,
        "reward_count_dist_name": body.hasOwnProperty("Dist Name") ? body["Dist Name"] : "",
        "reward_count_timestamp": body.hasOwnProperty("Timestamp") ? body["Timestamp"] : new Date(),
        "reward_count_usr_id": body.hasOwnProperty("User Id") ? body["User Id"] : 0,
        "reward_count_no_of_rewards": body.hasOwnProperty("Number Of Rewards") ? body["Number Of Rewards"] : 0,
        "reward_count_summary_url": body.hasOwnProperty("Summary Url") ? body["Summary Url"] : "",
    }
    RewardCount.create(data).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.reward_count_id,data.dataValues);
        res.status(201).send({			
            msg: "Reward Count Created Successfully",
            RewardCountId: data.reward_count_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Reward Count=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Reward Count."
        });
    })
};

/**
 * Function to get all Reward Count
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.rewardCountListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'reward_count_id'
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
    var total = await RewardCount.count({
        where: options['where']
    });
    const RewardCount_list = await RewardCount.findAll(options);
    res.status(200).send({
        data: RewardCount_list,
		totalRecords:total
    });
};
/**
 * Function to get single Reward Count
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.rewardCountDetails = async(req, res) => {
    const rewardCountId = req.params.rewardCountId;
    var options = {
        where: {
            reward_count_id: rewardCountId
        }
    };
    const data = await RewardCount.findOne(options);
    if(!RewardCount){
        res.status(500).send({
            message: "Reward Count not found"
        });
        return
    }
    res.status(200).send({
        data: data
    });
};
/**
 * Function to update single Reward Count
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateRewardCount = async(req, res) => {
    const id = req.params.rewardCountId;
    const body = req.body;
    var RewardCountDetails = await RewardCount.findOne({
        where: {
            reward_count_id: id
        }
    });
    const data = {
        "reward_count_dist_id": body.hasOwnProperty("Dist Id") ? body["Dist Id"] : 0,
        "reward_count_dist_name": body.hasOwnProperty("Dist Name") ? body["Dist Name"] : "",
        "reward_count_timestamp": body.hasOwnProperty("Timestamp") ? body["Timestamp"] : new Date(),
        "reward_count_usr_id": body.hasOwnProperty("User Id") ? body["User Id"] : 0,
        "reward_count_no_of_rewards": body.hasOwnProperty("Number Of Rewards") ? body["Number Of Rewards"] : 0,
        "reward_count_summary_url": body.hasOwnProperty("Summary Url") ? body["Summary Url"] : "",
    }
    RewardCount.update(data, {
		returning:true,
        where: {
            reward_count_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','RewardCount',id,result.dataValues,RewardCountDetails);
            res.status(200).send({
                message: "Reward Count updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Reward Count with id=${id}. Maybe Reward Count was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Reward Count with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Reward Count with id=" + id
        });
    });
};

/**
 * Function to delete Reward Count
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteRewardCount = async (req, res) => {
    const RewardCountDetails = await RewardCount.findOne({
            where: {
                reward_count_id: req.params.rewardCountId
            }
        });
    if(!RewardCountDetails){
        res.status(500).send({
            message: "Could not delete Reward Count with id=" + req.params.RewardCountId
          });
          return;
    }
    RewardCount.destroy({
        where: { 
            reward_count_id: req.params.rewardCountId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Reward Count deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Reward Count with id=" + req.params.RewardCountId
          });
          return;
        });
    }