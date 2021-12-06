const db = require("../models");
const Brand = db.brands
const brands_budget = db.brands_budget
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const Op = db.Sequelize.Op;
const common = require("../common");
const { bonus_usr } = require("../models");
const bonus_user = db.bonus_usr;
const bonus_sm_share = db.bonus_sm_share;
const bonus_item = db.bonus_item;
const bonus_set = db.bonus_set;
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
    "bonus_usr_id": uid,
    "bonus_usr_riddim_level": body.hasOwnProperty("Bonus user Reddim Level") ? req.body["Bonus user Reddim Level"] : "0",
    "bonus_usr_followers_riddim": body.hasOwnProperty("Bonus user Followers riddim") ? req.body["Bonus user Followers riddim"] : "0",
    "bonus_usr_history_not_won": body.hasOwnProperty("Bonus User History Not Won") ? req.body["Bonus User History Not Won"] : "0"
  }
  bonus_user.create(data)
    .then(data => {
      audit_log.saveAuditLog(uid, 'add', 'bonus_usr', data.bu_id, data.dataValues);
      res.status(201).send({
        msg: "Bonus User Added Successfully",
        BonusUserid: data.bu_id
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
  var total = await bonus_usr.count({
    where: options['where']
  });
  const bonus_user_list = await bonus_usr.findAll(options);
  res.status(200).send({
    data: bonus_user_list,
    totalRecords: total
  });
}

/**
 * Function to get all bonus Items
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusItemlisting = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy || 'bonus_item_id'
  const sortOrder = req.query.sortOrder || 'DESC'

  var options = {
    include: [{
      model: db.brands,
      attributes: [["cr_co_id", 'brand_id'], ["cr_co_name", 'brand_name'], ["cr_co_logo_path", 'brand_logo']],
    }],
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
  var total = await bonus_item.count({
    where: options['where']
  });
  const bonus_item_list = await bonus_item.findAll(options);
  res.status(200).send({
    data: bonus_item_list,
    totalRecords: total
  });
}

/**
 * Function to get all bonus set
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusSetlisting = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy || 'bonus_item_id'
  const sortOrder = req.query.sortOrder || 'DESC'

  var options = {
    include: [{
      model: db.brands,
      attributes: [["cr_co_id", 'brand_id'], ["cr_co_name", 'brand_name'], ["cr_co_logo_path", 'brand_logo']],
    }],
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
  var total = await bonus_item.count({
    where: options['where']
  });
  const bonus_set_list = await bonus_set.findAll(options);
  res.status(200).send({
    data: bonus_set_list,
    totalRecords: total
  });
}

/**
 * Function to add bonus social media user
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
        BonusSMShareid: data.bonus_sm_id
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
 * Function to add bonus social media user
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.createBonusItem = async (req, res) => {
  const body = req.body;
  if (!body["Bonus Item Brand Id"]) {
    res.status(400).send({
      msg:
        "Bonus Item Brand Id is required"
    });
    return;
  }
  var uid = req.header(process.env.UKEY_HEADER || "x-api-key");
  const data = {
    "bonus_item_brand_id": body.hasOwnProperty("Bonus Item Brand Id") ? req.body["Bonus Item Brand Id"] : "0",
    "bonus_item_name": body.hasOwnProperty("Bonus Item Name") ? req.body["Bonus Item Name"] : "0",
    "bonus_item_qty": body.hasOwnProperty("Bonus Item Qty") ? req.body["Bonus Item Qty"] : new Date().getTime(),
    "bonus_item_remaining_qty": body.hasOwnProperty("Bonus Item Remaining Qty") ? req.body["Bonus Item Remaining Qty"] : "0",
    "bonus_item_timestamp": body.hasOwnProperty("Bonus Item Timestamp") ? req.body["Bonus Item Timestamp"] : new Date().getTime()
  }
  bonus_item.create(data)
    .then(data => {
      audit_log.saveAuditLog(uid, 'add', 'bonus_item', data.bonus_item_id, data.dataValues);
      res.status(201).send({
        msg: "Bonus Item Added Successfully",
        bonusItemId: data.bonus_item_id
      });
    })
    .catch(err => {
      logger.log("error", "Some error occurred while creating the Bonus Item Id=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Bonus Item Id."
      });
    });
}

exports.createBonusItemSet = async (req, res) => {
  const body = req.body;
  if (!body["Bonus Set Brand Id"]) {
    res.status(400).send({
      msg:
        "Bonus Set Brand Id is required"
    });
    return;
  }
  var uid = req.header(process.env.UKEY_HEADER || "x-api-key");
  const data = {
    "bonus_set_brand_id": body.hasOwnProperty("Bonus Set Brand Id") ? body["Bonus Set Brand Id"] : "0",
    "bonus_item_id": body.hasOwnProperty("Bonus Item id") ? body["Bonus Item id"] : "0",
    "bonus_set_item_name": body.hasOwnProperty("Bonus Set Item Name") ? body["Bonus Set Item Name"] : "0",
    "bonus_set_item_qty": body.hasOwnProperty("Bonus Set Item Qty") ? body["Bonus Set Item Qty"] : new Date().getTime(),
    "bonus_set_item_timestamp": (body.hasOwnProperty("Bonus Set Item Timestamp") && body["Bonus Set Item Timestamp"]) ? body["Bonus Set Item Timestamp"] : new Date().getTime()
  }
  bonus_set.create(data)
    .then(data => {
      audit_log.saveAuditLog(uid, 'add', 'bonus_set', data.bonus_set_id, data.dataValues);
      res.status(201).send({
        msg: "Bonus Set Added Successfully",
        BonusSetid: data.bonus_set_id
      });
    })
    .catch(err => {
      logger.log("error", "Some error occurred while creating the Bonus Item Id=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Bonus Item Id."
      });
    });
}