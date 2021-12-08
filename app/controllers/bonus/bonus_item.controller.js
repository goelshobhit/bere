const db = require("../../models");
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const bonus_item = db.bonus_item;

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
  if (req.query.bonusItemId) {
    options['where'] = {
      bonus_item_id: req.query.bonusItemId
    }
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

/**
 * Function to update Bonus Item
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateBonusItem = async (req, res) => {

  const body = req.body;
  const id = req.params.bonusItemId;
  var bonusItemDetails = await bonus_item.findOne({
    where: {
      bonus_item_id: id
    }
  });
  const bonusItemData = {
    "bonus_item_brand_id": body.hasOwnProperty("Bonus Item Brand Id") ? req.body["Bonus Item Brand Id"] : "0",
    "bonus_item_name": body.hasOwnProperty("Bonus Item Name") ? req.body["Bonus Item Name"] : "0",
    "bonus_item_qty": body.hasOwnProperty("Bonus Item Qty") ? req.body["Bonus Item Qty"] : new Date().getTime(),
    "bonus_item_remaining_qty": body.hasOwnProperty("Bonus Item Remaining Qty") ? req.body["Bonus Item Remaining Qty"] : "0",
    "bonus_item_timestamp": body.hasOwnProperty("Bonus Item Timestamp") ? req.body["Bonus Item Timestamp"] : new Date().getTime()
  }
  bonus_item.update(bonusItemData, {
    returning: true,
    where: {
      bonus_item_id: id
    }
  }).then(function ([num, [result]]) {
    if (num == 1) {
      audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'update', 'bonus_item', id, result.dataValues, bonusItemDetails);
      res.status(200).send({
        message: "Bonus Item updated successfully."
      });
    } else {
      res.status(400).send({
        message: `Cannot update Bonus Item with id=${id}. Maybe Bonus Item was not found or req.body is empty!`
      });
    }
  }).catch(err => {
    logger.log("error", err + ":Error updating Bonus Item with id=" + id);
    console.log(err)
    res.status(500).send({
      message: "Error updating Bonus Item with id=" + id
    });
  });
};

/**
 * Function to delete Bonus Item
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteBonusItem = async (req, res) => {
  const BonusItemDetails = await bonus_item.findOne({
    where: {
      bonus_item_id: req.params.bonusItemId
    }
  });
  if (!BonusItemDetails) {
    res.status(500).send({
      message: "Could not delete Bonus Item with id=" + req.params.bonusItemId
    });
    return;
  }
  bonus_item.destroy({
    where: {
      bonus_item_id: req.params.bonusItemId
    }
  })
    .then(num => {
      res.status(200).send({
        message: "Bonus Item deleted successfully!"
      });
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Item with id=" + req.params.bonusItemId
      });
      return;
    });
}