const db = require("../models");
const NotifyGrp = db.notify_grp;
const Op = db.Sequelize.Op;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new NotifyGrp
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNotifyGrp = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const notifyGrp = {
        "notify_grp_name": body.hasOwnProperty("Group Name") ? body["Group Name"] : 0,
        "notify_grp_deliv_method": body.hasOwnProperty("Delivery Method") ? body["Delivery Method"] : 0,
        "notify_trig_grp_sentdate": body.hasOwnProperty("Sent Date") ? body["Sent Date"] : new Date(),
    }
    NotifyGrp.create(notifyGrp).then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.notify_trig_grp_id,data.dataValues);
        res.status(201).send({			
            msg: "NotifyGrp Created Successfully",
            notifyTrigGrpId: data.notify_trig_grp_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the NotifyGrp=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the NotifyGrp."
        });
    })
};

/**
 * Function to get all NotifyGrp
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.notifyGrpListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'notify_trig_grp_id'
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
                notify_grp_name: {
                        [Op.iLike]: `%${sortValue}%`
                    }
                }
            ]
        } : null;			
    }
    var total = await NotifyGrp.count({
        where: options['where']
    });
    const notifyGrp_list = await NotifyGrp.findAll(options);
    res.status(200).send({
        data: notifyGrp_list,
		totalRecords:total
    });
};
/**
 * Function to get single NotifyGrp
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.notifyGrpDetails = async(req, res) => {
    const notifyTrigGrpId = req.params.notifyTrigGrpId;
    var options = {
        where: {
            notify_trig_grp_id: notifyTrigGrpId
        }
    };
    const notifyGrp = await NotifyGrp.findOne(options);
    if(!notifyGrp){
        res.status(500).send({
            message: "NotifyGrp not found"
        });
        return
    }
    res.status(200).send({
        data: notifyGrp
    });
};
/**
 * Function to update single NotifyGrp
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateNotifyGrp = async(req, res) => {
    const body = req.body
    const id = req.params.notifyTrigGrpId;
    var NotifyGrpDetails = await NotifyGrp.findOne({
        where: {
            notify_trig_grp_id: id
        }
    });
    const notifyGrp = {
        "notify_grp_name": body.hasOwnProperty("Group Name") ? body["Group Name"] : 0,
        "notify_grp_deliv_method": body.hasOwnProperty("Delivery Method") ? body["Delivery Method"] : 0,
        "notify_trig_grp_sentdate": body.hasOwnProperty("Sent Date") ? body["Sent Date"] : new Date(),
    }
    NotifyGrp.update(notifyGrp, {
		returning:true,
        where: {
            notify_trig_grp_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','notifyGrp',id,result.dataValues,NotifyGrpDetails);
            res.status(200).send({
                message: "NotifyGrp updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update NotifyGrp with id=${id}. Maybe NotifyGrp was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating NotifyGrp with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating NotifyGrp with id=" + id
        });
    });
};

/**
 * Function to delete NotifyGrp
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteNotifyGrp = async (req, res) => {
    const notifyGrpDetails = await NotifyGrp.findOne({
            where: {
                notify_trig_grp_id: req.params.notifyTrigGrpId
            }
        });
    if(!notifyGrpDetails){
        res.status(500).send({
            message: "Could not delete NotifyGrp with id=" + req.params.notifyTrigGrpId
          });
          return;
    }
    NotifyGrp.destroy({
        where: { 
            notify_trig_grp_id: req.params.notifyTrigGrpId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "NotifyGrp deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete NotifyGrp with id=" + req.params.notifyTrigGrpId
          });
          return;
        });
    }