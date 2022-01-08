module.exports = app => {
    const NotifyEvents = require("../controllers/notify_event.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
  /**
   * @swagger
   * /api/notify/events:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Event Name:
   *                            type: integer
   *                        Event Type:
   *                            type: integer
   *                        Brand Id:
   *                            type: integer
   *                        Event Date:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        Event Usrid:
   *                            type: integer
   *                        Event UsrOptin:
   *                            type: integer
   *                        Event UsrOptOut:
   *                            type: integer
   *                        Event UsrOptOut Date:
   *                           type: integer
   *     tags:
   *       - Notify Events
   *     description: Add new Notify Events
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Events
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
	router.post("/notify/events",auth, NotifyEvents.createNotifyEvent);
  /**
   * @swagger
   * /api/notify/events/{notifyEventId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        notify_event_name:
   *                            type: integer
   *                        notify_event_type:
   *                            type: integer
   *                        cr_co_id:
   *                            type: integer
   *                        notify_event_date:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        notify_event_usrid:
   *                            type: integer
   *                        notify_event_usrOptin:
   *                            type: integer
   *                        notify_event_usrOptOut:
   *                            type: integer
   *                        notify_event_usrOptOut_date:
   *                           type: integer
   *     parameters:
   *         - name: notifyEventId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Notify Events
   *     description: Update Notify Events
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Notify Events updated
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
   router.put("/notify/events/:notifyEventId",auth, NotifyEvents.updateNotifyEvent);
  /**
   * @swagger
   * /api/notify/events:
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
   *              example: notify_event_id,notify_event_name,notify_event_type,cr_co_id,notify_event_date,notify_event_usrid,notify_event_usrOptin,notify_event_usrOptOut,notify_event_usrOptOut_date # Example of a parameter value
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
   *       - Notify Events
   *     description: Returns all Notify Events
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Notify Events
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
    router.get('/notify/events',auth, NotifyEvents.notifyEventListing)
  /**
   * @swagger
   * /api/notify/events/{notifyEventId}:
   *   get:
   *     parameters:
   *         - name: notifyEventId
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
   *       - Notify Events
   *     description: Retrieve a single Notify Event with notifyEventId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Notify Event
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
    router.get("/notify/events/:notifyEventId",auth, NotifyEvents.notifyEventDetails);
   /**
   * @swagger
   * /api/notify/events/{notifyEventId}:
   *   delete:
   *     parameters:
   *         - name: notifyEventId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Notify Events
   *     description: Delete a notify event with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a notify event
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
    router.delete("/notify/events/:notifyEventId", auth, NotifyEvents.deleteNotifyEvent); 
    app.use("/api", router);
};
  