const db = require("../models");
const AdditionalInfoHeading = db.additional_info_heading;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const Op = db.Sequelize.Op;
const common = require("../common");
/**
 * Function to add new Additional Info Heading
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNewAdditionalInfoHeading = async(req, res) => {
    const body = req.body;
	if(!req.body["Heading"]){
	  res.status(500).send({
        msg:
          "Heading is required"
      });
	  return;
	}
	
    const data = {
        "ad_info_name": body.hasOwnProperty("Heading") ? req.body["Heading"] : "",
        "ad_info_type_name": body.hasOwnProperty("Type") ? req.body["Type"] : ""
    }
    AdditionalInfoHeading.create(data)
    .then(data => {
	 audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','ad_info_data_id',data.ad_info_data_id,data.dataValues);
      res.status(201).send({
		  msg: "Additional Info Heading Added Successfully",
		  ad_info_data_id:data.ad_info_data_id
	  });
    })
    .catch(err => {
    logger.log("error", "Some error occurred while creating the ad_info_data_id=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the ad_info_data."
      });
    });
}

/**
 * Function to get all brands
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.listing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'ad_info_data_id'
	const sortOrder = req.query.sortOrder || 'DESC'
    const type = req.params.type;
    var options = {
        include: [
            {
                model: db.additional_info_data,
                required: false
            }
        ],
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if(req.query.sortVal){
        var sortValue=req.query.sortVal.trim();
		options.where = sortValue ? {
            [Op.or]: [{
                ad_info_name: {
                        [Op.iLike]: `%${sortValue}%`
                    }
                }
            ]
        } : null;			
    }
    if (type) {
        options['where']['ad_info_type_name'] =  type
    }
    var total = await AdditionalInfoHeading.count({
        where: options['where']
    });
    const additionalHeading = await AdditionalInfoHeading.findAll(options);
    res.status(200).send({
        data: additionalHeading,
		totalRecords:total
    });
}

/**
 * Function to get info details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.addtionalInfoHeadingDetail = async(req, res) => {  
    const adInfoId = req.params.adInfoId;
   
    const additionHeading = await AdditionalInfoHeading.findOne({
		include: [
            {
                model: db.additional_info_data,
                required: false,
            }
        ],
        where: {
            ad_info_id: adInfoId
        }
    });
    if(!additionHeading){
        res.status(500).send({
            message: "additional info data not found"
        });
        return
    }
    res.status(200).send({
        data: additionHeading,
		media_token: common.imageToken(adInfoId)
    })
}

/**
 * Function to update info details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

 exports.updateAddtionalInfoHeading = async(req, res) => {
    const id = req.params.ad_info_id;
    var additionalInfoHeading = await AdditionalInfoHeading.findOne({
        where: {
            ad_info_id: id
        }
    });
    AdditionalInfoHeading.update(req.body, {
        returning: true,
        where: {
            ad_info_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','ad_info_id',id,result.dataValues,additionalInfoHeading);
            res.status(200).send({
                message: "Additional Info Heading updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Additional Info Heading with id=${id}. Maybe Additional Info Heading was not found or req.body is empty!`
            });
        }
    }).catch(err => {
       logger.log("error", err+": Error updating Heading with id=" + id);
        res.status(500).send({
            message: err+"Error updating Heading with id=" + id
        });
    });
}

/**
 * Function to delete Heading
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteHeading = async (req, res) => {
    const additionalInfoHeading = await AdditionalInfoHeading.findOne({
            where: {
                ad_info_id: req.params.id
            }
        });
    if(!additionalInfoHeading){
        res.status(500).send({
            message: "Could not delete Heading with id=" + req.params.id
          });
          return;
    }
    additionalInfoHeading.destroy({
        where: { 
            ad_info_id: req.params.id
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Heading deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Heading with id=" + req.params.id
          });
          return;
        });
    }

 