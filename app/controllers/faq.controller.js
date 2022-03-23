const db = require("../models");
const faq = db.faq;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const { isNull } = require("util");
const Op = db.Sequelize.Op;
/**
 * Function to add FAQ
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.addFAQ = async (req, res) => {
    const body = req.body;
    if (!req.body["FAQ Question"]) {
        res.status(400).send({
            msg:
                "FAQ Question is required"
        });
        return;
    }
    if (!req.body["FAQ Answer"]) {
        res.status(400).send({
            msg:
                "FAQ Answer is required"
        });
        return;
    }
    const faqData = {
        "faq_question": body.hasOwnProperty("FAQ Question") ? req.body["FAQ Question"] : '',
        "faq_answer": body.hasOwnProperty("FAQ Answer") ? req.body["FAQ Answer"] : ""
    }
    faq.create(faqData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'FAQ', data.faq_id, data.dataValues);
            res.status(201).send({
                msg: "FAQ Added Successfully",
                faqID: data.faq_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while adding the FAQ=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while adding the FAQ."
            });
        });
}


/**
 * Function to get all FAQs
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.faqListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'faq_id'
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
    if (req.query.faqId) {
        options['where']['faq_id'] = req.query.faqId;
    }
    var total = await faq.count({
        where: options['where']
    });
    const faq_list = await faq.findAll(options);
    res.status(200).send({
        data: faq_list,
        totalRecords: total
    });
}

/**
 * Function to get FAQ Detail
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.faqDetails = async(req, res) => {
    var options = {
        where: {
            faq_id: req.params.faqId
        }
    };
    const faqDetail = await faq.findOne(options);
    if(!faqDetail){
        res.status(500).send({
            message: "Page Location not found"
        });
        return
    }
    res.status(200).send({
        data: faqDetail
    });
};

/**
 * Function to update FAQ
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateFAQ = async(req, res) => {
    const id = req.params.faqId;
    var faqDetails = await faq.findOne({
        where: {
            faq_id: id
        }
    });
    faq.update(req.body, {
		returning:true,
        where: {
            faq_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','FAQ',id,result.dataValues,faqDetails);
            res.status(200).send({
                message: "FAQ updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update FAQ with id=${id}. Maybe FAQ was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating FAQ with id=" + id);
        res.status(500).send({
            message: "Error updating FAQ with id=" + id
        });
    });
};

/**
 * Function to delete FAQ
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteFAQ = async (req, res) => {
    const faqDetails = await faq.findOne({
            where: {
                faq_id: req.params.faqId
            }
        });
    if(!faqDetails){
        res.status(500).send({
            message: "Could not delete FAQ with id=" + req.params.faqId
          });
          return;
    }
    faq.destroy({
        where: { 
            faq_id: req.params.faqId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "FAQ deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete FAQ with id=" + req.params.faqId
          });
          return;
        });
    }


