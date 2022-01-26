const db = require("../models");
const UserInboxSettings = db.user_inbox_settings;
const Op = db.Sequelize.Op;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new UserInboxSettings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createUserInboxSettings = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const userInboxSettings = {
        "u_id": body.hasOwnProperty("User Id") ? body["User Id"] : null,
        "settings_data": body.hasOwnProperty("Settings Data") ? body["Settings Data"] : null
    }
    UserInboxSettings.create(userInboxSettings).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.user_inbox_settings_id,data.dataValues);
        res.status(201).send({			
            msg: "UserInboxSettings Created Successfully",
            userInboxSettingsId: data.user_inbox_settings_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the UserInboxSettings=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the UserInboxSettings."
        });
    })
};

/**
 * Function to get all UserInboxSettings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.UserInboxSettingsListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'user_inbox_settings_id'
	const sortOrder = req.query.sortOrder || 'DESC'
    
    var options = {
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if(req.query.sortVal){
        var sortValue=req.query.sortVal.trim();
		options.where = sortValue ? {
            [Op.or]: [{
                u_id: {
                        [Op.iLike]: `%${sortValue}%`
                    }
                }
            ]
        } : null;			
    }
    var total = await UserInboxSettings.count({
        where: options['where']
    });
    const UserInboxSettings_list = await UserInboxSettings.findAll(options);
    res.status(200).send({
        data: UserInboxSettings_list,
		totalRecords:total
    });
};
/**
 * Function to get single UserInboxSettings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.UserInboxSettingsDetails = async(req, res) => {
    const userInboxSettingsId = req.params.userInboxSettingsId;
    var options = {
        where: {
            user_inbox_settings_id: userInboxSettingsId
        }
    };
    const userInboxSettings = await UserInboxSettings.findOne(options);
    if(!userInboxSettings){
        res.status(500).send({
            message: "UserInboxSettings not found"
        });
        return
    }
    res.status(200).send({
        data: userInboxSettings
    });
};
/**
 * Function to update single UserInboxSettings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateUserInboxSettings = async(req, res) => {
    const id = req.params.userInboxSettingsId;
    var UserInboxSettingsDetails = await UserInboxSettings.findOne({
        where: {
            user_inbox_settings_id: id
        }
    });
    UserInboxSettings.update(req.body, {
		returning:true,
        where: {
            user_inbox_settings_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','UserInboxSettings',id,result.dataValues,UserInboxSettingsDetails);
            res.status(200).send({
                message: "UserInboxSettings updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update UserInboxSettings with id=${id}. Maybe UserInboxSettings was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating UserInboxSettings with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating UserInboxSettings with id=" + id
        });
    });
};

/**
 * Function to delete UserInboxSettings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteUserInboxSettings = async (req, res) => {
    const UserInboxSettingsDetails = await UserInboxSettings.findOne({
            where: {
                user_inbox_settings_id: req.params.userInboxSettingsId
            }
        });
    if(!UserInboxSettingsDetails){
        res.status(500).send({
            message: "Could not delete UserInboxSettings with id=" + req.params.userInboxSettingsId
          });
          return;
    }
    UserInboxSettings.destroy({
        where: { 
            user_inbox_settings_id: req.params.userInboxSettingsId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "UserInboxSettings deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete UserInboxSettings with id=" + req.params.userInboxSettingsId
          });
          return;
        });
    }