const db = require("../../models");
const RewardCenter = db.reward_center;
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new Reward Center
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createRewardCenter = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const data = {
        "reward_center_name": body.hasOwnProperty("Center Name") ? body["Center Name"] : 0,
        "reward_center_owner_id": body.hasOwnProperty("Owner Id") ? body["Owner Id"] : "",
        "reward_center_location_id": body.hasOwnProperty("Location Id") ? body["Location Id"] : 0,
        "reward_center_reward_type": body.hasOwnProperty("Reward Type") ? body["Reward Type"] : 0,
        "reward_center_reward_trigger_id": body.hasOwnProperty("Trigger Id") ? body["Trigger Id"] : 0,
    }
    RewardCenter.create(data).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.reward_center_id,data.dataValues);
        res.status(201).send({			
            msg: "Reward Center Created Successfully",
            RewardCenterId: data.reward_center_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Reward Center=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Reward Center."
        });
    })
};

/**
 * Function to get all Reward Center
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.rewardCenterListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'reward_center_id'
	const sortOrder = req.query.sortOrder || 'DESC'
    
    var options = {
        include: [
            {
              model: db.page_location,
              attributes: ['page_id', 'page_name'],
              required: false
            }
          ],
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
    var total = await RewardCenter.count({
        where: options['where']
    });
    const RewardCenter_list = await RewardCenter.findAll(options);
    res.status(200).send({
        data: RewardCenter_list,
		totalRecords:total
    });
};
/**
 * Function to get single Reward Center
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.rewardCenterDetails = async(req, res) => {
    const rewardCenterId = req.params.rewardCenterId;
    var options = {
        include: [
            {
              model: db.page_location,
              attributes: ['page_id', 'page_name'],
              required: false
            }
          ],
        where: {
            reward_center_id: rewardCenterId
        }
    };
    const data = await RewardCenter.findOne(options);
    if(!RewardCenter){
        res.status(500).send({
            message: "Reward Center not found"
        });
        return
    }
    res.status(200).send({
        data: data
    });
};
/**
 * Function to update single Reward Center
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateRewardCenter = async(req, res) => {
    const id = req.params.rewardCenterId;
    var RewardCenterDetails = await RewardCenter.findOne({
        where: {
            reward_center_id: id
        }
    });
    RewardCenter.update(req.body, {
		returning:true,
        where: {
            reward_center_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','RewardCenter',id,result.dataValues,RewardCenterDetails);
            res.status(200).send({
                message: "Reward Center updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Reward Center with id=${id}. Maybe Reward Center was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Reward Center with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Reward Center with id=" + id
        });
    });
};

/**
 * Function to delete Reward Center
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteRewardCenter = async (req, res) => {
    const RewardCenterDetails = await RewardCenter.findOne({
            where: {
                reward_center_id: req.params.rewardCenterId
            }
        });
    if(!RewardCenterDetails){
        res.status(500).send({
            message: "Could not delete Reward Center with id=" + req.params.rewardCenterId
          });
          return;
    }
    RewardCenter.destroy({
        where: { 
            reward_center_id: req.params.rewardCenterId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Reward Center deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Reward Center with id=" + req.params.RewardCenterId
          });
          return;
        });
    }