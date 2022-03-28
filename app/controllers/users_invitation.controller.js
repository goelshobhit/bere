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
    var total = await users_invitation.count({
        where: options['where']
    });
    const users_invitation_list = await users_invitation.findAll(options);
    res.status(200).send({
        data: users_invitation_list,
        totalRecords: total
    });
}


