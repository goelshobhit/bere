const db = require("../models");
const CFSettings = db.content_feedback_settings;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const Op = db.Sequelize.Op;
/**
 * Function to add Content Feedback Settings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.addContentFeedbackSettings = async (req, res) => {
    const body = req.body;
    const feedbackSettingsData = {
        "popup_shown_user_percentage": body.hasOwnProperty("User Percentage") ? req.body["User Percentage"] : '',
        "popup_shown_days": body.hasOwnProperty("Shown Days") ? req.body["Shown Days"] : ""
    }
    CFSettings.create(feedbackSettingsData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'Content Feedback Settings', data.cfs_id, data.dataValues);
            res.status(201).send({
                msg: "Content Feedback Settings Added Successfully",
                cfsID: data.cfs_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while adding the Content Feedback Settings=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while adding the Content Feedback Settings."
            });
        });
}


/**
 * Function to get all Content Feedback Settings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.feedbackSettingListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'cfs_id'
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
    if (req.query.cfsId) {
        options['where']['cfs_id'] = req.query.cfsId;
    }
    var total = await CFSettings.count({
        where: options['where']
    });
    const faq_list = await CFSettings.findAll(options);
    res.status(200).send({
        data: faq_list,
        totalRecords: total
    });
}

/**
 * Function to update Content Feedback Settings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateFeedbackSettings = async(req, res) => {
    const id = req.params.cfsId;
    var faqDetails = await CFSettings.findOne({
        where: {
            cfs_id: id
        }
    });
    CFSettings.update(req.body, {
		returning:true,
        where: {
            cfs_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','Content Feedback Settings',id,result.dataValues,faqDetails);
            res.status(200).send({
                message: "Content Feedback Settings updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Content Feedback Settings with id=${id}. Maybe Content Feedback Settings was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Content Feedback Settings with id=" + id);
        res.status(500).send({
            message: "Error updating Content Feedback Settings with id=" + id
        });
    });
};

/**
 * Function to delete Content Feedback Settings
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteFeedbackSettings = async (req, res) => {
    const faqDetails = await CFSettings.findOne({
            where: {
                cfs_id: req.params.cfsId
            }
        });
    if(!faqDetails){
        res.status(500).send({
            message: "Could not delete Content Feedback Settings with id=" + req.params.cfsId
          });
          return;
    }
    CFSettings.destroy({
        where: { 
            cfs_id: req.params.cfsId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Content Feedback Settings deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Content Feedback Settings with id=" + req.params.cfsId
          });
          return;
        });
    }


