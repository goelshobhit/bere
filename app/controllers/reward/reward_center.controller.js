const db = require("../../models");
const RewardCenter = db.reward_center;
const RewardCenterDistributor = db.reward_center_dist;
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
        "reward_center_image": body.hasOwnProperty("Center Image") ? body["Center Image"] : '',
        "reward_center_owner_id": body.hasOwnProperty("Owner Id") ? body["Owner Id"] : "",
        "reward_center_location_id": body.hasOwnProperty("Location Id") ? body["Location Id"] : 0,
        "reward_center_reward_type": body.hasOwnProperty("Reward Type") ? body["Reward Type"] : 0,
        "reward_center_reward_trigger_id": body.hasOwnProperty("Trigger Id") ? body["Trigger Id"] : 0,
    }
    RewardCenter.create(data).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','reward_center',data.reward_center_id,data.dataValues);
            var rewardCenterDistData = body.hasOwnProperty("Reward Center Dists") ? body["Reward Center Dists"] : '';
            if (rewardCenterDistData.length) {
                for (const rewardCenterDist in rewardCenterDistData) {
                    var rewardCenterDistDetail = rewardCenterDistData[rewardCenterDist];
                    RewardCenterDistributor.create({
                        "reward_center_id": data.reward_center_id,
                        "reward_center_dist_status": rewardCenterDistDetail.hasOwnProperty("Dist Status") ? rewardCenterDistDetail["Dist Status"] : 0,
                        "reward_center_name": data.reward_center_name,
                        "reward_center_dist_one_freq": rewardCenterDistDetail.hasOwnProperty("One Freq") ? rewardCenterDistDetail["One Freq"] : 0,
                        "reward_center_dist_one_total_token": rewardCenterDistDetail.hasOwnProperty("One Total Token") ? rewardCenterDistDetail["One Total Token"] : 0,
                        "reward_center_dist_one_segment_id": rewardCenterDistDetail.hasOwnProperty("Segment Id") ? rewardCenterDistDetail["Segment Id"] : "",
                        "reward_center_dist_one_name": rewardCenterDistDetail.hasOwnProperty("One Name") ? rewardCenterDistDetail["One Name"] : "",
                        "reward_center_dist_one_stars": rewardCenterDistDetail.hasOwnProperty("One Stars") ? rewardCenterDistDetail["One Stars"] : 0,
                        "reward_center_dist_one_stars_name": rewardCenterDistDetail.hasOwnProperty("Stars Name") ? rewardCenterDistDetail["Stars Name"] : "",
                        "reward_center_dist_one_stars_to_token": rewardCenterDistDetail.hasOwnProperty("Stars To Token") ? rewardCenterDistDetail["Stars To Token"] : 0,
                        "reward_center_dist_one_coins": rewardCenterDistDetail.hasOwnProperty("One Coins") ? rewardCenterDistDetail["One Coins"] : 0,
                        "reward_center_dist_one_coins_name": rewardCenterDistDetail.hasOwnProperty("Coins Name") ? rewardCenterDistDetail["Coins Name"] : "",
                        "reward_center_dist_one_coins_to_token": rewardCenterDistDetail.hasOwnProperty("Coins To Token") ? rewardCenterDistDetail["Coins To Token"] : 0,
                        "reward_center_dist_one_keys": rewardCenterDistDetail.hasOwnProperty("One Keys") ? rewardCenterDistDetail["One Keys"] : "",
                        "reward_center_dist_one_keys_name": rewardCenterDistDetail.hasOwnProperty("Keys Name") ? rewardCenterDistDetail["Keys Name"] : "",
                        "reward_center_dist_one_keys_to_token": rewardCenterDistDetail.hasOwnProperty("Keys To Token") ? rewardCenterDistDetail["Keys To Token"] : 0,
                        "reward_center_dist_one_booster": rewardCenterDistDetail.hasOwnProperty("One Booster") ? rewardCenterDistDetail["One Booster"] : 0,
                        "reward_center_dist_one_booster_name": rewardCenterDistDetail.hasOwnProperty("Booster Name") ? rewardCenterDistDetail["Booster Name"] : "",
                        "reward_center_dist_one_boster_to_token": rewardCenterDistDetail.hasOwnProperty("Boster To Token") ? rewardCenterDistDetail["Boster To Token"] : 0,
                        "reward_center_dist_one_card1_id": rewardCenterDistDetail.hasOwnProperty("Card 1 Id") ? rewardCenterDistDetail["Card 1 Id"] : 0,
                        "reward_center_dist_one_card2_id": rewardCenterDistDetail.hasOwnProperty("Card 2 Id") ? rewardCenterDistDetail["Card 2 Id"] : 0,
                        "reward_center_dist_one_card3_id": rewardCenterDistDetail.hasOwnProperty("Card 3 Id") ? rewardCenterDistDetail["Card 3 Id"] : 0,
                        "reward_center_dist_one_card4_id": rewardCenterDistDetail.hasOwnProperty("Card 4 Id") ? rewardCenterDistDetail["Card 4 Id"] : 0,
                        "reward_center_dist_one_card5_id": rewardCenterDistDetail.hasOwnProperty("Card 5 Id") ? rewardCenterDistDetail["Card 5 Id"] : 0,
                        "reward_center_dist_one_card6_id": rewardCenterDistDetail.hasOwnProperty("Card 6 Id") ? rewardCenterDistDetail["Card 6 Id"] : 0,
                        "reward_center_dist_one_card7_id": rewardCenterDistDetail.hasOwnProperty("Card 7 Id") ? rewardCenterDistDetail["Card 7 Id"] : 0,
                        "reward_center_dist_one_card1_name": rewardCenterDistDetail.hasOwnProperty("Card 1 Name") ? rewardCenterDistDetail["Card 1 Name"] : "",
                        "reward_center_dist_one_card2_name": rewardCenterDistDetail.hasOwnProperty("Card 2 Name") ? rewardCenterDistDetail["Card 2 Name"] : "",
                        "reward_center_dist_one_card3_name": rewardCenterDistDetail.hasOwnProperty("Card 3 Name") ? rewardCenterDistDetail["Card 3 Name"] : "",
                        "reward_center_dist_one_card4_name": rewardCenterDistDetail.hasOwnProperty("Card 4 Name") ? rewardCenterDistDetail["Card 4 Name"] : "",
                        "reward_center_dist_one_card5_name": rewardCenterDistDetail.hasOwnProperty("Card 5 Name") ? rewardCenterDistDetail["Card 5 Name"] : "",
                        "reward_center_dist_one_card6_name": rewardCenterDistDetail.hasOwnProperty("Card 6 Name") ? rewardCenterDistDetail["Card 6 Name"] : "",
                        "reward_center_dist_one_card7_name": rewardCenterDistDetail.hasOwnProperty("Card 7 Name") ? rewardCenterDistDetail["Card 7 Name"] : "",
                        "reward_center_dist_one_card1_value": rewardCenterDistDetail.hasOwnProperty("Card 1 Value") ? rewardCenterDistDetail["Card 1 Value"] : "",
                        "reward_center_dist_one_card2_value": rewardCenterDistDetail.hasOwnProperty("Card 2 Value") ? rewardCenterDistDetail["Card 2 Value"] : "",
                        "reward_center_dist_one_card3_value": rewardCenterDistDetail.hasOwnProperty("Card 3 Value") ? rewardCenterDistDetail["Card 3 Value"] : "",
                        "reward_center_dist_one_card4_value": rewardCenterDistDetail.hasOwnProperty("Card 4 Value") ? rewardCenterDistDetail["Card 4 Value"] : "",
                        "reward_center_dist_one_card5_value": rewardCenterDistDetail.hasOwnProperty("Card 5 Value") ? rewardCenterDistDetail["Card 5 Value"] : "",
                        "reward_center_dist_one_card6_value": rewardCenterDistDetail.hasOwnProperty("Card 6 Value") ? rewardCenterDistDetail["Card 6 Value"] : "",
                        "reward_center_dist_one_card7_value": rewardCenterDistDetail.hasOwnProperty("Card 7 Value") ? rewardCenterDistDetail["Card 7 Value"] : "",
                        "reward_center_dist_puzzle1_id": rewardCenterDistDetail.hasOwnProperty("Puzzle 1 Id") ? rewardCenterDistDetail["Puzzle 1 Id"] : 0,
                        "reward_center_distr_one_puzzle1_name": rewardCenterDistDetail.hasOwnProperty("Puzzle 1 Name") ? rewardCenterDistDetail["Puzzle 1 Name"] : "",
                        "reward_center_distr_one_puzzle1_value": rewardCenterDistDetail.hasOwnProperty("Puzzle 1 Value") ? rewardCenterDistDetail["Puzzle 1 Value"] : "",
                        "reward_center_spin_reward_id": rewardCenterDistDetail.hasOwnProperty("Spin Reward Id") ? rewardCenterDistDetail["Spin Reward Id"] : 0
                    }).then(reward_dist_data => {
                        audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','reward_center_dist',reward_dist_data.reward_center_dist_id,reward_dist_data.dataValues);
                    })
                        .catch(err => {
                            logger.log("error", "Some error occurred while creating the Reward Center Dist=" + err);
                            /* return res.status(500).send({
                                message:
                                    err.message || "Some error occurred while creating the Reward Center Dist."
                            }); */
                        });
                }
            }
        return res.status(201).send({			
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
              model: RewardCenterDistributor,
              required: false
            },
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
                model: RewardCenterDistributor,
                required: false
            },
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
    var requested_body = JSON.parse(JSON.stringify(req.body));
    if (requested_body.hasOwnProperty('reward_center_dists')) {
        delete requested_body['reward_center_dists'];
    }
    RewardCenter.update(requested_body, {
		returning:true,
        where: {
            reward_center_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','reward_center',id,result.dataValues,RewardCenterDetails);
            var reward_center_dists = req.body.hasOwnProperty("reward_center_dists") ? req.body["reward_center_dists"] : '';
            if (reward_center_dists.length) {
                for (const reward_center_dists_key in reward_center_dists) {
                    var rewardCenterDistDetail = reward_center_dists[reward_center_dists_key];
                    if (rewardCenterDistDetail['reward_center_dist_id'] != undefined) {
                        
                        var reward_center_dist_id = rewardCenterDistDetail['reward_center_dist_id'];
                        RewardCenterDistributor.update(rewardCenterDistDetail, {
                            returning: true,
                            where: {
                                reward_center_dist_id: reward_center_dist_id
                            }
                        }).then(function ([reward_dis_num, [reward_center_result]]) {
                            if (reward_dis_num == 1) {
                                audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'reward_center_dist', reward_center_result.dataValues.reward_center_dist_id, reward_center_result.dataValues);
                            } else {
                                /* return res.status(400).send({
                                    message: `Cannot update Reward Center Distributor with id=${reward_center_dist_id}. Maybe Reward Center Distributor was not found or req.body is empty!`
                                }); */
                            }

                        }) .catch(err => {
                                logger.log("error", err + ":Error updating Reward Center Distributor with id=" + reward_center_dist_id);
                                console.log(err)
                                /* return res.status(500).send({
                                    message: "Error updating Reward Center Distributor with id=" + reward_center_dist_id
                                }); */
                            });
                    } else {
                        rewardCenterDistDetail['reward_center_id'] = id;
                        rewardCenterDistDetail['reward_center_name'] = RewardCenterDetails.reward_center_name;
                        RewardCenterDistributor.create(rewardCenterDistDetail).then(reward_center_data => {
                            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'reward_center_dist', reward_center_data.reward_center_dist_id, reward_center_data.dataValues);
                        })
                            .catch(err => {
                                logger.log("error", "Some error occurred while creating the Reward Center Distributor=" + err);
                                /* return res.status(500).send({
                                    message:
                                        err.message || "Some error occurred while creating the Reward Center Distributor."
                                }); */
                            });
                    }

                }
            }

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