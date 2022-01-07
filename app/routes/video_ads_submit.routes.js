module.exports = app => {
  const VideoAdsSubmit = require("../controllers/video_ads_submit.controller.js");
  var router = require("express").Router();
  const auth = require("../middleware/auth");
/**
 * @swagger
 * /api/video_ads_submit:
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
 *                        Video Ads Id:
 *                           type: integer
 *                        Watch Timestamp:
 *                           format: date-time
 *                           example: 2020-09-30
 *                        Watch Completion:
 *                           type: integer
 *                        Submit Timestamp:
 *                           format: date-time
 *                           example: 2020-09-30
 *                        Reward Ack:
 *                           type: integer
 *     tags:
 *       - Video Ads Submit
 *     description: Add new Video Ad
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Add new Video Ads
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
router.post("/video_ads_submit",auth, VideoAdsSubmit.createVideoAdsSubmit);
/**
 * @swagger
 * /api/video_ads_submit/{videoAdsSubmitId}:
 *   put:
 *     requestBody:
 *        required: false
 *        content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        video_ads_submit_watch_timestamp:
 *                            format: date-time
 *                            example: 2020-09-30
 *                        video_ads_submit_watch_completion:
 *                            type: integer
 *                        video_ads_submit_timestamp:
 *                            format: date-time
 *                            example: 2020-09-30
 *                        video_ads_submit_reward_ack:
 *                            type: integer
 *     parameters:
 *         - name: videoAdsSubmitId
 *           in: path
 *           required: true
 *           schema:
 *              type: string
 *     tags:
 *       - Video Ads Submit
 *     description: Update Video Ads Submit
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Video Ads Submit updated
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
 router.put("/video_ads_submit/:videoAdsSubmitId",auth, VideoAdsSubmit.updateVideoAdsSubmit);
/**
 * @swagger
 * /api/video_ads_submit:
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
 *              example: video_ads_name,video_ads_url,video_ads_timestamp,video_ads_lenght_secs,video_ads_status,video_ads_public,video_ads_brand_tier,video_ads_campaign_type,video_ads_budget,video_budget_left,video_tokens_given,video_stars_given,video_tokens_given_value,video_stars_given_value # Example of a parameter value
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
 *       - Video Ads Submit
 *     description: Returns all Video Ads Submit
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of Video Ads Submit
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
  router.get('/video_ads_submit',auth, VideoAdsSubmit.videoAdsSubmitListing)
/**
 * @swagger
 * /api/video_ads_submit/{videoAdsSubmitId}:
 *   get:
 *     parameters:
 *         - name: videoAdsSubmitId
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
 *       - Video Ads Submit
 *     description: Retrieve a single Video Ads Submit with videoAdsSubmitId
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Details of a Video Ads Submit
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
  router.get("/video_ads_submit/:videoAdsSubmitId",auth, VideoAdsSubmit.videoAdsSubmitDetails);
/**
 * @swagger
 * /api/video_ads_submit/{videoAdsSubmitId}:
 *   delete:
 *     parameters:
 *         - name: videoAdsSubmitId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *      - Video Ads Submit
 *     description: Delete a Video Ad Submit with id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Delete a Video Ad Submit
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
 router.delete("/video_ads_submit/:videoAdsSubmitId", auth, VideoAdsSubmit.deleteVideoAdsSubmit);   
  app.use("/api", router);
};
