module.exports = app => {
    const NotifyTriggersSent = require("../controllers/notify_trig_sent.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
  /**
   * @swagger
   * /api/notify/sent/triggers:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Notify Trigger Id:
   *                           type: integer    
   *                        User Id:
   *                           type: integer          
   *                        Event Id:
   *                           type: integer
   *                        Method:
   *                           type: integer
   *                        Pushalert:
   *                           type: integer
   *                        Message:
   *                           type: string
   *                        Group Id:
   *                           type: integer
   *                        Group Name:
   *                           type: integer
   *                        Send Date:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        Ack:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        Trigger Status:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        Push Id:
   *                           type: integer
   *                        Brand Id:
   *                           type: integer
   *                        Notify Object Id:
   *                           type: integer
   *     tags:
   *       - Sent Notify Triggers
   *     description: Add new Sent Notify Trigger
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Sent Trigger
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
	router.post("/notify/sent/triggers",auth, NotifyTriggersSent.createNotifySent);
  /**
   * @swagger
   * /api/notify/sent/triggers/{notifySentTrigId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        notify_trig_id:
   *                           type: integer
   *                        u_id:
   *                           type: integer
   *                        notify_event_id:
   *                           type: integer
   *                        notify_method:
   *                           type: integer
   *                        notify_trig_pushalert:
   *                           type: integer
   *                        notify_trig_msg:
   *                           type: string
   *                        notify_trig_grp_id:
   *                           type: integer
   *                        notify_group_name:
   *                           type: integer
   *                        notify_send_date:
   *                           type: integer
   *                        notify_ack:
   *                           type: integer
   *                        notify_trig_status:
   *                           type: integer
   *                        notify_trig_push_id:
   *                           type: integer
   *                        cr_co_id:
   *                           type: integer
   *                        notify_object_id:
   *                           type: integer
   *     parameters:
   *         - name: notifySentTrigId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Sent Notify Triggers
   *     description: Update a Sent Notify Trigger
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Notify Trigger Sent updated
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
   router.put("/notify/sent/triggers/:notifySentTrigId",auth, NotifyTriggersSent.updateNotifySent);
  /**
   * @swagger
   * /api/notify/sent/triggers/all:
   *   get:
   *     parameters:
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
   *              example: notify_sent_trig_id,u_id,notify_trig_id,notify_event_id,notify_method,notify_type,notify_trig_pushalert,notify_trig_msg,notify_trig_grp_id,notify_group_name,notify_send_date,notify_ack,notify_trig_status,notify_trig_push_id,cr_co_id,notify_object_id # Example of a parameter value
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
   *       - Sent Notify Triggers
   *     description: Returns all Sent Notify Triggers
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Sent Notify Triggers
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
    router.get('/notify/sent/triggers/all',auth, NotifyTriggersSent.notifySentListing)
  /**
   * @swagger
   * /api/notify/sent/triggers:
   *   get:
   *     parameters:
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
   *              example: notify_sent_trig_id,u_id,notify_trig_id,notify_event_id,notify_method,notify_type,notify_trig_pushalert,notify_trig_msg,notify_trig_grp_id,notify_group_name,notify_send_date,notify_ack,notify_trig_status,notify_trig_push_id,cr_co_id # Example of a parameter value
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
   *       - Sent Notify Triggers
   *     description: Returns all Sent Notify Triggers Of The User
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Sent Notify Triggers Of The User
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
   router.get('/notify/sent/triggers',auth, NotifyTriggersSent.notifySentListingOfTheUser)
    /**
   * @swagger
   * /api/notify/sent/triggers/{notifySentTrigId}:
   *   get:
   *     parameters:
   *         - name: notifySentTrigId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
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
   *       - Sent Notify Triggers
   *     description: Retrieve a single Sent Notify Trigger with notifySentTrigId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Sent Notify Trigger
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
    router.get("/notify/sent/triggers/:notifySentTrigId",auth, NotifyTriggersSent.notifySentListing);
  /**
   * @swagger
   * /api/notify/sent/triggers/{notifySentTrigId}:
   *   delete:
   *     parameters:
   *         - name: notifySentTrigId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *      - Sent Notify Triggers
   *     description: Delete a sent notify trigger with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a sent notify trigger
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
   router.delete("/notify/sent/triggers/:notifySentTrigId", auth, NotifyTriggersSent.deleteNotifySent);   
    app.use("/api", router);
};
  