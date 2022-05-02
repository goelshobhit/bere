module.exports = app => {
    const NotifyObject = require("../controllers/notify_object.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
    const access = require("../middleware/access");
  /**
   * @swagger
   * /api/notify/objects:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Object Name:
   *                            type: string
   *                        Object Description:
   *                            type: string
   *                        Task Id:
   *                            type: integer
   *     tags:
   *       - Notify Objects
   *     description: Add new Notify Objects
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
	router.post("/notify/objects", access, NotifyObject.createNotifyObject);
  /**
   * @swagger
   * /api/notify/objects/{notifyObjectId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        notify_object_name:
   *                            type: string
   *                        notify_object_description:
   *                            type: string
   *                        notify_object_task_id:
   *                            type: integer
   *     parameters:
   *         - name: notifyObjectId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Notify Objects
   *     description: Update Notify Objects
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Notify Objects updated
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
   router.put("/notify/objects/:notifyObjectId", access, NotifyObject.updateNotifyObject);
  /**
   * @swagger
   * /api/notify/objects:
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
   *              example: notify_object_name,notify_object_description,notify_object_task_id   # Example of a parameter value
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
   *       - Notify Objects
   *     description: Returns all Notify Objects
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Notify Objects
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
    router.get('/notify/objects', auth, NotifyObject.NotifyObjectListing)
  /**
   * @swagger
   * /api/notify/objects/{notifyObjectId}:
   *   get:
   *     parameters:
   *         - name: notifyObjectId
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
   *       - Notify Objects
   *     description: Retrieve a single Notify Group with notifyObjectId
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
    router.get("/notify/objects/:notifyObjectId", auth, NotifyObject.NotifyObjectDetails);
  /**
   * @swagger
   * /api/notify/objects/{notifyObjectId}:
   *   delete:
   *     parameters:
   *         - name: notifyObjectId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Notify Objects
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
   router.delete("/notify/objects/:notifyObjectId", access, NotifyObject.deleteNotifyObject);   
    app.use("/api", router);
};
  