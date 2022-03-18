const db = require("../../models");
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const bonus_summary = db.bonus_summary;

/**
 * Function to create bonus summary
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createBonusItemSummary = async (req, res) => {
  const body = req.body;
  if (!body["Bonus Summary Set Items"]) {
    res.status(400).send({
      msg:
        "Bonus Summary Set Items is required"
    });
    return;
  }
  if (!body["Bonus Summary Name"]) {
    res.status(400).send({
      msg:
        "Bonus Summary Name is required"
    });
    return;
  }
  var uid = req.header(process.env.UKEY_HEADER || "x-api-key");
  const data = {
    "bonus_item_id": body.hasOwnProperty("Bonus Item id") ? body["Bonus Item id"] : "0",
    "bonus_summary_name": body.hasOwnProperty("Bonus Summary Name") ? body["Bonus Summary Name"] : "0",
    "bonus_summary_hashtag": body.hasOwnProperty("Bonus Summary_Hashtag") ? body["Bonus Summary_Hashtag"] : '',
    "bonus_summary_timestamp": (body.hasOwnProperty("Bonus Summary Timestamp") && body["Bonus Summary Timestamp"]) ? body["Bonus Summary Timestamp"] : new Date().getTime(),
    "bonus_summary_start_timestamp": (body.hasOwnProperty("Bonus Summary Start Timestamp") && body["Bonus Summary Start Timestamp"]) ? body["Bonus Summary Start Timestamp"] : new Date().getTime(),
    "bonus_summary_entryclose_time": (body.hasOwnProperty("Bonus Summary Entryclose Time") && body["Bonus Summary Entryclose Time"]) ? body["Bonus_Summary Entryclose Time"] : new Date().getTime(),
    "bonus_summary_end_date": (body.hasOwnProperty("Bonus Summary End Date") && body["Bonus Summary End Date"]) ? body["Bonus Summary End Date"] : new Date().getTime(),
    "bonus_summary_set_id": body.hasOwnProperty("Bonus Summary Set Id") ? body["Bonus Summary Set Id"] : '0',
    "bonus_summary_set_items": body.hasOwnProperty("Bonus Summary Set Items") ? body["Bonus Summary Set Items"] : '',
    "bonus_summary_set_items_qty": body.hasOwnProperty("Bonus Summary Set Items Qty") ? body["Bonus Summary Set Items Qty"] : '',
    "bonus_summary_total_token": body.hasOwnProperty("Bonus Summary Total Token") ? body["Bonus Summary Total Token"] : '0',
    "bonus_summary_total_stars": body.hasOwnProperty("Bonus Summary Total Stars") ? body["Bonus Summary Total Stars"] : '0',
    "bonus_summary_stars_balance": body.hasOwnProperty("Bonus Summary Stars Balance") ? body["Bonus Summary Stars Balance"] : '0',
    "bonus_summary_set_token_balance": body.hasOwnProperty("Bonus Summary Set Token Balance") ? body["Bonus Summary Set Token Balance"] : '0'
  }
  bonus_summary.create(data)
    .then(data => {
      audit_log.saveAuditLog(uid, 'add', 'bonus_summary', data.bonus_summary_id, data.dataValues);
      res.status(201).send({
        msg: "Bonus Summary Added Successfully",
        BonusSummaryId: data.bonus_summary_id
      });
    })
    .catch(err => {
      logger.log("error", "Some error occurred while creating the Bonus Summary=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Bonus Summary."
      });
    });
}

/**
 * Function to update Bonus Item Summary
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateBonusItemSummary = async (req, res) => {

  const body = req.body;
  const id = req.params.BonusSummaryId;
  var bonusSummaryDetails = await bonus_summary.findOne({
    where: {
      bonus_summary_id: id
    }
  });
  const bonusSummaryData = {
    "bonus_item_id": body.hasOwnProperty("Bonus Item id") ? body["Bonus Item id"] : "0",
    "bonus_summary_name": body.hasOwnProperty("Bonus Summary Name") ? body["Bonus Summary Name"] : "0",
    "bonus_summary_hashtag": body.hasOwnProperty("Bonus Summary_Hashtag") ? body["Bonus Summary_Hashtag"] : '',
    "bonus_summary_timestamp": (body.hasOwnProperty("Bonus Summary Timestamp") && body["Bonus Summary Timestamp"]) ? body["Bonus Summary Timestamp"] : new Date().getTime(),
    "bonus_summary_start_timestamp": (body.hasOwnProperty("Bonus Summary Start Timestamp") && body["Bonus Summary Start Timestamp"]) ? body["Bonus Summary Start Timestamp"] : new Date().getTime(),
    "bonus_summary_entryclose_time": (body.hasOwnProperty("Bonus Summary Entryclose Time") && body["Bonus Summary Entryclose Time"]) ? body["Bonus_Summary Entryclose Time"] : new Date().getTime(),
    "bonus_summary_end_date": (body.hasOwnProperty("Bonus Summary End Date") && body["Bonus Summary End Date"]) ? body["Bonus Summary End Date"] : new Date().getTime(),
    "bonus_summary_set_id": body.hasOwnProperty("Bonus Summary Set Id") ? body["Bonus Summary Set Id"] : '0',
    "bonus_summary_set_items": body.hasOwnProperty("Bonus Summary Set Items") ? body["Bonus Summary Set Items"] : '',
    "bonus_summary_set_items_qty": body.hasOwnProperty("Bonus Summary Set Items Qty") ? body["Bonus Summary Set Items Qty"] : '',
    "bonus_summary_total_token": body.hasOwnProperty("Bonus Summary Total Token") ? body["Bonus Summary Total Token"] : '0',
    "bonus_summary_total_stars": body.hasOwnProperty("Bonus Summary Total Stars") ? body["Bonus Summary Total Stars"] : '0',
    "bonus_summary_stars_balance": body.hasOwnProperty("Bonus Summary Stars Balance") ? body["Bonus Summary Stars Balance"] : '0',
    "bonus_summary_set_token_balance": body.hasOwnProperty("Bonus Summary Set Token Balance") ? body["Bonus Summary Set Token Balance"] : '0'
  }
  bonus_summary.update(body, {
    returning: true,
    where: {
      bonus_summary_id: id
    }
  }).then(function ([num, [result]]) {
    if (num == 1) {
      audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'update', 'bonus_summary', id, result.dataValues, bonusSummaryDetails);
      res.status(200).send({
        message: "Bonus Summary updated successfully."
      });
    } else {
      res.status(400).send({
        message: `Cannot update Bonus Summary with id=${id}. Maybe Bonus Summary was not found or req.body is empty!`
      });
    }
  }).catch(err => {
    logger.log("error", err + ":Error updating Bonus Summary with id=" + id);
    console.log(err)
    res.status(500).send({
      message: "Error updating Bonus Summary with id=" + id
    });
  });
};


/**
 * Function to get bonus summaries
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.bonusSummarylisting = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy || 'bonus_summary_id'
  const sortOrder = req.query.sortOrder || 'DESC'

  var options = {
    include: [{
      model: db.bonus_item,
      attributes: ["bonus_item_name"],
    },
    {
      model: db.bonus_set,
      attributes: ["bonus_set_item_name"],
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
  if (req.query.BonusSummaryId) {
    options['where'] = {
      bonus_summary_id: req.query.BonusSummaryId
    }
  }
  var total = await bonus_summary.count({
    where: options['where']
  });
  const bonus_summary_list = await bonus_summary.findAll(options);
  res.status(200).send({
    data: bonus_summary_list,
    totalRecords: total
  });
}

/**
 * Function to delete Bonus Summary
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteBonusItemSummary = async (req, res) => {
  const BonusSummaryDetails = await bonus_summary.findOne({
    where: {
      bonus_summary_id: req.params.BonusSummaryId
    }
  });
  if (!BonusSummaryDetails) {
    res.status(500).send({
      message: "Could not delete Bonus Summary with id=" + req.params.BonusSummaryId
    });
    return;
  }
  bonus_summary.destroy({
    where: {
      bonus_summary_id: req.params.BonusSummaryId
    }
  })
    .then(num => {
      res.status(200).send({
        message: "Bonus Summary deleted successfully!"
      });
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Summary with id=" + req.params.BonusSummaryId
      });
      return;
    });
}