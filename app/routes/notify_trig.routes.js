module.exports = app => {
    const NotifyTriggers = require("../controllers/notify_trig.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
  /**
   * @swagger
   * /api/notify/triggers:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
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
   *     tags:
   *       - Notify Triggers
   *     description: Add new Notify Trigger
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Triggers
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
	router.post("/notify/triggers",auth, NotifyTriggers.createNotifyTrigger);
  /**
   * @swagger
   * /api/notify/triggers/{notifyTriggerId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
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
   *                           type: integer
   *                        Ack:
   *                           type: integer
   *                        Trigger Status:
   *                           type: integer
   *                        Push Id:
   *                           type: integer
   *                        Brand Id:
   *                           type: integer
   *     parameters:
   *         - name: notifyTrigId
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Notify Triggers
   *     description: Update Notify Triggers
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Notify Triggers updated
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
   router.put("/notify/triggers/:notifyTriggerId",auth, NotifyTriggers.updateNotifyTrigger);
  /**
   * @swagger
   * /api/notify/triggers:
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
   *              example: notify_trig_id,notify_event_id,notify_method,notify_type,notify_trig_pushalert,notify_trig_msg,notify_trig_grp_id,notify_group_name,notify_send_date,notify_ack,notify_trig_status,notify_trig_push_id,cr_co_id # Example of a parameter value
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
   *       - Notify Triggers
   *     description: Returns all Notify Triggers
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Notify Triggers
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
    router.get('/notify/triggers',auth, NotifyTriggers.notifyTriggerListing)
  /**
   * @swagger
   * /api/notify/triggers/{notifyTriggerId}:
   *   get:
   *     parameters:
   *         - name: notifyTriggerId
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
   *       - Notify Triggers
   *     description: Retrieve a single Notify Trigger with notifyTrigId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Notify Trigger
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
    router.get("/notify/triggers/:notifyTrigId",auth, NotifyTriggers.notifyTriggerDetails);
    app.use("/api", router);
};
  