const db = require("../../models");
const audit_log = db.audit_log;
const logger = require("../../middleware/logger");
const bonus_user = db.bonus_usr;
const common = require("../../common");

/**
 * Function to add bonus user
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.createBonusUser = async (req, res) => {
  const body = req.body;
  if (!body["Bonus user Reddim Level"] || !body["Bonus user Followers riddim"] || !body["Bonus User History Not Won"]) {
    res.status(400).send({
      msg:
        "At Least one of them is required from Bonus user Reddim Level, Bonus user Followers riddim and Bonus User History Not Won."
    });
    return;
  }
  var uid = req.header(process.env.UKEY_HEADER || "x-api-key");
  const data = {
    "bonus_usr_id": body.hasOwnProperty("Bonus User Id") ? req.body["Bonus User Id"] : uid,
    "bonus_usr_riddim_level": body.hasOwnProperty("Bonus user Reddim Level") ? req.body["Bonus user Reddim Level"] : "0",
    "bonus_usr_followers_riddim": body.hasOwnProperty("Bonus user Followers riddim") ? req.body["Bonus user Followers riddim"] : "0",
    "bonus_usr_history_not_won": body.hasOwnProperty("Bonus User History Not Won") ? req.body["Bonus User History Not Won"] : "0"
  }
  bonus_user.create(data)
    .then(data => {
      audit_log.saveAuditLog(uid, 'add', 'bonus_usr', data.bu_id, data.dataValues);
      res.status(201).send({
        msg: "Bonus User Added Successfully",
        BonusUserId: data.bu_id
      });
    })
    .catch(err => {
      logger.log("error", "Some error occurred while creating the Bonus User=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Bonus User."
      });
    });
}

/**
 * Function to update Bonus User
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateBonusUser = async (req, res) => {

  const body = req.body;
  const id = req.params.BonusUserId;
  var bonususerDetails = await bonus_user.findOne({
    where: {
      bu_id: id
    }
  });
  bonus_user.update(body, {
    returning: true,
    where: {
      bu_id: id
    }
  }).then(function ([num, [result]]) {
    if (num == 1) {
      audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'update', 'bonus_set', id, result.dataValues, bonususerDetails);
      res.status(200).send({
        message: "Bonus User updated successfully."
      });
    } else {
      res.status(400).send({
        message: `Cannot update Bonus User with id=${id}. Maybe Bonus User was not found or req.body is empty!`
      });
    }
  }).catch(err => {
    logger.log("error", err + ":Error updating Bonus User with id=" + id);
    console.log(err)
    res.status(500).send({
      message: "Error updating Bonus User with id=" + id
    });
  });
};

/**
 * Function to get all bonus users
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusUserlisting = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy || 'bu_id'
  const sortOrder = req.query.sortOrder || 'DESC'

  var options = {
    include: [
      {
        model: db.user_profile,
        attributes: ["u_id", ["u_display_name", "username"], ["u_prof_img_path", "user_imgpath"]],
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
  if (req.query.sortVal) {
    var sortValue = req.query.sortVal;
    options.where = sortValue ? {
      [sortBy]: `${sortValue}`
    } : null;
  }
  if (req.query.BonusUserId) {
    options['where'] = {
      bu_id: req.query.BonusUserId
    }
  }
  var total = await bonus_user.count({
    where: options['where']
  });
  let bonus_user_list = await bonus_user.findAll(options);
  if (bonus_user_list.length) {
    for (const bonus_list_key in bonus_user_list) {
      bonus_user_list[bonus_list_key].dataValues.media_token = common.imageToken(bonus_user_list[bonus_list_key].user_profile.u_id);
    }
}
  res.status(200).send({
    data: bonus_user_list,
    totalRecords: total
  });
}

/**
 * Function to get single Bonus User
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusUserDetails = async(req, res) => {
  const bonusUserId = req.params.bonusUserId;
  var options = {
    include: [
      {
        model: db.user_profile,
        attributes: ["u_id", ["u_display_name", "username"], ["u_prof_img_path", "user_imgpath"]],
        required: false
      }
    ],
      where: {
          bonus_usr_id: bonusUserId
      }
  };
  const bonusUser = await bonus_user.findOne(options);
  if(!bonusUser){
      res.status(500).send({
          message: "Bonus User not found"
      });
      return
  }
  res.status(200).send({
      data: bonusUser,
      media_token: common.imageToken(bonusUser.user_profile.u_id)
  });
};

/**
 * Function to delete Bonus User
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteBonusUser = async (req, res) => {
  const BonusUserDetails = await bonus_user.findOne({
    where: {
      bu_id: req.params.bonusUserId
    }
  });
  if (!BonusUserDetails) {
    res.status(500).send({
      message: "Could not delete Bonus User with id=" + req.params.bonusUserId
    });
    return;
  }
  bonus_user.destroy({
    where: {
      bu_id: req.params.bonusUserId
    }
  })
    .then(num => {
      res.status(200).send({
        message: "Bonus User deleted successfully!"
      });
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Bonus User with id=" + req.params.bonusUserId
      });
      return;
    });
}