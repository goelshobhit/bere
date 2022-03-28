module.exports = app => {
    const content_feedback_settings = require("../controllers/content_feedback_settings.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    /**
   * @swagger
   * /api/content_feedback_settings:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        User Percentage:
   *                           type: number
   *                        Shown Days:
   *                           type: integer
   *     tags:
   *       - Content Feedback Settings
   *     description: Add Content Feedback Settings
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add Content Feedback Settings
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
    router.post("/content_feedback_settings", auth, content_feedback_settings.addContentFeedbackSettings);

    

    // Retrieve all Content Feedback Settings Listing
    /**
     * @swagger
     * /api/content_feedback_settings:
     *   get:
     *     parameters:
     *         - name: cfsId
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
     *              example: cfs_id,popup_shown_user_percentage,popup_shown_days    # Example of a parameter value
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
     *       - Content Feedback Settings
     *     description: Returns all Content Feedback Settings
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Content Feedback Settings
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
    router.get('/content_feedback_settings', auth, content_feedback_settings.feedbackSettingListing);


  /**
 * @swagger
 * /api/content_feedback_settings/{cfsId}:
 *   put:
 *     requestBody:
 *        required: false
 *        content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        popup_shown_user_percentage:
 *                            type: number
 *                        popup_shown_days:
 *                            type: integer
 *     parameters:
 *         - name: cfsId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *       - Content Feedback Settings
 *     description: Update Content Feedback Settings
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Content Feedback Settings updated
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
 router.put("/content_feedback_settings/:cfsId",auth, content_feedback_settings.updateFeedbackSettings);

 /**
 * @swagger
 * /api/content_feedback_settings/{cfsId}:
 *   delete:
 *     parameters:
 *         - name: cfsId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *      - Content Feedback Settings
 *     description: Delete Content Feedback Settings with id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Delete Content Feedback Settings
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
router.delete("/content_feedback_settings/:cfsId", auth, content_feedback_settings.deleteFeedbackSettings);
    
  app.use("/api", router);
};