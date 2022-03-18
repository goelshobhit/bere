const db = require("../models");
const termsConditions = db.terms_conditions;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const { isNull } = require("util");
const Op = db.Sequelize.Op;
/**
 * Function to add Terms and Conditions
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.addTermsConditions = async (req, res) => {
    const body = req.body;
    if (!req.body["Description"]) {
        res.status(400).send({
            msg:
                "Description is required"
        });
        return;
    }
    const termsData = {
        "description": body.hasOwnProperty("Description") ? req.body["Description"] : ''
    }
    termsConditions.create(termsData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'terms', data.id, data.dataValues);
            res.status(201).send({
                msg: "Terms and Conditions Added Successfully",
                termsId: data.id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while adding the Terms and Conditions=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while adding the Terms and Conditions."
            });
        });
}


/**
 * Function to get all terms and conditions
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.termsListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'id'
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
    if (req.query.termsId) {
        options['where']['id'] = req.query.termsId;
    }
    var total = await termsConditions.count({
        where: options['where']
    });
    const terms_list = await termsConditions.findAll(options);
    res.status(200).send({
        data: terms_list,
        totalRecords: total
    });
}

/**
 * Function to update Terms and Conditions
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateTermsConditions = async(req, res) => {
    const id = req.params.termsId;
    var termsDetails = await termsConditions.findOne({
        where: {
            id: id
        }
    });
    termsConditions.update(req.body, {
		returning:true,
        where: {
            id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','terms',id,result.dataValues,termsDetails);
            res.status(200).send({
                message: "Terms and Conditions updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Terms and Conditions with id=${id}. Maybe Terms and Conditions was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Terms and Conditions with id=" + id);
        res.status(500).send({
            message: "Error updating Terms and Conditions with id=" + id
        });
    });
};

/**
 * Function to delete Terms and Conditions
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteTerms = async (req, res) => {
    const termsDetails = await termsConditions.findOne({
            where: {
                id: req.params.termsId
            }
        });
    if(!termsDetails){
        res.status(500).send({
            message: "Could not delete Terms and Conditions with id=" + req.params.termsId
          });
          return;
    }
    termsConditions.destroy({
        where: { 
            id: req.params.termsId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Terms and Conditions deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Terms and Conditions with id=" + req.params.termsId
          });
          return;
        });
    }

    /**
 * Function to get all system basic listing like terms conditions, FAQ, Tips
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.allSystemBasicListing = async (req, res) => {
    var options = {
        where: {}
    };
   const terms_list = await termsConditions.findAll(options);
   const faq_list = await db.faq.findAll(options);
   const tips_list = await db.tips.findAll(options);
    res.status(200).send({
        terms_and_conditions_list: terms_list,
        faq_list: faq_list,
        tips_list: tips_list
    });
}


