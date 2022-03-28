const db = require("../models");
const users_invitation = db.users_invitation;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const { isNull } = require("util");
const Op = db.Sequelize.Op;

/**
 * Function to add vote
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.userInvitation = async (req, res) => {
    const body = req.body;
    if (!req.body["Recipient User Id"]) {
        res.status(400).send({
            msg:
                "Recipient User Id is required"
        });
        return;
    }
    var UserId = req.header(process.env.UKEY_HEADER || "x-api-key");
    const userInvitationData = {
        "users_invitation_user_id": body.hasOwnProperty("Invitation User Id") ? req.body["Invitation User Id"] : UserId,
        "users_invitation_page_id": body.hasOwnProperty("Page Id") ? req.body["Page Id"] : null,
        "users_invitation_object_id": body.hasOwnProperty("Invitation Object Id") ? req.body["Invitation Object Id"] :  null,
        "users_invitation_action_id": body.hasOwnProperty("Invitation Action Id") ? req.body["Invitation Action Id"] :  null,
        "users_invitation_recipient_email": body.hasOwnProperty("Invitation Recipient Email") ? req.body["Invitation Recipient Email"] :  '',
        "users_invitation_recipient_mobile": body.hasOwnProperty("Invitation Recipient Mobile") ? req.body["Invitation Recipient Mobile"] :  null,
        "users_invitation_url": body.hasOwnProperty("Invitation Url") ? req.body["Invitation Url"] : '',
        "users_invitation_recipient_user_id": body.hasOwnProperty("Recipient User Id") ? req.body["Recipient User Id"] :  null,
        "users_invitation_invitation_timestamp": body.hasOwnProperty("Invitation Timestamp") ? req.body["Invitation Timestamp"] :  null,
        "users_invitation_received_acknowledgment_timestamp": body.hasOwnProperty("Received Acknowledgment Timestamp") ? req.body["Received Acknowledgment Timestamp"] :  null,
        "users_invitation_status": body.hasOwnProperty("Invitation Status") ? req.body["Invitation Status"] :  null,
        "users_invitation_delivery_method": body.hasOwnProperty("Invitation Delivery Method") ? req.body["Invitation Delivery Method"] :  null,
        "users_invitation_rewards_id": body.hasOwnProperty("Rewards Id") ? req.body["Rewards Id"] :  null,
        "users_invitation_rewards_object_id": body.hasOwnProperty("Rewards Object Id") ? req.body["Rewards Object Id"] :  null
    }
    users_invitation.create(userInvitationData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'users_invitation', data.users_invitation_id, data.dataValues);
            res.status(201).send({
                msg: "User Invitation Save Successfully",
                invitationID: data.users_invitation_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while adding the User Invitation=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while adding the User Invitation."
            });
        });
}

/**
 * Function to update User Invitation
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateUserInvitation = async(req, res) => {
    const id = req.params.invitationID;
    var usersInvitationDetails = await users_invitation.findOne({
        where: {
            users_invitation_id: id
        }
    });
    users_invitation.update(req.body, {
		returning:true,
        where: {
            users_invitation_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','users_invitation',id,result.dataValues,usersInvitationDetails);
            res.status(200).send({
                message: "Users Invitation updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Users Invitation with id=${id}. Maybe Users Invitation was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Users Invitation with id=" + id);
        res.status(500).send({
            message: "Error updating Users Invitation with id=" + id
        });
    });
};


/**
 * Function to get all user invitation listing
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.userInvitationListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'users_invitation_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    var options = {
        include: [
            {
              model: db.user_profile,
              attributes: ["u_id", ["u_display_name", "username"], ["u_prof_img_path", "user_imgpath"]],
              required: false
            },
            {
                model: db.page_location,
                attributes: ['page_id', 'page_name'],
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
    if (req.query.invitationID) {
        options['where']['users_invitation_id'] = req.query.invitationID;
    }
    if (req.query.recipientUserID) {
        options['where']['users_invitation_recipient_user_id'] = req.query.recipientUserID;
    }
    if (req.query.userID) {
        options['where']['users_invitation_user_id'] = req.query.userID;
    }
    var total = await users_invitation.count({
        where: options['where']
    });
    const user_invitation_listing = await users_invitation.findAll(options);
    res.status(200).send({
        data: user_invitation_listing,
        totalRecords: total
    });
}

/**
 * Function to get specific user invitation listing
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.usersInvitationUserbasedListing = async (req, res) => {
    const sortBy = req.query.sortBy || 'users_invitation_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    var options = {
        include: [
            {
              model: db.user_profile,
              attributes: ["u_id", ["u_display_name", "username"], ["u_prof_img_path", "user_imgpath"]],
              required: false
            },
            {
                model: db.page_location,
                attributes: ['page_id', 'page_name'],
                required: false
            }
        ],
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
    options['where']['users_invitation_user_id'] = req.params.userId;
    const user_invitation_listing = await users_invitation.findAll(options);
    var bonus_task_data = {};
    var survey_data = {};
    if (user_invitation_listing.length) {
        for (var user_invitation_key in user_invitation_listing) {
            if (user_invitation_listing[user_invitation_key].users_invitation_object_id == 1 ) {    // survey
                survey_data[user_invitation_listing[user_invitation_key].users_invitation_recipient_user_id] = user_invitation_listing[user_invitation_key].users_invitation_action_id;
            }
            if (user_invitation_listing[user_invitation_key].users_invitation_object_id == 5 ) {    // bonus task
                bonus_task_data[user_invitation_listing[user_invitation_key].users_invitation_recipient_user_id] = user_invitation_listing[user_invitation_key].users_invitation_action_id;
            }
        }
        var user_ids = Object.keys(survey_data);
        var bonus_user_ids = Object.keys(bonus_task_data);
        var options = {
            attributes: [["sr_hashtags", "task_hashtag"],["sr_enddate_time", "task_endtime"], "sr_title"],
            where: {}
        };
        options['include'] = [
            {
              model: db.survey_user_complete,
             attributes:[["sr_id", "task_event_id"],["sr_completed", "task_status"],["sr_uid", "user_id"]],
              where : {
                sr_uid: user_ids
              }
            }
          ]
        const survey_user_state = await db.survey.findAll(options);
        var allTaskData = {};
        if (survey_user_state.length) {
            for (var survey_key in survey_user_state) {
                var surveyDetail = {};
                var hashtag = survey_user_state[survey_key].dataValues.task_hashtag;
                surveyDetail['task_event_id'] = survey_user_state[survey_key].dataValues.survey_user_completes[0].dataValues.task_event_id;
                
                surveyDetail['task_title'] = survey_user_state[survey_key].dataValues.sr_title;
                surveyDetail['task_status'] = survey_user_state[survey_key].dataValues.survey_user_completes[0].dataValues.task_status;
                surveyDetail['user_id'] = survey_user_state[survey_key].dataValues.survey_user_completes[0].dataValues.user_id;
                if (hashtag.length && Array.isArray(hashtag)) {
                    surveyDetail['task_hashtag'] = hashtag.join();
                } else {
                    surveyDetail['task_hashtag'] = '';
                }
               
                surveyDetail['task_endtime'] = survey_user_state[survey_key].dataValues.task_endtime;
                surveyDetail['task_event_type'] = 'Survey';
                allTaskData[surveyDetail['user_id']+'_'+surveyDetail['task_event_id']] = surveyDetail;
    
            }
        }
        var bonus_options = {
            attributes: [["bonus_task_id", "task_event_id"], ["bonus_task_completion_date", "task_title"], ["bonus_task_is_finished", "task_status"],["bonus_task_usr_id", "user_id"],["bonus_task_hashtag", "task_hashtag"],["bonus_task_completion_date", "task_endtime"]],
            where: {bonus_task_usr_id : bonus_user_ids}
        };
        const bonus_task_result = await db.bonus_task.findAll(bonus_options);
        if (bonus_task_result.length) {
            for (var bonus_task_key in bonus_task_result) {
                bonus_task_result[bonus_task_key].dataValues.task_event_type = "Bonus Task";
                allTaskData[bonus_task_result[bonus_task_key].dataValues.user_id+'_'+bonus_task_result[bonus_task_key].dataValues.task_event_id] = bonus_task_result[bonus_task_key].dataValues;
            }
        }
        for (var user_invitation_key in user_invitation_listing) {
            var user_action_index = user_invitation_listing[user_invitation_key].users_invitation_recipient_user_id+'_'+user_invitation_listing[user_invitation_key].users_invitation_action_id;
            if (allTaskData[user_action_index] != undefined) {
                user_invitation_listing[user_invitation_key].dataValues.invited_tasks = allTaskData[user_action_index];
            }
        }
    }
    res.status(200).send({
        data: user_invitation_listing
    });
}


