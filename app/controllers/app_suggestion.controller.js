const db = require("../models");
const AppSuggestion = db.app_suggestion;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const Op = db.Sequelize.Op;
const common = require("../common");
/**
 * Function to add new App Suggestion
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNewAppSuggestion = async(req, res) => {
    const body = req.body;
    const data = {
        "u_id": req.header(process.env.UKEY_HEADER || "x-api-key"),
        "feedback_type_name": body.hasOwnProperty("Type Name") ? req.body["Type Name"] : "",
        "feedback_in_detail": body.hasOwnProperty("Detail") ? req.body["Detail"] : "",
        "feedback_images": body.hasOwnProperty("Images") ? req.body["Images"] : ""
    }
    AppSuggestion.create(data)
    .then(data => {
	 audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','app_suggestion_id',data.app_suggestion_id,data.dataValues);
      res.status(201).send({
		  msg: "App Suggestion Added Successfully",
		  app_suggestion_id:data.app_suggestion_id
	  });
    })
    .catch(err => {
    logger.log("error", "Some error occurred while creating the app_suggestion_id=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the app_suggestion."
      });
    });
}

/**
 * Function to get all heading
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.listing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'app_suggestion_id'
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
                feedback_type_name: {
                        [Op.iLike]: `%${sortValue}%`
                    }
                }
            ]
        } : null;			
    }
    var total = await AppSuggestion.count({
        where: options['where']
    });
    const appSuggestion =  await AppSuggestion.findAll(options);
    
    res.status(200).send({
        data: appSuggestion,
		totalRecords:total
    });
}

/**
 * Function to get info details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.appSuggestionDetail = async(req, res) => {  
    const appSuggestionId = req.params.appSuggestionId;
   
    const appSuggestion = await AppSuggestion.findOne({
        where: {
            app_suggestion_id: appSuggestionId
        }
    });
    if(!appSuggestion){
        res.status(500).send({
            message: "app suggestion not found"
        });
        return
    }
    res.status(200).send({
        data: appSuggestion,
		media_token: common.imageToken(appSuggestionId)
    })
}

/**
 * Function to update info details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

 exports.updateAppSuggestion = async(req, res) => {
    const appSuggestionId = req.params.appSuggestionId;
    var appSuggestion = await AppSuggestion.findOne({
        where: {
            app_suggestion_id: appSuggestionId
        }
    });
    AppSuggestion.update(req.body, {
        returning: true,
        where: {
            app_suggestion_id: appSuggestionId
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','app_suggestion_id',appSuggestionId,result.dataValues,appSuggestion);
            res.status(200).send({
                message: "App Suggestion updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update App Suggestion with id=${id}. Maybe App Suggestion was not found or req.body is empty!`
            });
        }
    }).catch(err => {
       logger.log("error", err+": Error updating App Suggestion with id=" + id);
        res.status(500).send({
            message: err+"Error updating App Suggestion with id=" + id
        });
    });
}

/**
 * Function to delete App Suggestion
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.deleteAppSuggestion = async (req, res) => {
    const appSuggestion = await AppSuggestion.findOne({
            where: {
                app_suggestion_id: req.params.appSuggestionId
            }
        });
    if(!appSuggestion){
        res.status(500).send({
            message: "Could not delete App Suggestion with id=" + req.params.appSuggestionId
          });
          return;
    }
    appSuggestion.destroy({
        where: { 
            app_suggestion_id: req.params.appSuggestionId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "App Suggestion deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete App Suggestion with id=" + req.params.appSuggestionId
          });
          return;
        });
    }

 