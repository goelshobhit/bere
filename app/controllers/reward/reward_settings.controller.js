const db = require("../../models");
const rewardSettings = db.reward_settings;
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const { isNull } = require("util");
const Op = db.Sequelize.Op;
/**
 * Function to add Reward Settings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.addRewardSettings = async (req, res) => {
    const body = req.body;
    const rewardSettingData = {
        "token_value_in_usd": body.hasOwnProperty("Token Usd Value") ? req.body["Token Usd Value"] : '',
        "star_value_in_tokens": body.hasOwnProperty("Star Token Value") ? req.body["Star Token Value"] : "",
        "key_value_in_tokens": body.hasOwnProperty("Key Token Value") ? req.body["Key Token Value"] : "",
        "booster_value_in_tokens": body.hasOwnProperty("Booster Token Value") ? req.body["Booster Token Value"] : ""
    }
    rewardSettings.create(rewardSettingData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'FAQ', data.reward_settings_id, data.dataValues);
            res.status(201).send({
                msg: "Reward Setting Added Successfully",
                rewardSettingsID: data.reward_settings_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while adding the Reward Setting=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while adding the Reward Setting."
            });
        });
}


/**
 * Function to get all Reward settings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.rewardSettingsListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'reward_settings_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    var options = {
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if (req.query.sortVal) {
        var sortValue = req.query.sortVal.trim();
        options.where = sortValue ? {
            [Op.or]: [{
                cr_co_name: {
                    [Op.iLike]: `%${sortValue}%`
                }
            }
            ]
        } : null;
    }
    if (req.query.rewardSettingsId) {
        options['where']['reward_settings_id'] = req.query.rewardSettingsId;
    }
    var total = await rewardSettings.count({
        where: options['where']
    });
    const rewardsettings_list = await rewardSettings.findAll(options);
    res.status(200).send({
        data: rewardsettings_list,
        totalRecords: total
    });
}


/**
 * Function to update Reward Settings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateRewardSettings = async(req, res) => {
    const id = req.params.rewardSettingsId;
    var rewardSettingsDetails = await rewardSettings.findOne({
        where: {
            reward_settings_id: id
        }
    });
    rewardSettings.update(req.body, {
		returning:true,
        where: {
            reward_settings_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','Reward Settings',id,result.dataValues,rewardSettingsDetails);
            res.status(200).send({
                message: "Reward Settings updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Reward Settings with id=${id}. Maybe Reward Settings was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Reward Settings with id=" + id);
        res.status(500).send({
            message: "Error updating Reward Settings with id=" + id
        });
    });
};

/**
 * Function to delete Reward Settings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteRewardSettings = async (req, res) => {
    const rewardSettingDetails = await rewardSettings.findOne({
            where: {
                reward_settings_id: req.params.rewardSettingsId
            }
        });
    if(!rewardSettingDetails){
        res.status(500).send({
            message: "Could not delete Reward Settings with id=" + req.params.rewardSettingsId
          });
          return;
    }
    rewardSettings.destroy({
        where: { 
            reward_settings_id: req.params.rewardSettingsId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Reward Settings deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Reward Settings with id=" + req.params.rewardSettingsId
          });
          return;
        });
    }


