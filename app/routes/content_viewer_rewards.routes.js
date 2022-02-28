module.exports = app => {
    const contentViewer = require("../controllers/content_viewer_rewards.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
  /**
   * @swagger
   * /api/content_viewer_reward:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        User Id:
   *                           type: integer
   *                        Video Task Id:
   *                           type: string
   *                           example: "1,2,3"
   *                        Money Pouch Amount:
   *                           type: integer
   *                        Money Pouch Countdown:
   *                            type: integer
   *                        Total Video Watched:
   *                           type: integer
   *     tags:
   *       - Content Viewer Reward
   *     description: Add new Content Viewer Reward
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Content Viewer Reward
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
	 router.post("/content_viewer_reward",auth, contentViewer.AddcontentViewerReward);
  /**
   * @swagger
   * /api/content_viewer_reward:
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
   *              example: cvr_id,user_id,money_pouch_amount,money_pouch_countdown,total_video_watched,cvr_created_at,cvr_updated_at # Example of a parameter value
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
   *       - Content Viewer Reward
   *     description: Returns all Content Viewer Reward
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Content Viewer Reward 
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
    router.get('/content_viewer_reward',auth, contentViewer.contentViewerRewardListing)

   app.use("/api", router);
};
  