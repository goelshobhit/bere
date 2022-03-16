const db = require("../models");
const pageLocation = db.page_location;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const { isNull } = require("util");
const Op = db.Sequelize.Op;
/**
 * Function to add Page Location
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.addPageLocation = async (req, res) => {
    const body = req.body;
    if (!req.body["Page Name"]) {
        res.status(400).send({
            msg:
                "Page Name is required"
        });
        return;
    }
    const pageLocationData = {
        "page_name": body.hasOwnProperty("Page Name") ? req.body["Page Name"] : '',
        "page_description": body.hasOwnProperty("Page Description") ? req.body["Page Description"] : '',
        "page_image_path": body.hasOwnProperty("Page Image Path") ? req.body["Page Image Path"] : ""
    }
    pageLocation.create(pageLocationData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'page_location', data.page_id, data.dataValues);
            res.status(201).send({
                msg: "Page Location Added Successfully",
                pageID: data.page_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while adding the Page Location=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while adding the Page Location."
            });
        });
}


/**
 * Function to get all Page Locations
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.pageLocationListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'page_id'
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
    if (req.query.pageId) {
        options['where']['page_id'] = req.query.pageId;
    }
    if (req.query.pageName) {
        options['where']['page_name'] = req.query.pageName;
    }
    var total = await pageLocation.count({
        where: options['where']
    });
    const pagelocation_list = await pageLocation.findAll(options);
    res.status(200).send({
        data: pagelocation_list,
        totalRecords: total
    });
}

/**
 * Function to get Page Location Detail
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.pageLocationDetails = async(req, res) => {
    var options = {
        where: {
            page_id: req.params.pageId
        }
    };
    const pageLocationDetail = await pageLocation.findOne(options);
    if(!pageLocationDetail){
        res.status(500).send({
            message: "Page Location not found"
        });
        return
    }
    res.status(200).send({
        data: pageLocationDetail
    });
};

/**
 * Function to update single Video Ads Submit
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updatepageLocation = async(req, res) => {
    const id = req.params.pageId;
    var pageLocationDetails = await pageLocation.findOne({
        where: {
            page_id: id
        }
    });
    pageLocation.update(req.body, {
		returning:true,
        where: {
            page_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','page_location',id,result.dataValues,pageLocationDetails);
            res.status(200).send({
                message: "Page Location updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Page Location with id=${id}. Maybe Page Location was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating VPage Location with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Page Location with id=" + id
        });
    });
};

/**
 * Function to delete Page Location
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deletePageLocation = async (req, res) => {
    const pageLocationDetails = await pageLocation.findOne({
            where: {
                page_id: req.params.pageId
            }
        });
    if(!pageLocationDetails){
        res.status(500).send({
            message: "Could not delete page location with id=" + req.params.pageId
          });
          return;
    }
    pageLocation.destroy({
        where: { 
            page_id: req.params.pageId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Page Location deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Page Location with id=" + req.params.pageId
          });
          return;
        });
    }


