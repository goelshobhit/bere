const db = require("../models");
const brandUserShare = db.brand_user_share;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const Op = db.Sequelize.Op;

exports.BrandUserShare = async(req, res) => {
    const body = req.body;
    const Uid = req.header(process.env.UKEY_HEADER || "x-api-key");
	if(!req.body["Brand Id"]){
	  res.status(400).send({
        msg:
          "Brand id is required"
      });
	  return;
	}
	
    const brandSharedata = {
        "brand_id": body.hasOwnProperty("Brand Id") ? req.body["Brand Id"] : 0,
        "user_id": body.hasOwnProperty("User Id") ? req.body["User Id"] : Uid,
        "is_brand_follow": body.hasOwnProperty("Is Brand Follow") ? req.body["Is Brand Follow"] : 0,
        "is_facebook_share": body.hasOwnProperty("Is Fb Share") ? req.body["Is Fb Share"] : 0,
        "is_twitter_share": body.hasOwnProperty("Is Twitter Share") ? req.body["Is Twitter Share"] : 0,
        "is_pinterest_share": body.hasOwnProperty("Is Pinterest Share") ? req.body["Is Pinterest Share"] : 0,
        "is_instagram_share": body.hasOwnProperty("Is Insta Share") ? req.body["Is Insta Share"] : 0,
        "is_tiktok_share": body.hasOwnProperty("Is Tiktok Share") ? req.body["Is Tiktok Share"] : 0
    }
    brandUserShare.create(brandSharedata)
    .then(data => {
	 audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','co_reg',data.bus_id,data.dataValues);
      res.status(201).send({
		  msg: "Brand Added Successfully",
		  brandUserShareId:data.bus_id
	  });
    })
    .catch(err => {
    logger.log("error", "Some error occurred while adding the Brand Share=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while adding the Brand Share."
      });
    });
}

/**
 * Function to get all brand share
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.listing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'bus_id'
	const sortOrder = req.query.sortOrder || 'DESC'
    var options = {
        include: [
            {
                model: db.brands,
                required: false,
                attributes: [
                    ["cr_co_name", "Brand Name"]
                ],
                where: { is_autotakedown: 0 }
            },
            {
                model: db.user_profile,
                attributes: [["u_display_name", "user_name"]],
                required: false,
                where: {
                    is_autotakedown: 0
                }
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
                cr_co_name: {
                        [Op.iLike]: `%${sortValue}%`
                    }
                }
            ]
        } : null;			
    }
    if (req.query.brandUserShareId) {
        options['where']['bus_id'] = req.query.brandUserShareId;
    }
    if (req.query.brandId) {
        options['where']['brand_id'] = req.query.brandId;
    }
    if (req.query.userId) {
        options['where']['user_id'] = req.query.userId;
    }
    var total = await brandUserShare.count({
        where: options['where']
    });
    const brandUser_list = await brandUserShare.findAll(options);
    res.status(200).send({
        data: brandUser_list,
		totalRecords:total
    });
}

/**
 * Function to update brand user Share
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

 exports.updateBrandUserShare = async(req, res) => {
    const id = req.params.brandUserShareId;
    var BrandUserDetails = await brandUserShare.findOne({
        where: {
            bus_id: id
        }
    });
    brandUserShare.update(req.body, {
        returning: true,
        where: {
            bus_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','brand_user_share',id,result.dataValues,BrandUserDetails);
            res.status(200).send({
                message: "Brand User Share updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Brand User Share with id=${id}. Maybe Brand User Share was not found or req.body is empty!`
            });
        }
    }).catch(err => {
       logger.log("error", err+": Error updating Brand User Share with id=" + id);
        res.status(500).send({
            message: err+"Error updating Brand User Share with id=" + id
        });
    });
 }




