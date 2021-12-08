const db = require("../../models");
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const bonus_set = db.bonus_set;



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
  if (req.query.BonusSetId) {
    options['where'] = {
      bonus_set_id: req.query.BonusSetId
    }
  }
  var total = await bonus_set.count({
    where: options['where']
  });
  const bonus_set_list = await bonus_set.findAll(options);
  res.status(200).send({
    data: bonus_set_list,
    totalRecords: total
  });
}

/**
 * Function to create bonus item set
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
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
        BonusSetId: data.bonus_set_id
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

/**
 * Function to update Bonus Set
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateBonusSet = async (req, res) => {

  const body = req.body;
  const id = req.params.BonusSetId;
  var bonusSetDetails = await bonus_set.findOne({
    where: {
      bonus_set_id: id
    }
  });
  const bonusSetData = {
    "bonus_set_brand_id": body.hasOwnProperty("Bonus Set Brand Id") ? body["Bonus Set Brand Id"] : "0",
    "bonus_item_id": body.hasOwnProperty("Bonus Item id") ? body["Bonus Item id"] : "0",
    "bonus_set_item_name": body.hasOwnProperty("Bonus Set Item Name") ? body["Bonus Set Item Name"] : "0",
    "bonus_set_item_qty": body.hasOwnProperty("Bonus Set Item Qty") ? body["Bonus Set Item Qty"] : new Date().getTime(),
    "bonus_set_item_timestamp": (body.hasOwnProperty("Bonus Set Item Timestamp") && body["Bonus Set Item Timestamp"]) ? body["Bonus Set Item Timestamp"] : new Date().getTime()
  }
  bonus_set.update(bonusSetData, {
    returning: true,
    where: {
      bonus_set_id: id
    }
  }).then(function ([num, [result]]) {
    if (num == 1) {
      audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'update', 'bonus_set', id, result.dataValues, bonusSetDetails);
      res.status(200).send({
        message: "Bonus Set updated successfully."
      });
    } else {
      res.status(400).send({
        message: `Cannot update Bonus Set with id=${id}. Maybe Bonus Set was not found or req.body is empty!`
      });
    }
  }).catch(err => {
    logger.log("error", err + ":Error updating Bonus Set with id=" + id);
    console.log(err)
    res.status(500).send({
      message: "Error updating Bonus Set with id=" + id
    });
  });
};

/**
 * Function to delete Bonus Item Set
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteBonusSet = async (req, res) => {
  const BonusItemDetails = await bonus_set.findOne({
    where: {
      bonus_set_id: req.params.BonusSetId
    }
  });
  if (!BonusItemDetails) {
    res.status(500).send({
      message: "Could not delete Bonus set with id=" + req.params.BonusSetId
    });
    return;
  }
  bonus_set.destroy({
    where: {
      bonus_set_id: req.params.BonusSetId
    }
  })
    .then(num => {
      res.status(200).send({
        message: "Bonus set deleted successfully!"
      });
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Bonus set with id=" + req.params.BonusSetId
      });
      return;
    });
}
