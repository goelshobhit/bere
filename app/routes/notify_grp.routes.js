module.exports = app => {
    const NotifyGrp = require("../controllers/notify_grp.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
  /**
   * @swagger
   * /api/notify/groups:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Group Name:
   *                            type: integer
   *                        Delivery Method:
   *                            type: integer
   *                        Sent Date:
   *                            type: string
   *                            format: date-time
   *                            example: 2020-09-30
   *     tags:
   *       - Notify Groups
   *     description: Add new Notify Groups
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Groups
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
	router.post("/notify/groups", auth, NotifyGrp.createNotifyGrp);
  /**
   * @swagger
   * /api/notify/groups/{notifyTrigGrpId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Group Name:
   *                            type: integer
   *                        Delivery Method:
   *                            type: integer
   *                        Sent Date:
   *                            type: string
   *                            format: date-time
   *                            example: 2020-09-30
   *     parameters:
   *         - name: notifyTrigGrpId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Notify Groups
   *     description: Update Notify Groups
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Notify Groups updated
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
   router.put("/notify/groups/:notifyTrigGrpId", auth, NotifyGrp.updateNotifyGrp);
  /**
   * @swagger
   * /api/notify/groups:
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
   *              example: notify_trig_grp_id,notify_grp_name,notify_grp_deliv_method,notify_trig_grp_sentdate   # Example of a parameter value
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
   *       - Notify Groups
   *     description: Returns all Notify Groups
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Notify Groups
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
    router.get('/notify/groups', auth, NotifyGrp.notifyGrpListing)
  /**
   * @swagger
   * /api/notify/groups/{notifyTrigGrpId}:
   *   get:
   *     parameters:
   *         - name: notifyTrigGrpId
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
   *       - Notify Groups
   *     description: Retrieve a single Notify Group with notifyTrigGrpId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Notify Group
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
    router.get("/notify/groups/:notifyTrigGrpId", auth, NotifyGrp.notifyGrpDetails);
  /**
   * @swagger
   * /api/notify/groups/{notifyTrigGrpId}:
   *   delete:
   *     parameters:
   *         - name: notifyTrigGrpId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Notify Groups
   *     description: Delete a notify group with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a notify group
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
   router.delete("/notify/groups/:notifyTrigGrpId", auth, NotifyGrp.deleteNotifyGrp);   
    app.use("/api", router);
};
  