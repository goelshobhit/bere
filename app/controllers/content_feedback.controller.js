const db = require("../models");
const ContentSettings = db.content_feedback;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const Op = db.Sequelize.Op;
/**
 * Function to add Content Feedback
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.addContentFeedback = async (req, res) => {
    const body = req.body;
    if (!req.body["Feedback Question"]) {
        res.status(400).send({
            msg:
                "Feedback Question is required"
        });
        return;
    }
    if (!req.body["Question Type"]) {
        res.status(400).send({
            msg:
                "Question Type is required"
        });
        return;
    }
    const feedbackData = {
        "content_feedback_category_id": body.hasOwnProperty("Category Id") ? req.body["Category Id"] : "",
        "content_feedback_question_type": body.hasOwnProperty("Question Type") ? req.body["Question Type"] : "",
        "content_feedback_question": body.hasOwnProperty("Feedback Question") ? req.body["Feedback Question"] : "",
        "content_feedback_answers": body.hasOwnProperty("Feedback Answer") ? req.body["Feedback Answer"] : []
    }
    ContentSettings.create(feedbackData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'Content Feedback', data.content_feedback_id, data.dataValues);
            res.status(201).send({
                msg: "Content Feedback Added Successfully",
                cfsID: data.content_feedback_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while adding the Content Feedback=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while adding the Content Feedback."
            });
        });
}


/**
 * Function to get all Content Feedbacks
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.feedbackListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'content_feedback_id'
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
        var sortValue = req.query.sortVal.trim();
        options.where = sortValue ? {
            [Op.or]: [{
                cr_co_name: {
                    [Op.iLike]: `%${sortValue}%`
                }
            }
            ]
        } : null;
    }
    if (req.query.contentFeedbackId) {
        options['where']['content_feedback_id'] = req.query.contentFeedbackId;
    }
    var total = await ContentSettings.count({
        where: options['where']
    });
    const faq_list = await ContentSettings.findAll(options);
    res.status(200).send({
        data: faq_list,
        totalRecords: total
    });
}

/**
 * Function to update Content Feedback
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateContentFeedback = async(req, res) => {
    const id = req.params.contentFeedbackId;
    var contentfeedbackDetails = await ContentSettings.findOne({
        where: {
            content_feedback_id: id
        }
    });
    ContentSettings.update(req.body, {
		returning:true,
        where: {
            content_feedback_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','Content Feedback',id,result.dataValues,contentfeedbackDetails);
            res.status(200).send({
                message: "Content Feedback updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Content Feedback with id=${id}. Maybe Content Feedback was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Content Feedback with id=" + id);
        res.status(500).send({
            message: "Error updating Content Feedback with id=" + id
        });
    });
};

/**
 * Function to delete Content Feedback
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteContentFeedback = async (req, res) => {
    const faqDetails = await ContentSettings.findOne({
            where: {
                content_feedback_id: req.params.contentFeedbackId
            }
        });
    if(!faqDetails){
        res.status(500).send({
            message: "Could not delete Content Feedback with id=" + req.params.contentFeedbackId
          });
          return;
    }
    ContentSettings.destroy({
        where: { 
            content_feedback_id: req.params.contentFeedbackId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Content Feedback deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Content Feedback with id=" + req.params.contentFeedbackId
          });
          return;
        });
    }


