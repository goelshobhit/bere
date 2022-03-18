module.exports = app => {
    const NotifyCat = require("../controllers/notify_cat.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
  /**
   * @swagger
   * /api/notify/categories:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Category Name:
   *                            type: string
   *                        Category Description:
   *                            type: string
   *                        Delivery Method:
   *                            type: integer
   *     tags:
   *       - Notify Categories
   *     description: Add new Notify categories
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new categories
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
	router.post("/notify/categories", auth, NotifyCat.createNotifyCat);
  /**
   * @swagger
   * /api/notify/categories/{notifyTrigCatId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        notify_cat_name:
   *                            type: string
   *                        notify_cat_description:
   *                            type: string
   *                        notify_cat_deliv_method:
   *                            type: integer
   *     parameters:
   *         - name: notifyTrigCatId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Notify Categories
   *     description: Update Notify categories
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Notify categories updated
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
   router.put("/notify/categories/:notifyTrigCatId", auth, NotifyCat.updateNotifyCat);
  /**
   * @swagger
   * /api/notify/categories:
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
   *              example: notify_trig_cat_id,notify_cat_name,notify_cat_description,notify_cat_deliv_method,notify_trig_grp_sentdate   # Example of a parameter value
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
   *       - Notify Categories
   *     description: Returns all Notify categories
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Notify categories
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
    router.get('/notify/categories', auth, NotifyCat.NotifyCatListing)
  /**
   * @swagger
   * /api/notify/categories/{notifyTrigCatId}:
   *   get:
   *     parameters:
   *         - name: notifyTrigCatId
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
   *       - Notify Categories
   *     description: Retrieve a single Notify Group with notifyTrigCatId
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
    router.get("/notify/categories/:notifyTrigCatId", auth, NotifyCat.NotifyCatDetails);
  /**
   * @swagger
   * /api/notify/categories/{notifyTrigCatId}:
   *   delete:
   *     parameters:
   *         - name: notifyTrigCatId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Notify Categories
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
   router.delete("/notify/categories/:notifyTrigCatId", auth, NotifyCat.deleteNotifyCat);   
    app.use("/api", router);
};
  