const db = require("../models");
const tips = db.tips;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const { isNull } = require("util");
const Op = db.Sequelize.Op;
/**
 * Function to add Tips
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.addTips = async (req, res) => {
    const body = req.body;
    const tipsData = {
        "heading": body.hasOwnProperty("Heading") ? req.body["Heading"] : '',
        "sub_heading": body.hasOwnProperty("Sub Heading") ? req.body["Sub Heading"] : "",
        "description": body.hasOwnProperty("Description") ? req.body["Description"] : '',
        "image": body.hasOwnProperty("Image") ? req.body["Image"] : ''
    }
    tips.create(tipsData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'tips', data.id, data.dataValues);
            res.status(201).send({
                msg: "tips Added Successfully",
                tipId: data.id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while adding the tips=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while adding the tips."
            });
        });
}


/**
 * Function to get all tipss
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.tipsListing = async (req, res) => {
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
    if (req.query.tipId) {
        options['where']['id'] = req.query.tipId;
    }
    var total = await tips.count({
        where: options['where']
    });
    const tips_list = await tips.findAll(options);
    res.status(200).send({
        data: tips_list,
        totalRecords: total
    });
}

/**
 * Function to get tips Detail
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.tipsDetails = async(req, res) => {
    var options = {
        where: {
            id: req.params.tipId
        }
    };
    const tipsDetail = await tips.findOne(options);
    if(!tipsDetail){
        res.status(500).send({
            message: "Tips not found"
        });
        return
    }
    res.status(200).send({
        data: tipsDetail
    });
};

/**
 * Function to update tips
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateTips = async(req, res) => {
    const id = req.params.tipId;
    var tipsDetails = await tips.findOne({
        where: {
            id: id
        }
    });
    tips.update(req.body, {
		returning:true,
        where: {
            id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','tips',id,result.dataValues,tipsDetails);
            res.status(200).send({
                message: "tips updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update tips with id=${id}. Maybe tips was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating tips with id=" + id);
        res.status(500).send({
            message: "Error updating tips with id=" + id
        });
    });
};

/**
 * Function to delete tips
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteTips = async (req, res) => {
    const tipsDetails = await tips.findOne({
            where: {
                id: req.params.tipId
            }
        });
    if(!tipsDetails){
        res.status(500).send({
            message: "Could not delete tips with id=" + req.params.tipId
          });
          return;
    }
    tips.destroy({
        where: { 
            id: req.params.tipId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "tips deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete tips with id=" + req.params.tipId
          });
          return;
        });
    }


