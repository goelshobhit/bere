module.exports = app => {
    const users_invitation = require("../controllers/users_invitation.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    /**
   * @swagger
   * /api/users_invitation:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Invitation User Id:
   *                           type: integer
   *                        Page Id:
   *                           type: integer
   *                        Invitation Object Id:
   *                           type: string
   *                        Invitation Action Id:
   *                            format: integer
   *                        Invitation Recipient Email:
   *                            type: string
   *                        Invitation Recipient Mobile:
   *                            type: integer
   *                        Invitation Url:
   *                           type: string
   *                        Recipient User Id:
   *                             type: integer
   *                        Invitation Timestamp:
   *                            type: string
   *                            format: date-time
   *                            example: 2022-03-17
   *                        Received Acknowledgment Timestamp:
   *                            type: string
   *                            format: date-time
   *                            example: 2022-03-17
   *                        Invitation Status:
   *                             type: integer
   *                        Invitation Delivery Method:
   *                             type: integer
   *                        Rewards Id:
   *                             type: integer
   *                        Rewards Object Id:
   *                             type: integer
   *     tags:
   *       - Users Invitation
   *     description: Save User Invitation
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Save User Invitation
   *       422:
   *         description: validation errors
   *       500:
   *         description: Internal server error
   *       401:
   *          description: Unauthorized
   *          content:
   *              application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                          message:
   *                              type: string
   *                              example: Authorisation Required
   */
    router.post("/users_invitation", auth, users_invitation.userInvitation);

/**
 * @swagger
 * /api/users_invitation/{invitationID}:
 *   put:
 *     requestBody:
 *        required: false
 *        content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        users_invitation_user_id:
 *                            format: integer
 *                        users_invitation_page_id:
 *                            type: integer
 *                        users_invitation_object_id:
 *                            type: integer
 *                            example: "1: Survey,2: Task,3: Contest, 4: App, 5= Bonus Task"
 *                        users_invitation_action_id:
 *                            type: integer
 *                        users_invitation_recipient_email:
 *                            type: string
 *                        users_invitation_recipient_mobile:
 *                            type: integer
 *                        users_invitation_url:
 *                            type: string
 *                        users_invitation_recipient_user_id:
 *                            type: integer
 *                        users_invitation_invitation_timestamp:
 *                            type: string
 *                            format: date-time
 *                            example: 2022-03-17
 *                        users_invitation_received_acknowledgment_timestamp:
 *                            type: string
 *                            format: date-time
 *                            example: 2022-03-17
 *                        users_invitation_status:
 *                            type: integer
 *                        users_invitation_delivery_method:
 *                            type: integer
 *                        users_invitation_rewards_id:
 *                            type: integer
 *                        users_invitation_rewards_object_id:
 *                            type: integer
 *     parameters:
 *         - name: invitationID
 *           in: path
 *           required: true
 *           schema:
 *              type: string
 *     tags:
 *       - Users Invitation
 *     description: Update User Invitation
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: User Invitation updated
 *       422:
 *         description: validation errors
 *       500:
 *         description: Internal server error
 *       401:
 *          description: Unauthorized
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: Authorisation Required
 */
 router.put("/users_invitation/:invitationID",auth, users_invitation.updateUserInvitation);
    

    // Retrieve all user invitation listing
    /**
     * @swagger
     * /api/users_invitation:
     *   get:
     *     parameters:
     *         - name: invitationID
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: userID
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: recipientUserID
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: pageNumber
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: sortBy
     *           in: query
     *           required: false
     *           schema:
     *              type: string
     *              example: users_invitation_id,users_invitation_user_id,users_invitation_page_id,users_invitation_object_id,users_invitation_action_id,users_invitation_recipient_email,users_invitation_recipient_mobile,users_invitation_url,users_invitation_recipient_user_id,users_invitation_invitation_timestamp,users_invitation_status,users_invitation_delivery_method,users_invitation_rewards_id    # Example of a parameter value
     *         - name: sortOrder
     *           in: query
     *           required: false
     *           schema:
     *              type: string
     *              example: ASC,DESC    # Example of a parameter value
     *         - name: sortVal
     *           in: query
     *           required: false
     *           schema:
     *              type: string
     *     tags:
     *       - Users Invitation
     *     description: Returns all User Invitation listing
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of User Invitations
     *       401:
     *          description: Unauthorized
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          message:
     *                              type: string
     *                              example: Authorisation Required
     */
    router.get('/users_invitation', auth, users_invitation.userInvitationListing)

    /**
   * @swagger
   * /api/users_invitation/{userId}:
   *   get:
   *     parameters:
   *         - name: userId
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *         - name: pageSize
   *           in: query
   *           required: false
   *           schema:
   *              type: integer
   *         - name: pageNumber
   *           in: query
   *           required: false
   *           schema:
   *              type: integer
   *     tags:
   *       - Users Invitation
   *     description: Retrieve listing with userId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Listing to see which invited user has started or completed the task
   *       401:
   *          description: Unauthorized
   *          content:
   *              application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                          message:
   *                              type: string
   *                              example: Authorisation Required
   */
  router.get("/users_invitation/:userId",auth, users_invitation.usersInvitationUserbasedListing);

    
  app.use("/api", router);
};