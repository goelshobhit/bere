const db = require("../models");
const AdditionalInfoData = db.additional_info_data;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const Op = db.Sequelize.Op;
const common = require("../common");
/**
 * Function to add new Additional Info Data
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNewAdditionalInfoData = async(req, res) => {
    const body = req.body;
	if(!req.body["Title"]){
	  res.status(500).send({
        msg:
          "Title is required"
      });
	  return;
	}
	
    const data = {
        "ad_info_data_name": body.hasOwnProperty("Title") ? req.body["Title"] : "",
        "ad_info_id": body.hasOwnProperty("Heading Id") ? req.body["Heading Id"] : null,
        "ad_info_data_description": body.hasOwnProperty("Texts Under") ? req.body["Texts Under"] : null,
        "ad_info_data_image": body.hasOwnProperty("Image") ? req.body["Image"] : null,
    }
    AdditionalInfoData.create(data)
    .then(data => {
	 audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','ad_info_data_id',data.ad_info_data_id,data.dataValues);
      res.status(201).send({
		  msg: "Additional Info Data Added Successfully",
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
 * Function to get all data
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
    const type = req.query.type;
    var options = {
        include: [
            {
                model: db.additional_info_heading,
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
    if (type) {
        var options = {
            include: [
                {
                    model: db.additional_info_heading,
                    required: true,
                    where: { ad_info_type_name: type }
                }
            ],
            limit: pageSize,
            offset: skipCount,
            order: [
                [sortBy, sortOrder]
            ],
            where: {}
        };
    }
    if(req.query.sortVal){
        var sortValue=req.query.sortVal.trim();
		options.where = sortValue ? {
            [Op.or]: [{
                ad_info_data_name: {
                        [Op.iLike]: `%${sortValue}%`
                    }
                }
            ]
        } : null;			
    }
    
    var total = await AdditionalInfoData.count({
        where: options['where']
    });
    const additionalHeading = await AdditionalInfoData.findAll(options);
    res.status(200).send({
        data: additionalHeading,
		totalRecords:total
    });
}

/**
 * Function to get data details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.addtionalInfoDataDetail = async(req, res) => {  
    const adInfoDataId = req.params.adInfoDataId;
   
    const additionData = await AdditionalInfoData.findOne({
		include: [
            {
                model: db.additional_info_heading,
                required: false,
            }
        ],
        where: {
            ad_info_data_id: adInfoDataId
        }
    });
    if(!additionData){
        res.status(500).send({
            message: "Additional Info Data not found"
        });
        return
    }
    res.status(200).send({
        data: additionData,
		media_token: common.imageToken(adInfoDataId)
    })
}

/**
 * Function to update info details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

 exports.updateAddtionalInfoData = async(req, res) => {
    const id = req.params.adInfoDataId;
    var additionalInfoData = await AdditionalInfoData.findOne({
        where: {
            ad_info_data_id: id
        }
    });
    AdditionalInfoData.update(req.body, {
        returning: true,
        where: {
            ad_info_data_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','ad_info_data_id',id,result.dataValues,additionalInfoData);
            res.status(200).send({
                message: "Additional Info Data updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Additional Info Data with id=${id}. Maybe Additional Info Data was not found or req.body is empty!`
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
 * Function to delete Info
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteData = async (req, res) => {
    const additionalInfoData = await AdditionalInfoData.findOne({
            where: {
                ad_info_data_id: req.params.id
            }
        });
    if(!additionalInfoData){
        res.status(500).send({
            message: "Could not delete Data with id=" + req.params.id
          });
          return;
    }
    AdditionalInfoData.destroy({
        where: { 
            ad_info_data_id: req.params.id
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Info deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Info with id=" + req.params.id
          });
          return;
        });
    }

 