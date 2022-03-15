const db = require("../../models");
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const Op = db.Sequelize.Op;
const common = require("../../common");
const bonus_sm_share = db.bonus_sm_share;


/**
 * Function to add Bonus Share on social media
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.createBonusSocialMediaShare = async (req, res) => {
  const body = req.body;
  if (!body["Bonus SM Name"]) {
    res.status(400).send({
      msg:
        "Bonus SM Name is required"
    });
    return;
  }
  var uid = req.header(process.env.UKEY_HEADER || "x-api-key");
  const data = {
    "bonus_sm_name": body.hasOwnProperty("Bonus SM Name") ? req.body["Bonus SM Name"] : "0",
    "bonus_sm_share_user_id": uid,
    "bonus_sm_share_timestamp": body.hasOwnProperty("Bonus SM Share Timestamp") ? req.body["Bonus SM Share Timestamp"] : new Date().getTime(),
    "bonus_sm_share_ack": body.hasOwnProperty("Bonus SM Share Ack") ? req.body["Bonus SM Share Ack"] : "0",
    "bonus_sm_share_url": body.hasOwnProperty("Bonus Sm Share Url") ? req.body["Bonus Sm Share Url"] : "0"
  }
  bonus_sm_share.create(data)
    .then(data => {
      audit_log.saveAuditLog(uid, 'add', 'bonus_sm_share', data.bonus_sm_id, data.dataValues);
      res.status(201).send({
        msg: "Bonus Social Media share Added Successfully",
        BonusSMShareId: data.bonus_sm_id
      });
    })
    .catch(err => {
      logger.log("error", "Some error occurred while creating the Bonus Social Media share=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Bonus Social Media share."
      });
    });
}

/**
 * Function to update Bonus Share on social media
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateBonusSocialMediaShare = async (req, res) => {

  const body = req.body;
  const id = req.params.BonusSMShareId;
  var bonusSmShareDetails = await bonus_sm_share.findOne({
    where: {
      bonus_sm_id: id
    }
  });
  var uid = req.header(process.env.UKEY_HEADER || "x-api-key");
  bonus_sm_share.update(body, {
    returning: true,
    where: {
      bonus_sm_id: id
    }
  }).then(function ([num, [result]]) {
    if (num == 1) {
      audit_log.saveAuditLog(uid, 'update', 'bonus_item', id, result.dataValues, bonusSmShareDetails);
      res.status(200).send({
        message: "Bonus Social Media share updated successfully."
      });
    } else {
      res.status(400).send({
        message: `Cannot update Bonus Social Media share with id=${id}. Maybe Bonus Social Media share was not found or req.body is empty!`
      });
    }
  }).catch(err => {
    logger.log("error", err + ":Error updating Bonus Social Media share with id=" + id);
    console.log(err)
    res.status(500).send({
      message: "Error updating Bonus Social Media share with id=" + id
    });
  });
};

/**
 * Function to get all bonus set
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.smSharelisting = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy || 'bonus_sm_id'
  const sortOrder = req.query.sortOrder || 'DESC'
  const Uid = req.header(process.env.UKEY_HEADER || "x-api-key");

  const contentUserTaskIds = await common.getContentReportUser(['User'], Uid);

  let userIdsValues = [];
  if (contentUserTaskIds.length) {
    contentUserTaskIds.forEach(element => {
      userIdsValues.push(element.content_report_type_id);
    });
  }
  var options = {
    include: [
      {
        model: db.user_profile,
        attributes: ["u_id", ["u_display_name", "username"], ["u_prof_img_path", "user_imgpath"]],
        required: false,
        where: {
          is_autotakedown: 0, u_id: {
            [Op.not]: userIdsValues
          }
        }
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
  if (req.query.BonusSMShareId) {
    options['where'] = {
      bonus_sm_id: req.query.BonusSMShareId
    }
  }
  var total = await bonus_sm_share.count({
    where: options['where']
  });
  const bonus_sm_list = await bonus_sm_share.findAll(options);
  res.status(200).send({
    data: bonus_sm_list,
    totalRecords: total
  });
}

/**
 * Function to delete Bonus User
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteSmShareRecord = async (req, res) => {
  const BonusSmShareDetails = await bonus_sm_share.findOne({
    where: {
      bonus_sm_id: req.params.BonusSMShareId
    }
  });
  if (!BonusSmShareDetails) {
    res.status(500).send({
      message: "Could not delete Bonus Sm Share with id=" + req.params.BonusSMShareId
    });
    return;
  }
  bonus_sm_share.destroy({
    where: {
      bonus_sm_id: req.params.BonusSMShareId
    }
  })
    .then(num => {
      res.status(200).send({
        message: "Bonus Sm Share deleted successfully!"
      });
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Bonus Sm Share with id=" + req.params.BonusSMShareId
      });
      return;
    });
}