const db = require("../../models");
const RewardCenterDist = db.reward_center_dist;
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new Reward Center Dist
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createRewardCenterDist = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    
    const data = {
        "reward_center_id": body.hasOwnProperty("Center Id") ? body["Center Id"] : 0,
        "reward_center_dist_status": body.hasOwnProperty("Dist Status") ? body["Dist Status"] : 0,
        "reward_center_name": body.hasOwnProperty("Center Name") ? body["Center Name"] : "",
        "reward_center_dist_one_freq": body.hasOwnProperty("One Freq") ? body["One Freq"] : 0,
        "reward_center_dist_one_total_token": body.hasOwnProperty("One Total Token") ? body["One Total Token"] : 0,
        "reward_center_dist_one_segment_id": body.hasOwnProperty("Segment Id") ? body["Segment Id"] : "",
        "reward_center_dist_one_name": body.hasOwnProperty("One Name") ? body["One Name"] : "",
        "reward_center_dist_one_stars": body.hasOwnProperty("One Stars") ? body["One Stars"] : 0,
        "reward_center_dist_one_stars_name": body.hasOwnProperty("Stars Name") ? body["Stars Name"] : "",
        "reward_center_dist_one_stars_to_token": body.hasOwnProperty("Stars To Token") ? body["Stars To Token"] : 0,
        "reward_center_dist_one_coins": body.hasOwnProperty("One Coins") ? body["One Coins"] : 0,
        "reward_center_dist_one_coins_name": body.hasOwnProperty("Coins Name") ? body["Coins Name"] : "",
        "reward_center_dist_one_coins_to_token": body.hasOwnProperty("Coins To Token") ? body["Coins To Token"] : 0,
        "reward_center_dist_one_keys": body.hasOwnProperty("One Keys") ? body["One Keys"] : "",
        "reward_center_dist_one_keys_name": body.hasOwnProperty("Keys Name") ? body["Keys Name"] : "",
        "reward_center_dist_one_keys_to_token": body.hasOwnProperty("Keys To Token") ? body["Keys To Token"] : 0,
        "reward_center_dist_one_booster": body.hasOwnProperty("One Booster") ? body["One Booster"] : 0,
        "reward_center_dist_one_booster_name": body.hasOwnProperty("Booster Name") ? body["Booster Name"] : "",
        "reward_center_dist_one_boster_to_token": body.hasOwnProperty("Boster To Token") ? body["Boster To Token"] : 0,
        "reward_center_dist_one_card1_id": body.hasOwnProperty("Card 1 Id") ? body["Card 1 Id"] : 0,
        "reward_center_dist_one_card2_id": body.hasOwnProperty("Card 2 Id") ? body["Card 2 Id"] : 0,
        "reward_center_dist_one_card3_id": body.hasOwnProperty("Card 3 Id") ? body["Card 3 Id"] : 0,
        "reward_center_dist_one_card4_id": body.hasOwnProperty("Card 4 Id") ? body["Card 4 Id"] : 0,
        "reward_center_dist_one_card5_id": body.hasOwnProperty("Card 5 Id") ? body["Card 5 Id"] : 0,
        "reward_center_dist_one_card6_id": body.hasOwnProperty("Card 6 Id") ? body["Card 6 Id"] : 0,
        "reward_center_dist_one_card7_id": body.hasOwnProperty("Card 7 Id") ? body["Card 7 Id"] : 0,
        "reward_center_dist_one_card1_name": body.hasOwnProperty("Card 1 Name") ? body["Card 1 Name"] : "",
        "reward_center_dist_one_card2_name": body.hasOwnProperty("Card 2 Name") ? body["Card 2 Name"] : "",
        "reward_center_dist_one_card3_name": body.hasOwnProperty("Card 3 Name") ? body["Card 3 Name"] : "",
        "reward_center_dist_one_card4_name": body.hasOwnProperty("Card 4 Name") ? body["Card 4 Name"] : "",
        "reward_center_dist_one_card5_name": body.hasOwnProperty("Card 5 Name") ? body["Card 5 Name"] : "",
        "reward_center_dist_one_card6_name": body.hasOwnProperty("Card 6 Name") ? body["Card 6 Name"] : "",
        "reward_center_dist_one_card7_name": body.hasOwnProperty("Card 7 Name") ? body["Card 7 Name"] : "",
        "reward_center_dist_one_card1_value": body.hasOwnProperty("Card 1 Value") ? body["Card 1 Value"] : "",
        "reward_center_dist_one_card2_value": body.hasOwnProperty("Card 2 Value") ? body["Card 2 Value"] : "",
        "reward_center_dist_one_card3_value": body.hasOwnProperty("Card 3 Value") ? body["Card 3 Value"] : "",
        "reward_center_dist_one_card4_value": body.hasOwnProperty("Card 4 Value") ? body["Card 4 Value"] : "",
        "reward_center_dist_one_card5_value": body.hasOwnProperty("Card 5 Value") ? body["Card 5 Value"] : "",
        "reward_center_dist_one_card6_value": body.hasOwnProperty("Card 6 Value") ? body["Card 6 Value"] : "",
        "reward_center_dist_one_card7_value": body.hasOwnProperty("Card 7 Value") ? body["Card 7 Value"] : "",
        "reward_center_dist_puzzle1_id": body.hasOwnProperty("Puzzle 1 Id") ? body["Puzzle 1 Id"] : 0,
        "reward_center_distr_one_puzzle1_name": body.hasOwnProperty("Puzzle 1 Name") ? body["Puzzle 1 Name"] : "",
        "reward_center_distr_one_puzzle1_value": body.hasOwnProperty("Puzzle 1 Value") ? body["Puzzle 1 Value"] : "",
        "reward_center_spin_reward_id": body.hasOwnProperty("Spin Reward Id") ? body["Spin Reward Id"] : 0,
    }
    RewardCenterDist.create(data).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.reward_center_dist_id,data.dataValues);
        res.status(201).send({			
            msg: "Reward Center Dist Created Successfully",
            RewardCenterDistId: data.reward_center_dist_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Reward Center Dist=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Reward Center Dist."
        });
    })
};

/**
 * Function to get all Reward Center Dist
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.rewardCenterDistListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'reward_center_dist_id'
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
    var total = await RewardCenterDist.count({
        where: options['where']
    });
    const RewardCenterDist_list = await RewardCenterDist.findAll(options);
    res.status(200).send({
        data: RewardCenterDist_list,
		totalRecords:total
    });
};
/**
 * Function to get single Reward Center Dist
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.rewardCenterDistDetails = async(req, res) => {
    const rewardCenterDistId = req.params.rewardCenterDistId;
    var options = {
        where: {
            reward_center_dist_id: rewardCenterDistId
        }
    };
    const data = await RewardCenterDist.findOne(options);
    if(!RewardCenterDist){
        res.status(500).send({
            message: "Reward Center Dist not found"
        });
        return
    }
    res.status(200).send({
        data: data
    });
};
/**
 * Function to update single Reward Center Dist
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateRewardCenterDist = async(req, res) => {
    const id = req.params.rewardCenterDistId;
    var RewardCenterDistDetails = await RewardCenterDist.findOne({
        where: {
            reward_center_dist_id: id
        }
    });
    RewardCenterDist.update(req.body, {
		returning:true,
        where: {
            reward_center_dist_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','RewardCenterDist',id,result.dataValues,RewardCenterDistDetails);
            res.status(200).send({
                message: "Reward Center Dist updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Reward Center Dist with id=${id}. Maybe Reward Center Dist was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Reward Center Dist with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Reward Center Dist with id=" + id
        });
    });
};

/**
 * Function to delete Reward Center Dist
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteRewardCenterDist = async (req, res) => {
    const RewardCenterDistDetails = await RewardCenterDist.findOne({
            where: {
                reward_center_dist_id: req.params.rewardCenterDistId
            }
        });
    if(!RewardCenterDistDetails){
        res.status(500).send({
            message: "Could not delete Reward Center Dist with id=" + req.params.rewardCenterDistId
          });
          return;
    }
    RewardCenterDist.destroy({
        where: { 
            reward_center_dist_id: req.params.rewardCenterDistId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Reward Center Dist deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Reward Center Dist with id=" + req.params.RewardCenterDistId
          });
          return;
        });
    }