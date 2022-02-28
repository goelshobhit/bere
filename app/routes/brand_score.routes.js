module.exports = app => {
    const BrandScore = require("../controllers/brand_score.controller.js");
    var router = require("express").Router();
	const auth = require("../middleware/auth");
	
	/**
   * @swagger
   * /api/brandscore_task:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Brand Id:
   *                            type: integer
   *                        Task Id:
   *                            type: integer
   *                        User Id:
   *                            type: integer
   *                        Reach Count:
   *                            type: integer
   *                        Comments Count:
   *                            type: integer
   *                        Pics Count:
   *                            type: integer
   *                        Video Count:
   *                            type: integer
   *                        Likes Count:
   *                            type: integer
   *                        Hashtag Name:
   *                            type: string
   *                        Total Tickets Count:
   *                            type: integer
   *                        Task Name:
   *                            type: string
   *                        Award Unlock:
   *                            type: integer
   *                        Award Lock:
   *                            type: integer
   *                        Award Limit Count:
   *                            type: integer
   *                        Score Count:
   *                            type: integer
   *     tags:
   *       - Brand Score
   *     description: Add new Brand Score Task Detail
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Brand Score Task Detail
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
  router.post("/brandscore_task",auth, BrandScore.AddBrandScoreTask);

  	/**
   * @swagger
   * /api/brandscore_engagement_type:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Engagement Type:
   *                            type: string
   *     tags:
   *       - Brand Score
   *     description: Add new Brand Score Engagment Type
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Brand Score Engagment Type
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
  router.post("/brandscore_engagement_type",auth, BrandScore.AddEngagementType);

  // UPDATE brandscore Engagement_Type
    /** 
     * @swagger
     * /api/brandscore_engagement_type/{engagementId}:
     *  put:
     *      requestBody:
     *          required: false
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          engagement_type:
     *                              type: string
	 *      parameters:
     *         - name: engagementId
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *      tags:
     *          - Brand Score
     *      description: Update brand Engagement Type
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: Update brand Engagement Type
     *          422:
     *              description: validation errors
     *          500:
     *              description: Internal server error
     *          401:
     *              description: Unauthorized
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: Authorisation Required                      
    */

   router.put("/brandscore_engagement_type/:engagementId",auth,BrandScore.updateEngagementType)

   /**
   * @swagger
   * /api/brandscore_engagement_type/{engagementId}:
   *   delete:
   *     parameters:
   *         - name: engagementId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *      - Brand Score
   *     description: Delete Brandscore Engagement Type with engagementId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete Brandscore Engagement Type
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
  router.delete("/brandscore_engagement_type/:engagementId", auth, BrandScore.deleteEngagementType);

   // Retrieve all Brandscore engagement Types
    /**
     * @swagger
     * /api/brandscore_engagement_type:
     *   get:
     *     parameters:
     *         - name: engagementId
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
     *              example: engagement_id,engagement_type,et_created_at,et_updated_at    # Example of a parameter value
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
     *       - Brand Score
     *     description: Returns all Engagement Type
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Engagement Type
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
    router.get('/brandscore_engagement_type', auth, BrandScore.EngagementTypelisting)

  	/**
   * @swagger
   * /api/brandscore_engagement_settings:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Engagement Id:
   *                            type: integer
   *                        Engagement Level:
   *                            type: integer
   *                        Brand Score:
   *                            type: integer
   *     tags:
   *       - Brand Score
   *     description: Add Brand Score Engagment Settings
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add Brand Score Engagment Settings
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
  router.post("/brandscore_engagement_settings",auth, BrandScore.AddEngagementSettings);

  // Retrieve all Brandscore Settings
    /**
     * @swagger
     * /api/brandscore_engagement_settings:
     *   get:
     *     parameters:
     *         - name: engagementSettingId
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
     *              example: bes_id,engagement_id,engagement_level,brand_score,bes_created_at,bes_updated_at    # Example of a parameter value
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
     *       - Brand Score
     *     description: Returns all Engagement Settings
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Engagement Settings
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
    router.get('/brandscore_engagement_settings', auth, BrandScore.engagementSettinglisting)

   // UPDATE brandscore Engagement Settings
    /** 
     * @swagger
     * /api/brandscore_engagement_settings/{engagementSettingId}:
     *  put:
     *      requestBody:
     *          required: false
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          engagement_id:
     *                              type: integer
     *                          engagement_level:
     *                              type: integer
     *                          brand_score:
     *                              type: integer
	 *      parameters:
     *         - name: engagementSettingId
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *      tags:
     *          - Brand Score
     *      description: Update Brand Engagement Settings
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: Update Brand Engagement Settings
     *          422:
     *              description: validation errors
     *          500:
     *              description: Internal server error
     *          401:
     *              description: Unauthorized
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: Authorisation Required                      
    */

   router.put("/brandscore_engagement_settings/:engagementSettingId",auth,BrandScore.updateEngagementSettings)

   /**
   * @swagger
   * /api/brandscore_engagement_settings/{engagementSettingId}:
   *   delete:
   *     parameters:
   *         - name: engagementSettingId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *      - Brand Score
   *     description: Delete Brandscore Engagement settings with engagementSettingId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete Brandscore Engagement settings
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
  router.delete("/brandscore_engagement_settings/:engagementSettingId", auth, BrandScore.deleteEngagementSettings);

  /**
   * @swagger
   * /api/brandscore_increase:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Brand Id:
   *                            type: integer
   *                        User Id:
   *                            type: integer
   *                        Event Id:
   *                            type: integer
   *                        Event Type:
   *                            type: string
   *                            example: "Task, Contest, Survey"
   *                        Event Hashtag:
   *                            type: string
   *                        Event Engagement Id:
   *                            type: integer
   *                        Platform Id:
   *                            type: integer
   *                        Brandscore User Score Increase:
   *                            type: integer
   *     tags:
   *       - Brand Score
   *     description: Increase Brand Score
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Increase Brand Score 
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
  router.post("/brandscore_increase",auth, BrandScore.IncreaseBrandScore);

  // Retrieve all Brandscore task
    /**
     * @swagger
     * /api/brandscore_increase:
     *   get:
     *     parameters:
     *         - name: brandscoreIncreaseId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: brandId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: userId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: eventId
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
     *              example: brandscore_increase_id,brand_id,user_id,event_id,event_engagement_id,platform_id,brandscore_user_score_increase,bi_created_at,bi_updated_at    # Example of a parameter value
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
     *       - Brand Score
     *     description: Returns all brandscore Increase
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of brandscore Increase
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
    router.get('/brandscore_increase', auth, BrandScore.brandscoreIncreaselisting)

  // UPDATE brandscore Engagement Settings
    /** 
     * @swagger
     * /api/brandscore_increase/{brandscoreIncreaseId}:
     *  put:
     *      requestBody:
     *          required: false
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          brand_id:
     *                              type: integer
     *                          user_id:
     *                              type: integer
     *                          event_id:
     *                              type: integer
     *                          event_type:
     *                              type: string
     *                          event_hashtag:
     *                              type: string
     *                          event_engagement_id:
     *                              type: integer
     *                          platform_id:
     *                              type: integer
     *                          brandscore_user_score_increase:
     *                              type: integer
	 *      parameters:
     *         - name: brandscoreIncreaseId
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *      tags:
     *          - Brand Score
     *      description: Update Brand Score Increase
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: Update Brand Score Increase
     *          422:
     *              description: validation errors
     *          500:
     *              description: Internal server error
     *          401:
     *              description: Unauthorized
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: Authorisation Required                      
    */

   router.put("/brandscore_increase/:brandscoreIncreaseId",auth,BrandScore.updateIncreaseBrandScore)

  	/**
   * @swagger
   * /api/brandscore_task/{brandScoreId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Brand Id:
   *                            type: integer
   *                        Task Id:
   *                            type: integer
   *                        User Id:
   *                            type: integer
   *                        Reach Count:
   *                            type: integer
   *                        Comments Count:
   *                            type: integer
   *                        Pics Count:
   *                            type: integer
   *                        Video Count:
   *                            type: integer
   *                        Likes Count:
   *                            type: integer
   *                        Hashtag Name:
   *                            type: string
   *                        Total Tickets Count:
   *                            type: integer
   *                        Task Name:
   *                            type: string
   *                        Award Unlock:
   *                            type: integer
   *                        Award Lock:
   *                            type: integer
   *                        Award Limit Count:
   *                            type: integer
   *                        Score Count:
   *                            type: integer
   *     tags:
   *       - Brand Score
   *     description: Update new Brand Score Task Detail
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Update new Brand Score Task Detail
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
  router.put("/brandscore_task/:brandScoreId",auth, BrandScore.updateBrandScoreTask);

  // Retrieve all Brandscore task
    /**
     * @swagger
     * /api/brandscore_task:
     *   get:
     *     parameters:
     *         - name: taskId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: brandId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: userId
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
     *              example: brandscore_id,brandscore_brand_id,brandscore_task_id,brandscore_task_reach_count,brandscore_task_comments_count,brandscore_task_pics_count,brandscore_task_video_count,brandscore_task_likes_count,brandscore_task_name,brandscore_task_tot_tickets_count    # Example of a parameter value
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
     *       - Brand Score
     *     description: Returns all BrandScore Task
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of BrandScore Task
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
    router.get('/brandscore_task', auth, BrandScore.brandScoreTasklisting)
  
  /**
   * @swagger
   * /api/brandscore:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Brand Id:
   *                            type: integer
   *                        Task Id:
   *                            type: integer
   *                        User Id:
   *                            type: integer
   *                        Reach Score:
   *                            type: integer
   *                        Comments Score:
   *                            type: integer
   *                        Pics Count Score:
   *                            type: integer
   *                        Video Count Score:
   *                            type: integer
   *                        Likes Count Score:
   *                            type: integer
   *                        Hashtag Name Score:
   *                            type: string
   *                        Total Tickets Count Score:
   *                            type: integer
   *                        Task Name:
   *                            type: string
   *                        Award lock Count Score:
   *                            type: integer
   *                        Award Limit Count:
   *                            type: integer
   *                        Score Total Count:
   *                            type: integer
   *                        Riddim Reach:
   *                            type: integer
   *                        Riddim Engagment:
   *                            type: integer
   *                        Share Off Riddim:
   *                            type: integer
   *                        Post Deletion:
   *                            type: integer
   *                        Brand Vote:
   *                            type: integer
   *                        Video Uploaded:
   *                            type: string
   *                        Score Decrease Del Post:
   *                            type: integer
   *     tags:
   *       - Brand Score
   *     description: Add new Brand Score Detail
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Brand Score Detail
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
  router.post("/brandscore",auth, BrandScore.AddBrandScore);

    /**
   * @swagger
   * /api/brandscore/{brandScoreId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Brand Id:
   *                            type: integer
   *                        Task Id:
   *                            type: integer
   *                        User Id:
   *                            type: integer
   *                        Reach Score:
   *                            type: integer
   *                        Comments Score:
   *                            type: integer
   *                        Pics Count Score:
   *                            type: integer
   *                        Video Count Score:
   *                            type: integer
   *                        Likes Count Score:
   *                            type: integer
   *                        Hashtag Name Score:
   *                            type: string
   *                        Total Tickets Count Score:
   *                            type: integer
   *                        Task Name:
   *                            type: string
   *                        Award lock Count Score:
   *                            type: integer
   *                        Award Limit Count:
   *                            type: integer
   *                        Score Total Count:
   *                            type: integer
   *                        Riddim Reach:
   *                            type: integer
   *                        Riddim Engagment:
   *                            type: integer
   *                        Share Off Riddim:
   *                            type: integer
   *                        Post Deletion:
   *                            type: integer
   *                        Brand Vote:
   *                            type: integer
   *                        Video Uploaded:
   *                            type: string
   *                        Score Decrease Del Post:
   *                            type: integer
   *     tags:
   *       - Brand Score
   *     description: Update new Brand Score
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Update new Brand Score
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
  router.put("/brandscore/:brandScoreId",auth, BrandScore.updateBrandScore);
  
  // Retrieve all Brandscore
    /**
     * @swagger
     * /api/brandscore:
     *   get:
     *     parameters:
     *         - name: taskId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: brandId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: userId
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
     *              example: brandscore_id,brandscore_brand_id,brandscore_task_id,brandscore_user_id,brandscore_task_reach_score,brandscore_task_comments_score,brandscore_task_pics_count_score,brandscore_task_video_count_score,brandscore_task_likes_count_score,brandscore_task_hashtag_name_score,brandscore_task_hashtag_name_score,brandscore_task_name,brandscore_task_award_lock_count_score,brandscore_task_award_limit_count,brandscore_score_total_count    # Example of a parameter value
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
     *       - Brand Score
     *     description: Returns all BrandScore Task
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of BrandScore Task
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
    router.get('/brandscore', auth, BrandScore.brandScoreListing);

    /**
   * @swagger
   * /api/brandscore_task/{brandScoreId}:
   *   delete:
   *     parameters:
   *         - name: brandScoreId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Brand Score 
   *     description: Delete Brand Score Task with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete Brand Score Task with id
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
   router.delete("/brandscore_task/:brandScoreId", auth,BrandScore.deleteBrandScoreTask);

    /**
   * @swagger
   * /api/brandscore/{brandScoreId}:
   *   delete:
   *     parameters:
   *         - name: brandScoreId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Brand Score
   *     description: Delete Brand Score with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete Brand Score with id
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
  router.delete("/brandscore/:brandScoreId", auth,BrandScore.deleteBrandScore);
	  app.use("/api", router);
  };
  