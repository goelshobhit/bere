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
  if (bonus_item_list) {
    //var site_url = process.env.SITE_API_URL;
    //var site_new_url = site_url.replace("/api", '');
    for (const bonus_item_key in bonus_item_list) {
      if (bonus_item_list[bonus_item_key].bonus_item_icons) {
        var bonus_item_icons_arr = bonus_item_list[bonus_item_key].bonus_item_icons.split(",");
        var icon_images = [];
        if (bonus_item_icons_arr.length) {
          for (const bonus_item_arr_key in bonus_item_icons_arr) {
            icon_images.push(bonus_item_icons_arr[bonus_item_arr_key]);
            //icon_images.push(site_new_url+bonus_item_icons_arr[bonus_item_arr_key]);
          }
        }
        bonus_item_list[bonus_item_key].dataValues.bonus_item_icons = icon_images;
      }
      if (bonus_item_list[bonus_item_key].bonus_product_images) {
        var bonus_product_images_arr = bonus_item_list[bonus_item_key].bonus_product_images.split(",");
        var bonus_product_images = [];
        if (bonus_product_images_arr.length) {
          for (const bonus_item_arr_key in bonus_product_images_arr) {
            bonus_product_images.push(bonus_product_images_arr[bonus_item_arr_key]);
            //bonus_product_images.push(site_new_url+bonus_product_images_arr[bonus_item_arr_key]);
          }
        }
        bonus_item_list[bonus_item_key].dataValues.bonus_product_images = bonus_product_images;
      }
    }
  }
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
    "bonus_item_name": body.hasOwnProperty("Bonus Item Name") ? req.body["Bonus Item Name"] : "",
    "bonus_item_description": body.hasOwnProperty("Bonus Item Description") ? req.body["Bonus Item Description"] : "",
    "bonus_item_icons": body.hasOwnProperty("Bonus Item Icons") ? req.body["Bonus Item Icons"] : "",
    "bonus_product_images": body.hasOwnProperty("Bonus Product Images") ? req.body["Bonus Product Images"] : "",
    "bonus_item_dollar_value": body.hasOwnProperty("Bonus Item Dollar Value") ? req.body["Bonus Item Dollar Value"] : "0",
    "user_token_value_not_accepting": body.hasOwnProperty("User Token Value Not Accepting") ? req.body["User Token Value Not Accepting"] : "0",
    "bonus_item_qty": body.hasOwnProperty("Bonus Item Qty") ? req.body["Bonus Item Qty"] : 0,
    "bonus_item_remaining_qty": body.hasOwnProperty("Bonus Item Remaining Qty") ? req.body["Bonus Item Remaining Qty"] : 0,
    "bonus_item_timestamp": body.hasOwnProperty("Bonus Item Timestamp") ? req.body["Bonus Item Timestamp"] : '',
    "bonus_item_is_active": body.hasOwnProperty("Bonus Item Active") ? req.body["Bonus Item Active"] : 1,
    "bonus_item_giveaway_type": body.hasOwnProperty("Bonus Item Giveaway Type") ? req.body["Bonus Item Giveaway Type"] : 0,
    "brand_task": body.hasOwnProperty("Brand Task") ? req.body["Brand Task"] : 0,
    "number_of_tasks_available": body.hasOwnProperty("Number Of Task Available") ? req.body["Number Of Task Available"] : 0
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
  bonus_item.update(body, {
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