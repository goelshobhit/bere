module.exports = app => {
    const VideoAds = require("../controllers/video_ads.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
  /**
   * @swagger
   * /api/video_ads:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Brand Id:
   *                           type: integer
   *                        Ads Name:
   *                           type: integer
   *                        Ads Url:
   *                           type: integer
   *                        Ads Timestamp:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        Ads Lenght Secs:
   *                           type: integer
   *                        Ads Status:
   *                           type: integer
   *                        Ads Brand Tier:
   *                             type: integer
   *                        Ads Campaign Type:
   *                             type: integer
   *                        Ads Budget:
   *                            type: integer
   *                        Budget Left:
   *                           type: integer
   *                        Tokens Given:
   *                           type: integer
   *                        Stars Given:
   *                           type: integer
   *                        Tokens Given Value:
   *                           type: integer
   *                        Stars Given Value:
   *                           type: integer
   *     tags:
   *       - Video Ads
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
	 router.post("/video_ads",auth, VideoAds.createVideoAds);
  /**
   * @swagger
   * /api/video_ads/{videoAdsId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Brand Id:
   *                           type: integer
   *                        Ads Name:
   *                           type: integer
   *                        Ads Url:
   *                           type: integer
   *                        Ads Timestamp:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        Ads Lenght Secs:
   *                           type: integer
   *                        Ads Status:
   *                           type: integer
   *                        Ads Brand Tier:
   *                            type: integer
   *                        Ads Campaign Type:
   *                             type: integer
   *                        Ads Budget:
   *                             type: integer
   *                        Budget Left:
   *                           type: integer
   *                        Tokens Given:
   *                           type: integer
   *                        Stars Given:
   *                           type: integer
   *                        Tokens Given Value:
   *                           type: integer
   *                        Stars Given Value:
   *                           type: integer
   *     parameters:
   *         - name: videoAdsId
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Video Ads
   *     description: Update Video Ads
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Video Ads updated
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
   router.put("/video_ads/:videoAdsId",auth, VideoAds.updateVideoAds);
  /**
   * @swagger
   * /api/video_ads:
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
   *       - Video Ads
   *     description: Returns all Video Ads
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Video Ads
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
    router.get('/video_ads',auth, VideoAds.videoAdsListing)
  /**
   * @swagger
   * /api/video_ads/{videoAdsId}:
   *   get:
   *     parameters:
   *         - name: videoAdsId
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
   *       - Video Ads
   *     description: Retrieve a single Video Ad with videoAdsId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Video Ad
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
    router.get("/video_ads/:videoAdsId",auth, VideoAds.videoAdsDetails);
  /**
   * @swagger
   * /api/video_ads/{videoAdsId}:
   *   delete:
   *     parameters:
   *         - name: videoAdsId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *      - Video Ads
   *     description: Delete a Video Ad with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a Video Ad
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
   router.delete("/video_ads/:videoAdsId", auth, VideoAds.deleteVideoAds);   
   app.use("/api", router);
};
  