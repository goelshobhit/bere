const db = require("../models");
const BlackListed = db.blacklisted;
const Op = db.Sequelize.Op;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new Black Listed
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createBlackListed = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const blackListed = {
        "keyword": body.hasOwnProperty("Keyword") ? body["Keyword"] : '',
        }
    BlackListed.create(blackListed).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.blacklisted_id,data.dataValues);
        res.status(201).send({			
            msg: "Black Listed Created Successfully",
            blackListedId: data.blacklisted_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Black Listed=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Black Listed."
        });
    })
};

/**
 * Function to get all Black Listed
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.blackListedListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'blacklisted_id'
	const sortOrder = req.query.sortOrder || 'DESC'
    
    var options = {
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
                keyword: {
                        [Op.iLike]: `%${sortValue}%`
                    }
                }
            ]
        } : null;			
    }
    var total = await BlackListed.count({
        where: options['where']
    });
    const blackListed_list = await BlackListed.findAll(options);
    res.status(200).send({
        data: blackListed_list,
		totalRecords:total
    });
};
/**
 * Function to get single Black Listed
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.blackListedDetails = async(req, res) => {
    const blackListedId = req.params.blackListedId;
    var options = {
        where: {
            blacklisted_id: blackListedId
        }
    };
    const blackListed = await BlackListed.findOne(options);
    if(!blackListed){
        res.status(500).send({
            message: "Black Listed not found"
        });
        return
    }
    res.status(200).send({
        data: blackListed
    });
};
/**
 * Function to update single Black Listed
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateBlackListed = async(req, res) => {
    const body = req.body
    const id = req.params.blackListedId;
    var BlackListedDetails = await BlackListed.findOne({
        where: {
            blacklisted_id: id
        }
    });
    const blackListed = {
        "keyword": body.hasOwnProperty("Keyword") ? body["Keyword"] : "",
        }
    BlackListed.update(blackListed, {
		returning:true,
        where: {
            blacklisted_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','blackListed',id,result.dataValues,BlackListedDetails);
            res.status(200).send({
                message: "Black Listed updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Black Listed with id=${id}. Maybe Black Listed was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Black Listed with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Black Listed with id=" + id
        });
    });
};

/**
 * Function to delete Black Listed
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteBlackListed = async (req, res) => {
    const blackListedDetails = await BlackListed.findOne({
            where: {
                blacklisted_id: req.params.blackListedId
            }
        });
    if(!blackListedDetails){
        res.status(500).send({
            message: "Could not delete Black Listed with id=" + req.params.blackListedId
          });
          return;
    }
    BlackListed.destroy({
        where: { 
            blacklisted_id: req.params.blackListedId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Black Listed deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Black Listed with id=" + req.params.blackListedId
          });
          return;
        });
    }