const db = require("../models");
const contentReport = db.content_report;
const contentReportCategory = db.content_report_category;
const contentReportUser = db.content_report_user;
const logger = require("../middleware/logger");
const Op = db.Sequelize.Op;
const common = require("../common");
const audit_log = db.audit_log
/**
 * Function to submit content report
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createContentReportCategory = async (req, res) => {
  const body = req.body;
  if (!body["Content Report Cat Name"]) {
    res.status(500).send({
      msg:
        "Content Report Cat Name is required"
    });
    return;
  }
  const categoryData = {
    "content_report_cat_autotakedown": body.hasOwnProperty("Content Report Cat Autotakedown") ? body["Content Report Cat Autotakedown"] : 0,
    "content_report_cat_name": body["Content Report Cat Name"],
    "content_report_cat_hide": body.hasOwnProperty("Content Report Cat Hide") ? body["Content Report Cat Hide"] : 0,
    "content_report_cat_usr_hide": body.hasOwnProperty("Content Report Cat Usr Hide") ? req.body["Content Report Cat Usr Hide"] : "0"
  }
  contentReportCategory.create(categoryData)
    .then(data => {
      audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'content_report_category', data.content_report_cat_id, data.dataValues);
      res.status(201).send({
        msg: "Content Report category Added Successfully",
        content_report_cat_id: data.content_report_cat_id
      });
    })
    .catch(err => {
      logger.log("error", "Some error occurred while creating the content report category=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the content report category."
      });
    });
}

/**
 * Function to submit content report
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.submitContentReport = async (req, res) => {
  const body = req.body;
  if (!body["Content Report Cat Id"]) {
    res.status(500).send({
      msg:
        "Content Report Cat Id is required"
    });
    return;
  }
  if (!body["Content Report Name"]) {
    res.status(500).send({
      msg:
        "Content Report Name is required"
    });
    return;
  }
  var userId = req.header(process.env.UKEY_HEADER || "x-api-key");
  var options = {
    where: {
      content_report_cat_id: body["Content Report Cat Id"]
    }
  };
  const contentReportCategorydetail = await contentReportCategory.findOne(options);
  if (!contentReportCategorydetail) {
    res.status(500).send({
      message: "Content Report Category not Found."
    });
    return;
  }

  const data = {
    "content_report_cat_id": body["Content Report Cat Id"],
    "content_report_name": body["Content Report Name"],
    "content_report_task_id": body["Content Report Type"],
    "content_report_type": body.hasOwnProperty("Content Report Type") ? req.body["Content Report Type"] : "",
    "content_report_type_id": body.hasOwnProperty("Content Report Type Id") ? req.body["Content Report Type Id"] : "",
    "content_report_owner_id": body.hasOwnProperty("Content Report Owner Id") ? req.body["Content Report Owner Id"] : "",
    "content_report_reporter_id": body.hasOwnProperty("Content Report Reporter Id") ? req.body["Content Report Reporter Id"] : userId,
    "content_report_timestamp": body.hasOwnProperty("Content Report Timestamp") ? req.body["Content Report Timestamp"] : new Date().getTime(),
    "content_report_reason": body.hasOwnProperty("Content Report Reason") ? req.body["Content Report Reason"] : ""
  }
  contentReport.create(data)
    .then(data => {
      audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'content_report', data.content_report_id, data.dataValues);
      if (contentReportCategorydetail.content_report_cat_autotakedown == 0 && contentReportCategorydetail.content_report_cat_usr_hide == 1) {
        const contentUserData = {
          "content_report_uid": body.hasOwnProperty("Content Report Reporter Id") ? req.body["Content Report Reporter Id"] : userId,
          "content_report_cat_id": body["Content Report Cat Id"],
          "content_report_id": data.content_report_id,
          "content_report_type": body.hasOwnProperty("Content Report Type") ? req.body["Content Report Type"] : "",
          "content_report_type_id": body.hasOwnProperty("Content Report Type Id") ? req.body["Content Report Type Id"] : "",
          "cru_status": "1"
        }
        contentReportUser.create(contentUserData)
          .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'content_report_user', data.content_report_user_id, data.dataValues);
          })
          .catch(err => {
            logger.log("error", "Some error occurred while inserting data in content report user=" + err);
          });
      }
      res.status(201).send({
        msg: "Content Report Submitted Successfully",
        content_report_id: data.content_report_id
      });
    })
    .catch(err => {
      logger.log("error", "Some error occurred while submitting the content report=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while submitting the content report."
      });
    });
}

/**
 * Function to get all content reports
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.contentReportListing = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy || 'content_report_id'
  const sortOrder = req.query.sortOrder || 'DESC';

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
        content_report_name: {
          [Op.iLike]: `%${sortValue}%`
        }
      }
      ]
    } : null;
  }
  if (req.query.contentReportCatID) {
    options['where'] = {
      content_report_cat_id: req.query.contentReportCatID
    }
  }
  if (req.query.contentReportCatName) {
    options['where']['content_report_cat_name'] = {
      [Op.iLike]: `%${req.query.contentReportCatName}%`
    };
  }
  var total = await contentReport.count({
    where: options['where']
  });
  const contentreport_list = await contentReport.findAll(options);
  res.status(200).send({
    data: contentreport_list,
    totalRecords: total
  });
};

/**
 * Function to get all content report categories
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.contentReportCategoriesListing = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy || 'content_report_cat_id'
  const sortOrder = req.query.sortOrder || 'DESC';

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
        content_report_cat_name: {
          [Op.iLike]: `%${sortValue}%`
        }
      }
      ]
    } : null;
  }
  if (req.query.contentReportCatID) {
    options['where'] = {
      content_report_cat_id: req.query.contentReportCatID
    }
  }
  if (req.query.contentReportCatName) {
    options['where']['content_report_cat_name'] = {
      [Op.iLike]: `%${req.query.contentReportCatName}%`
    };
  }
  var total = await contentReportCategory.count({
    where: options['where']
  });
  const categories_list = await contentReportCategory.findAll(options);
  res.status(200).send({
    data: categories_list,
    totalRecords: total
  });
};

/**
 * Function to update single content report category
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateContentReportCategory = async (req, res) => {
  const id = req.params.contentReportCatID;
  const body = req.body;
  var contentReportCategoryDetails = await contentReportCategory.findOne({
    where: {
      content_report_cat_id: id
    }
  });
  if (!contentReportCategoryDetails) {
    res.status(500).send({
      message: "Content Report Category not Found with id=" + id
    });
    return;
  }
  const contentCategoryData = {
    "content_report_cat_autotakedown": body.hasOwnProperty("Content Report Cat Autotakedown") ? body["Content Report Cat Autotakedown"] : 0,
    "content_report_cat_name": body["Content Report Cat Name"],
    "content_report_cat_hide": body.hasOwnProperty("Content Report Cat Hide") ? body["Content Report Cat Hide"] : 0,
    "content_report_cat_usr_hide": body.hasOwnProperty("Content Report Cat Usr Hide") ? req.body["Content Report Cat Usr Hide"] : "0"
  }
  contentReportCategory.update(contentCategoryData, {
    returning: true,
    where: {
      content_report_cat_id: id
    }
  }).then(function ([num, [result]]) {
    if (num == 1) {
      audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'update', 'content report category ', id, result.dataValues, contentReportCategoryDetails);
      res.status(200).send({
        message: "Content Report Category updated successfully."
      });
    } else {
      res.status(400).send({
        message: `Cannot update Content Report Category with id=${id}. Maybe Content Report Category was not found or req.body is empty!`
      });
    }
  }).catch(err => {
    logger.log("error", err + ":Error updating Content Report Category with id=" + id);
    console.log(err)
    res.status(500).send({
      message: "Error updating Content Report Category with id=" + id
    });
  });
};

/**
 * Function to delete content report category
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteContentReportCategory = async (req, res) => {
  const content_report_cat_id = req.params.contentReportCatID;
  const contentReportCategoryDetails = await contentReportCategory.findOne({
          where: {
            content_report_cat_id: content_report_cat_id
          }
      });
  if(!contentReportCategoryDetails){
      res.status(500).send({
          message: "Could not delete Content Report Category with id=" + content_report_cat_id
        });
        return;
  }
  contentReportCategory.destroy({
      where: { 
        content_report_cat_id: content_report_cat_id
      }
    })
      .then(num => {
      res.status(200).send({
            message: "Content Report Category deleted successfully!"
      });
          return;
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Content Report Category with id=" + content_report_cat_id
        });
        return;
      });
  }