const db = require("../../models");
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const bonus_set = db.bonus_set;
const bonus_item = db.bonus_item;
const common = require("../../common");


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
  const sortBy = req.query.sortBy || 'bonus_set_id'
  var sortOrder = req.query.sortOrder || 'DESC'
  sortOrder = sortOrder.trim();
  const errorMessage = common.validateSortParameters(sortOrder, sortBy);
  if (errorMessage) {
    res.status(400).send({
      msg:
        errorMessage
    });
    return;
  }
  var options = {
    include: [{
      model: db.brands,
      attributes: [["cr_co_id", 'brand_id'], ["cr_co_name", 'brand_name'], ["cr_co_logo_path", 'brand_logo']],
    }],
    limit: pageSize,
    offset: skipCount,
    order: [
      [[db.sequelize.literal(sortBy), sortOrder]]
    ],
    where: {}
  };
  if (req.query.sortVal) {
    var sortValue = req.query.sortVal;
    options.where = sortValue ? {
      [sortBy]: `${sortValue}`
    } : null;
  }
  if (req.query.bonusSetId) {
    options['where'] = {
      bonus_set_id: req.query.bonusSetId
    }
  }
  if (req.query.bonusSetDefault) {
    options['where']['bonus_set_default'] = req.query.bonusSetDefault;
  }
  if (req.query.brandId) {
    options['where']['bonus_set_brand_id'] = req.query.brandId;
  }
  var isError = 0;
  var total = await bonus_set.count({
    where: options['where']
  }).catch(errorMsg => {
    isError = 1;
    res.status(500).send({
      message: 'Something Went Wrong'
    });
  });
  if (isError == 0) {
    const bonus_set_list = await bonus_set.findAll(options).catch(errorMsg => {
      isError = 1;
      res.status(500).send({
        message: 'Something Went Wrong'
      });
    });
    if (bonus_set_list && isError == 0) {
      var site_url = process.env.SITE_API_URL;
      //var site_new_url = site_url.replace("/api", '');
      var bonus_item_all_ids = [];
      for (const bonus_set_key in bonus_set_list) {
        if (bonus_set_list[bonus_set_key].bonus_item_id.length) {
          var bonus_item_ids = bonus_set_list[bonus_set_key].bonus_item_id;
          for (const bonus_item_id_key in bonus_item_ids) {
            bonus_item_all_ids.push(bonus_item_ids[bonus_item_id_key]);
          }
        }

        if (bonus_set_list[bonus_set_key].bonus_set_icons) {
          var bonus_set_icons_arr = bonus_set_list[bonus_set_key].bonus_set_icons.split(",");
          var icon_images = [];
          if (bonus_set_icons_arr.length) {
            for (const bonus_item_arr_key in bonus_set_icons_arr) {
              icon_images.push(bonus_set_icons_arr[bonus_item_arr_key]);
              //icon_images.push(site_new_url+bonus_set_icons_arr[bonus_item_arr_key]);
            }
          }
          bonus_set_list[bonus_set_key].dataValues.bonus_set_icons = icon_images;
        }
        if (bonus_set_list[bonus_set_key].bonus_set_images) {
          var bonus_set_images_arr = bonus_set_list[bonus_set_key].bonus_set_images.split(",");
          var bonus_set_images = [];
          if (bonus_set_images_arr.length) {
            for (const bonus_item_arr_key in bonus_set_images_arr) {
              bonus_set_images.push(bonus_set_images_arr[bonus_item_arr_key]);
              //bonus_set_images.push(site_new_url+bonus_set_images_arr[bonus_item_arr_key]);
            }
          }
          bonus_set_list[bonus_set_key].dataValues.bonus_set_images = bonus_set_images;
        }
        bonus_set_list[bonus_set_key].dataValues.average_dollar_value = 0;
        bonus_set_list[bonus_set_key].dataValues.total_bonus_value = 0;
        bonus_set_list[bonus_set_key].dataValues.winner_number = 0;
        bonus_set_list[bonus_set_key].dataValues.bonus_task_completed = 0;
        bonus_set_list[bonus_set_key].dataValues.total_participants = 0;
        bonus_set_list[bonus_set_key].dataValues.total_tickets = 0;
       
        bonus_set_list[bonus_set_key].dataValues.media_token = common.imageToken(bonus_set_list[bonus_set_key].bonus_set_id);
      }
    }
    if (isError == 0 && bonus_item_all_ids.length) {
      var bonus_options = {
        where: {
          bonus_item_id: bonus_item_all_ids
        }
      };
      var bonus_item_list_arr = {};
      const bonus_item_list = await bonus_item.findAll(bonus_options);
      if (bonus_item_list.length) {
        for (const bonus_item_list_key in bonus_item_list) {
          bonus_item_list_arr[bonus_item_list[bonus_item_list_key].bonus_item_id] = bonus_item_list[bonus_item_list_key];
        }
      }
      for (const bonus_set_key in bonus_set_list) {
        bonus_set_list[bonus_set_key].dataValues.bonus_items = [];
        if (bonus_set_list[bonus_set_key].bonus_item_id.length) {
          var bonus_item_ids = bonus_set_list[bonus_set_key].bonus_item_id;
          for (const bonus_item_id_key in bonus_item_ids) {
            var bonus_item_id = bonus_item_ids[bonus_item_id_key];
            if (bonus_item_list_arr[bonus_item_id] != undefined) {
              bonus_set_list[bonus_set_key].dataValues.bonus_items.push(bonus_item_list_arr[bonus_item_id]);
            }
          }
        }
        bonus_set_list[bonus_set_key].dataValues.total_bonus_items = bonus_set_list[bonus_set_key].bonus_item_id.length;
      }

    }
    if (isError == 0) {
      res.status(200).send({
        data: bonus_set_list,
        totalRecords: total
      });
    }
  }


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
  if (!body["Bonus Item ids"]) {
    res.status(400).send({
      msg:
        "Bonus Item ids is required"
    });
    return;
  }
  var bonus_item_ids = body["Bonus Item ids"];
  if (!bonus_item_ids.length) {
    res.status(400).send({
      msg:
        "Bonus Item ids must be array"
    });
    return;
  }
  for (const bonus_item_id_key in bonus_item_ids) {
    if (isNaN(bonus_item_ids[bonus_item_id_key])) {
      res.status(400).send({
        msg:
          "Bonus Item ids must be array of integer values"
      });
      return;
    }
  }
  var uid = req.header(process.env.UKEY_HEADER || "x-api-key");
  const data = {
    "bonus_set_brand_id": body.hasOwnProperty("Bonus Set Brand Id") ? body["Bonus Set Brand Id"] : "0",
    "bonus_item_id": body.hasOwnProperty("Bonus Item ids") ? body["Bonus Item ids"] : "",
    "bonus_set_item_name": body.hasOwnProperty("Bonus Set Item Name") ? body["Bonus Set Item Name"] : "0",
    "bonus_set_item_qty": body.hasOwnProperty("Bonus Set Item Qty") ? body["Bonus Set Item Qty"] : 0,
    "bonus_set_icons": body.hasOwnProperty("Bonus Set Icons") ? req.body["Bonus Set Icons"] : "",
    "bonus_set_images": body.hasOwnProperty("Bonus Set Images") ? req.body["Bonus Set Images"] : "",
    "bonus_set_start_date": body.hasOwnProperty("Bonus Set Start Date") ? req.body["Bonus Set Start Date"] : "",
    "bonus_set_default": body.hasOwnProperty("Bonus Set Default") ? req.body["Bonus Set Default"] : "0",
    "bonus_set_item_timestamp": (body.hasOwnProperty("Bonus Set Item Timestamp") && body["Bonus Set Item Timestamp"]) ? body["Bonus Set Item Timestamp"] : '',
    "bonus_set_status": body.hasOwnProperty("Bonus Set Status") ? body["Bonus Set Status"] : 0,
    "bonus_set_duration": body.hasOwnProperty("Bonus Set Duration") ? body["Bonus Set Duration"] : 30,
    "bonus_tickets_rules_ids": body.hasOwnProperty("Bonus Rule Ids") ? body["Bonus Rule Ids"] : []
  }
  bonus_set.create(data)
    .then(data => {
      audit_log.saveAuditLog(uid, 'add', 'bonus_set', data.bonus_set_id, data.dataValues);
      res.status(201).send({
        msg: "Bonus Set Added Successfully",
        bonusSetId: data.bonus_set_id
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
  const id = req.params.bonusSetId;
  var bonusSetDetails = await bonus_set.findOne({
    where: {
      bonus_set_id: id
    }
  });
  if (body["bonus_item_id"] != undefined && !body["bonus_item_id"].length) {
    res.status(400).send({
      msg:
        "bonus_item_id must be array"
    });
    return;
  }
  bonus_set.update(req.body, {
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
      bonus_set_id: req.params.bonusSetId
    }
  });
  if (!BonusItemDetails) {
    res.status(500).send({
      message: "Could not delete Bonus set with id=" + req.params.bonusSetId
    });
    return;
  }
  bonus_set.destroy({
    where: {
      bonus_set_id: req.params.bonusSetId
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
        message: "Could not delete Bonus set with id=" + req.params.bonusSetId
      });
      return;
    });
}
