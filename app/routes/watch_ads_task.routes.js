module.exports = app => {
    const watchAdsTask = require("../controllers/watch_ads_task.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
    const access = require("../middleware/access");
  /**
   * @swagger
   * /api/watch_ads_task:
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
   *                        Task Name:
   *                           type: integer
   *                        Task Url:
   *                           type: integer
   *                        Task Timestamp:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        Task Lenght Secs:
   *                           type: integer
   *                        Task Status:
   *                           type: integer
   *                        Task Brand Tier:
   *                             type: integer
   *                        Campaign Type:
   *                             type: integer
   *                        Budget:
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
   *                        Video Thumbnail:
   *                           type: string
   *                        Audience:
   *                           type: integer
   *                        Start Date:
   *                            type: string
   *                            format: date-time
   *                            example: 2022-06-01
   *                        End Date:
   *                            type: string
   *                            format: date-time
   *                            example: 2020-07-30
   *     tags:
   *       - Watch Ads Task
   *     description: Add new Watch Add task
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Watch Add task
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
	 router.post("/watch_ads_task",access, watchAdsTask.createWatchAdsTask);
  /**
   * @swagger
   * /api/watch_ads_task/{watchAdsTaskId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        brand_id:
   *                           type: integer
   *                        task_name:
   *                           type: integer
   *                        task_url:
   *                           type: integer
   *                        task_timestamp:
   *                           format: date-time
   *                           example: 2020-09-30
   *                        task_status:
   *                           type: integer
   *                        brand_tier:
   *                            type: integer
   *                        campaign_type:
   *                             type: integer
   *                        budget:
   *                             type: integer
   *                        budget_left:
   *                           type: integer
   *                        tokens_given:
   *                           type: integer
   *                        stars_given:
   *                           type: integer
   *                        tokens_given_value:
   *                           type: integer
   *                        stars_given_value:
   *                           type: integer
   *                        video_thumbnail:
   *                           type: string
   *                        audience:
   *                           type: integer
   *                        start_date:
   *                            type: string
   *                            format: date-time
   *                            example: 2022-06-01
   *                        end_date:
   *                            type: string
   *                            format: date-time
   *                            example: 2020-07-30
   *     parameters:
   *         - name: watchAdsTaskId
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Watch Ads Task
   *     description: Update Watch Ads Task
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Watch Ads Task updated
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
   router.put("/watch_ads_task/:watchAdsTaskId",access, watchAdsTask.updatewatchAdsTask);
  /**
   * @swagger
   * /api/watch_ads_task:
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
   *              example: task_name,task_url,task_timestamp,task_lenght_secs,task_status,task_public,brand_tier,task_campaign_type,task_budget,budget_left,tokens_given,stars_given,tokens_given_value,stars_given_value # Example of a parameter value
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
   *       - Watch Ads Task
   *     description: Returns all Watch Ads Task
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Watch Ads Task
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
    router.get('/watch_ads_task',auth, watchAdsTask.WatchAdsTaskListing)
  /**
   * @swagger
   * /api/watch_ads_task/{watchAdsTaskId}:
   *   get:
   *     parameters:
   *         - name: watchAdsTaskId
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
   *       - Watch Ads Task
   *     description: Retrieve a single Video Ad with watchAdsTaskId
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
    router.get("/watch_ads_task/:watchAdsTaskId",auth, watchAdsTask.watchAdsTaskDetails);
  /**
   * @swagger
   * /api/watch_ads_task/brand/{crCoId}:
   *   get:
   *     parameters:
   *         - name: crCoId
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
   *       - Watch Ads Task
   *     description: Retrieve a single Video Ad with crCoId
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
   router.get("/watch_ads_task/brand/:crCoId",auth, watchAdsTask.watchAdsTaskDetailsUsingCrCoId);
    /**
   * @swagger
   * /api/watch_ads_task/{watchAdsTaskId}:
   *   delete:
   *     parameters:
   *         - name: watchAdsTaskId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *      - Watch Ads Task
   *     description: Delete a watch Ad task with id
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
   router.delete("/watch_ads_task/:watchAdsTaskId", access, watchAdsTask.deletewatchAdsTask);   
   app.use("/api", router);
};
  