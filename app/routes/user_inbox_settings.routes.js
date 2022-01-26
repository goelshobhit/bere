module.exports = app => {
    const UserInboxSettings = require("../controllers/user_inbox_settings.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
  /**
   * @swagger
   * /api/notify/settings:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        User Id:
   *                            type: integer
   *                        Settings Data:
   *                            type: string
   *     tags:
   *       - Notify Settings
   *     description: Add new Notify Settings
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new settings
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
	router.post("/notify/settings", auth, UserInboxSettings.createUserInboxSettings);
  /**
   * @swagger
   * /api/notify/settings/{userInboxSettingsId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        u_id:
   *                            type: string
   *                        settings_data:
   *                            type: string
   *     parameters:
   *         - name: notifyTrigCatId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Notify Settings
   *     description: Update Notify Settings
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Notify Settings updated
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
   router.put("/notify/settings/:userInboxSettingsId", auth, UserInboxSettings.updateUserInboxSettings);
  /**
   * @swagger
   * /api/notify/settings:
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
   *              example: user_inbox_settings_id,u_id,settings_data  # Example of a parameter value
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
   *       - Notify Settings
   *     description: Returns all Notify Settings
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Notify Settings
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
    router.get('/notify/settings', auth, UserInboxSettings.UserInboxSettingsListing)
  /**
   * @swagger
   * /api/notify/settings/{userInboxSettingsId}:
   *   get:
   *     parameters:
   *         - name: userInboxSettingsId
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
   *       - Notify Settings
   *     description: Retrieve a single notify setting with notifyTrigGrpId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a notify setting
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
    router.get("/notify/settings/:userInboxSettingsId", auth, UserInboxSettings.UserInboxSettingsDetails);
  /**
   * @swagger
   * /api/notify/settings/{userInboxSettingsId}:
   *   delete:
   *     parameters:
   *         - name: userInboxSettingsId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Notify Settings
   *     description: Delete a notify setting with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a notify setting
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
   router.delete("/notify/settings/:userInboxSettingsId", auth, UserInboxSettings.deleteUserInboxSettings);   
   app.use("/api", router);
};
  