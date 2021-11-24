const db = require("../models");
const contentReport = db.content_report;
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
exports.submitContentReport = async(req, res) => {
    const body = req.body;
	if (!body["content_report_cat_id"]) {
	  res.status(500).send({
        msg:
          "content_report_cat_id is required"
      });
	  return;
	}
	if (!body["content_report_name"]) {
	  res.status(500).send({
        msg:
          "content_report_name id is required"
      });
	  return;
    }
    var userId = req.header(process.env.UKEY_HEADER || "x-api-key");
	const data = {
        "content_report_cat_id": body["content_report_cat_id"],
        "content_report_name": body["content_report_name"],
        "content_report_task_id": body["content_report_task_id"],
        "content_report_content_id": body.hasOwnProperty("content_report_content_id") ? req.body["content_report_content_id"] : "",
        "content_report_owner_id": body.hasOwnProperty("content_report_owner_id") ? req.body["content_report_owner_id"] : "",
        "content_report_reporter_id": body.hasOwnProperty("content_report_reporter_id") ? req.body["content_report_reporter_id"] : userId,
        "content_report_timestamp": body.hasOwnProperty("content_report_timestamp") ? req.body["content_report_timestamp"] : new Date().getTime(),
        "content_report_category": body.hasOwnProperty("content_report_category") ? req.body["content_report_category"] : "",
        "content_report_reason": body.hasOwnProperty("content_report_reason") ? req.body["content_report_reason"] : ""
    }
    contentReport.create(data)
    .then(data => {
	 audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','content_report',data.content_report_id,data.dataValues);
      res.status(201).send({
		  msg: "Content Report Submitted Successfully",
		  content_report_id:data.content_report_id
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