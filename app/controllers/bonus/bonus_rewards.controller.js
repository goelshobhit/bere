const db = require("../../models");
const BonusRewards = db.bonus_rewards;
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new Bonus Rewards
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createBonusRewards = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const bonusRewards = {
        "bonus_summary_id": body.hasOwnProperty("Bonus Summary") ? body["Bonus Summary"] : 0,
        "bonus_rewards_bonus_setid": body.hasOwnProperty("Bonus Set Id") ? body["Bonus Set Id"] : 0,
        "bonus_rewards_usrid": body.hasOwnProperty("User Id") ? body["User Id"] : 0,
        "bonus_rewards_item_id": body.hasOwnProperty("Item Id") ? body["Item Id"] : 0,
        "bonus_rewards_item_name": body.hasOwnProperty("Item Name") ? body["Item Name"] : "",
        "bonus_rewards_item_qty": body.hasOwnProperty("Item Qty") ? body["Item Qty"] : 0,
        "bonus_rewards_item_delivery_date": body.hasOwnProperty("Delivery Date") ? body["Delivery Date"] : "",
        "bonus_rewards_item_confirmation_date": body.hasOwnProperty("Confirmation Date") ? body["Confirmation Date"] : "",
        "bonus_rewards_additional_task_id": body.hasOwnProperty("Additional Task Id") ? body["Additional Task Id"] : 0,
        }
       BonusRewards.create(bonusRewards).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.bonus_rewards_id,data.dataValues);
        res.status(201).send({			
            msg: "Bonus Rewards Created Successfully",
            bonusRewardsId: data.bonus_rewards_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Bonus Reward =" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Bonus Reward  Rules."
        });
    })
};

/**
 * Function to get all Bonus Rewards
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusRewardsListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'bonus_rewards_id'
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
    var total = await BonusRewards.count({
        where: options['where']
    });
    const bonusRewards_list = await BonusRewards.findAll(options);
    res.status(200).send({
        data: bonusRewards_list,
		totalRecords:total
    });
};
/**
 * Function to get single Bonus Rewards
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusRewardsDetails = async(req, res) => {
    const bonusRewardsId = req.params.bonusRewardsId;
    var options = {
        where: {
            bonus_rewards_id: bonusRewardsId
        }
    };
    const bonusRewards = await BonusRewards.findOne(options);
    if(!bonusRewards){
        res.status(500).send({
            message: "Bonus Rewards not found"
        });
        return
    }
    res.status(200).send({
        data: bonusRewards
    });
};
/**
 * Function to update single Bonus Rewards
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateBonusRewards = async(req, res) => {
    const id = req.params.bonusRewardsId;
    const body = req.body;
    var BonusRewardsDetails = await BonusRewards.findOne({
        where: {
            bonus_rewards_id: id
        }
    });
    const bonusRewards = {
        "bonus_summary_id": body.hasOwnProperty("Bonus Summary") ? body["Bonus Summary"] : 0,
        "bonus_rewards_bonus_setid": body.hasOwnProperty("Bonus Set Id") ? body["Bonus Set Id"] : 0,
        "bonus_rewards_usrid": body.hasOwnProperty("User Id") ? body["User Id"] : 0,
        "bonus_rewards_item_id": body.hasOwnProperty("Item Id") ? body["Item Id"] : 0,
        "bonus_rewards_item_name": body.hasOwnProperty("Item Name") ? body["Item Name"] : "",
        "bonus_rewards_item_qty": body.hasOwnProperty("Item Qty") ? body["Item Qty"] : 0,
        "bonus_rewards_item_delivery_date": body.hasOwnProperty("Delivery Date") ? body["Delivery Date"] : "",
        "bonus_rewards_item_confirmation_date": body.hasOwnProperty("Confirmation Date") ? body["Confirmation Date"] : "",
        "bonus_rewards_additional_task_id": body.hasOwnProperty("Additional Task Id") ? body["Additional Task Id"] : 0,
        }
    BonusRewards.update(bonusRewards, {
		returning:true,
        where: {
            bonus_rewards_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','BonusRewardsDetails',id,result.dataValues,BonusRewardsDetails);
            res.status(200).send({
                message: "Bonus Rewards Details updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Bonus Rewards Details with id=${id}. Maybe Bonus Reward was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Bonus Rewards Details with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Bonus Rewards Details with id=" + id
        });
    });
};

/**
 * Function to delete Bonus Rewards
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteBonusRewards = async (req, res) => {
    const BonusRewardsDetails = await BonusRewards.findOne({
            where: {
                bonus_rewards_id: req.params.bonusRewardsId
            }
        });
    if(!BonusRewardsDetails){
        res.status(500).send({
            message: "Could not delete Bonus Rewards with id=" + req.params.bonusRewardsId
          });
          return;
    }
    BonusRewards.destroy({
        where: { 
            bonus_rewards_id: req.params.bonusRewardsId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Bonus Rewards deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Bonus Rewards with id=" + req.params.bonusRewardsId
          });
          return;
        });
    }