const db = require("../models");
const NotifyCat = db.notify_cat;
const NotifyGrp = db.notify_grp;
const Op = db.Sequelize.Op;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new NotifyCat
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNotifyCat = async(req, res) => {
    const body = req.body
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const notifyCat = {
        "notify_cat_name": body.hasOwnProperty("Category Name") ? body["Category Name"] : "",
        "notify_cat_description": body.hasOwnProperty("Category Description") ? body["Category Description"] : null,
        "notify_cat_deliv_method": body.hasOwnProperty("Delivery Method") ? body["Delivery Method"] : 0
    }
    NotifyCat.create(notifyCat).then(data => {
        audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','todayTimeStamp',data.notify_trig_cat_id,data.dataValues);
    res.status(201).send({			
        msg: "NotifyCat Created Successfully",
        notifyTrigCatId: data.notify_trig_cat_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the NotifyCat=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the NotifyCat."
        });
    })
};

/**
 * Function to get all NotifyCat
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.NotifyCatListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'notify_trig_cat_id'
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
                notify_cat_name: {
                        [Op.iLike]: `%${sortValue}%`
                    }
                }
            ]
        } : null;			
    }
    options['include'] = [
        {
          model: NotifyGrp,
          required:false
        }
    ]
    var total = await NotifyCat.count({
        where: options['where']
    });
    const NotifyCat_list = await NotifyCat.findAll(options);
    res.status(200).send({
        data: NotifyCat_list,
		totalRecords:total
    });
};
/**
 * Function to get single NotifyCat
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.NotifyCatDetails = async(req, res) => {
    const notifyTrigCatId = req.params.notifyTrigCatId;
    var options = {
        where: {
            notify_trig_cat_id: notifyTrigCatId
        }
    };
    const notifyCat = await NotifyCat.findOne(options);
    if(!notifyCat){
        res.status(500).send({
            message: "NotifyCat not found"
        });
        return
    }
    res.status(200).send({
        data: notifyCat
    });
};
/**
 * Function to update single NotifyCat
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateNotifyCat = async(req, res) => {
    const id = req.params.notifyTrigCatId;
    var NotifyCatDetails = await NotifyCat.findOne({
        where: {
            notify_trig_cat_id: id
        }
    });
    NotifyCat.update(req.body, {
		returning:true,
        where: {
            notify_trig_cat_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','NotifyCat',id,result.dataValues,NotifyCatDetails);
            res.status(200).send({
                message: "NotifyCat updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update NotifyCat with id=${id}. Maybe NotifyCat was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating NotifyCat with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating NotifyCat with id=" + id
        });
    });
};

/**
 * Function to delete NotifyCat
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteNotifyCat = async (req, res) => {
    const NotifyCatDetails = await NotifyCat.findOne({
            where: {
                notify_trig_cat_id: req.params.notifyTrigCatId
            }
        });
    if(!NotifyCatDetails){
        res.status(500).send({
            message: "Could not delete NotifyCat with id=" + req.params.notifyTrigCatId
          });
          return;
    }
    NotifyCat.destroy({
        where: { 
            notify_trig_cat_id: req.params.notifyTrigCatId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "NotifyCat deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete NotifyCat with id=" + req.params.notifyTrigCatId
          });
          return;
        });
    }