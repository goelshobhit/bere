module.exports = app => {
  const Tasks = require("../controllers/tasks.controller.js");
  var router = require("express").Router();
  const auth = require("../middleware/auth");
  const access = require("../middleware/access");
  const imgAuth = require("../middleware/imgAuth");
  require("dotenv").config();
  const appConfig = require("../config/config.js");
  const env = process.env.NODE_ENV || "development";
  const adminValidate = require("../middleware/adminValidate");

  /**
   * @swagger
   * /api/tasks:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Task name:
   *                            type: string
   *                        Task Header Image:
   *                            type: string
   *                        Campaign id:
   *                            type: integer
   *                        Brand Id:
   *                            type: integer
   *                        Task type:
   *                            type: integer
   *                            example: "1: video,2: image,3: sound,4: versus ( we provide first half of sound/ makes second half of sound with our provided music behind),5: video response ( user gives a video explaining answer to question brand asked),6: caption this ( user captions photo we provide),7: background (NEW-using a background we provide)"
   *                        Reward Type:
   *                            type: integer
   *                            example: "1: tokens- fixed per entry,2: available presents (token value here),3: available chests (token value here ),4: Contest (tokens to winner only"
   *                        Reward Center Id:
   *                            type: integer
   *                        Audience:
   *                            type: integer
   *                            example: "1: public , 2: tier 2,3: tier3, 4: bonus task winner,5: specific group "
   *                        Bonus Reward Type:
   *                            type: integer
   *                            example: "1: add prizes , 2: bonus sets, 3: single price, 4: no bonus"
   *                        Bonus Set Id:
   *                            type: integer
   *                        Bonus Item Id:
   *                            type: integer
   *                        Tickets Per Submissions:
   *                            type: integer
   *                        Task Media:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["xyz.png","abc.mp4"]
   *                        Task description:
   *                            type: string
   *                        Task oneline summary:
   *                            type: string
   *                        Task hashtags:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["Beta","Test"]
   *                        Task token budget:
   *                            type: integer
   *                        Task budget per user:
   *                            type: integer
   *                        Task stars per user:
   *                            type: integer
   *                        Task energy per user:
   *                            type: integer
   *                        Task total available:
   *                            type: integer
   *                        Continue after budget spend:
   *                            type: boolean
   *                        Task estimated user:
   *                            type: integer
   *                        Task do:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["This is testing","This is testing again"]
   *                        Task dont do:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["This is testing","This is testing again"]
   *                        Task insta question:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["This is testing","how many followers do you have"]
   *                        Task photos required:
   *                            type: integer
   *                        Task videos required:
   *                            type: integer
   *                        Task mentioned:
   *                            type: string
   *                        Task start date:
   *                            type: string
   *                            format: date-time
   *                            example: 2020-09-30
   *                        Task end date:
   *                            type: string
   *                            format: date-time
   *                            example: 2020-09-30
   *                        Task status:
   *                            type: integer
   *                            example: "0: Waiting for approval,1: Approved,2: Published,3: Draft,4: Closed,5: Cancelled"
   *     tags:
   *       - Tasks
   *     description: Add new Task
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Task
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
  router.post("/tasks", access, adminValidate.validate("create_task"), Tasks.createNewTask);

  /**
   * @swagger
   * /api/contest:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Task name:
   *                            type: string
   *                        Campaign id:
   *                            type: integer
   *                        Brand Id:
   *                            type: integer
   *                        Task type:
   *                            type: integer
   *                            example: "1: video,2: image,3: sound,4: versus ( we provide first half of sound/ makes second half of sound with our provided music behind),5: video response ( user gives a video explaining answer to question brand asked),6: caption this ( user captions photo we provide),7: background (NEW-using a background we provide)"
   *                        Reward Type:
   *                            type: integer
   *                            example: "1: tokens- fixed per entry,2: available presents (token value here),3: available chests (token value here ),4: Contest (tokens to winner only)"
   *                        Reward Center Id:
   *                            type: integer
   *                        Audience:
   *                            type: integer
   *                            example: "1: public , 2: tier 2,3: tier3, 4: bonus task winner,5: specific group "
   *                        Bonus Reward Type:
   *                            type: integer
   *                            example: "1: add prizes , 2: bonus sets, 3: single price, 4: no bonus"
   *                        Bonus Set Id:
   *                            type: integer
   *                        Bonus Item Id:
   *                            type: integer
   *                        Tickets Per Submissions:
   *                            type: integer
   *                        Task Media:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["xyz.png","abc.mp4"]
   *                        Task description:
   *                            type: string
   *                        Task oneline summary:
   *                            type: string
   *                        Task hashtags:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["Beta","Test"]
   *                        Task token budget:
   *                            type: integer
   *                        Task budget per user:
   *                            type: integer
   *                        Task stars per user:
   *                            type: integer
   *                        Task energy per user:
   *                            type: integer
   *                        Task total available:
   *                            type: integer
   *                        Continue after budget spend:
   *                            type: boolean
   *                        Task estimated user:
   *                            type: integer
   *                        Task do:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["This is testing","This is testing again"]
   *                        Task dont do:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["This is testing","This is testing again"]
   *                        Task insta question:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["This is testing","how many followers do you have"]
   *                        Task photos required:
   *                            type: integer
   *                        Task videos required:
   *                            type: integer
   *                        Task mentioned:
   *                            type: string
   *                        Task start date:
   *                            type: string
   *                            format: date-time
   *                            example: 2020-09-30
   *                        Task end date:
   *                            type: string
   *                            format: date-time
   *                            example: 2020-09-30
   *                        voting start date:
   *                            type: string
   *                            format: date-time
   *                            example: 2020-09-30
   *                        voting end date:
   *                            type: string
   *                            format: date-time
   *                            example: 2020-09-30
   *                        winner date:
   *                            type: string
   *                            format: date-time
   *                            example: 2020-09-30
   *                        winner token:
   *                            type: string
   *                            example: 00
   *                        Task status:
   *                            type: integer
   *                            example: "0: Waiting for approval,1: Approved,2: Published,3: Draft,4: Closed,5: Cancelled"
   *     tags:
   *       - Contest Tasks
   *     description: Add new contest
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new contest
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
  router.post("/contest", access, Tasks.createNewContest);
  /**
   * @swagger
   * /api/tasks:
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
   *              example: ta_task_id,ta_name,cp_campaign_id,ta_type,ta_hashtag   # Example of a parameter value
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
   *       - Tasks
   *     description: Returns all tasks
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of tasks
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
  router.get('/tasks', auth, Tasks.listing)

  /**
   * @swagger
   * /api/tasks_listing:
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
   *              example: tj_id,tj_task_id   # Example of a parameter value
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
   *       - Tasks
   *     description: Returns all tasks
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of tasks
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
  router.get('/tasks_listing', auth, Tasks.taskListing)

  /**
    * @swagger
    * /api/tasks_list:
    *   get:
    *     parameters:
    *         - name: pageNumber
    *           in: query
    *           required: false
    *           schema:
    *              type: integer
    *         - name: isAdmin
    *           in: query
    *           required: false
    *           schema:
    *              type: integer
    *     tags:
    *       - Tasks
    *     description: Returns all tasks json array
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description: A list of tasks json array
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
  router.get('/tasks_list', auth, Tasks.jsonlisting)

    /**
   * @swagger
   * /api/tasks_list/{taskID}:
   *   get:
   *     parameters:
   *         - name: taskID
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *         - name: isAdmin
   *           in: query
   *           required: false
   *           schema:
   *              type: integer 
   *     tags:
   *       - Tasks
   *     description: Retrieve a single task detail with taskID
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a tasks
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
  router.get("/tasks_list/:taskID", auth, Tasks.taskJsonDetail);
  /**
    * @swagger
    * /api/contest:
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
    *              example: ct_id,ct_name,cp_campaign_id,ct_type,ct_hashtag   # Example of a parameter value
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
    *       - Contest Tasks
    *     description: Returns all contest
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description: A list of contest
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
  router.get('/contest', Tasks.listingContest)
  /**
   * @swagger
   * /api/tasks/{taskID}:
   *   get:
   *     parameters:
   *         - name: taskID
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
   *       - Tasks
   *     description: Retrieve a single tasks with taskID
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a tasks
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
  router.get("/tasks/:taskID", auth, Tasks.taskDetail);
  /**
     * @swagger
     * /api/contest/{ct_id}:
     *   get:
     *     parameters:
     *         - name: ct_id
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
     *       - Contest Tasks
     *     description: Retrieve a single Contest with ct_id
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Details of a Contest
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
  router.get("/contest/:ct_id", Tasks.contestDetail);
  /**
  * @swagger
  * /api/tasks/{taskID}:
  *   put:
  *     requestBody:
  *        required: false
  *        content:
  *            application/json:
  *                schema:
  *                    type: object
  *                    properties:
  *                        ta_name:
  *                            type: string
  *                        task_header_image:
  *                            type: string
  *                        cp_campaign_id:
  *                            type: integer
  *                        brand_id:
  *                            type: integer
  *                        ta_type:
  *                            type: integer
  *                            example: "1: video,2: image,3: sound,4: versus ( we provide first half of sound/ makes second half of sound with our provided music behind),5: video response ( user gives a video explaining answer to question brand asked),6: caption this ( user captions photo we provide),7: background (NEW-using a background we provide)"
  *                        reward_type:
  *                            type: integer
  *                            example: "1: tokens- fixed per entry,2: available presents (token value here),3: available chests (token value here ),4: Contest (tokens to winner only"
  *                        reward_center_id:
  *                            type: integer
  *                        audience:
  *                            type: integer
  *                            example: "1: public , 2: tier 2,3: tier3, 4: bonus task winner,5: specific group "
  *                        bonus_reward_type:
  *                            type: integer
  *                            example: "1: add prizes , 2: bonus sets, 3: single price, 4: no bonus"
  *                        bonus_set_id:
  *                            type: integer
  *                        bonus_item_id:
  *                            type: integer
  *                        tickets_per_task_submissions:
  *                            type: integer
  *                        ta_media:
  *                            type: array
  *                            items:
  *                              oneOf:
  *                               type: string
  *                            example: ["xyz.png","abc.mp4"]
  *                        ta_desc:
  *                            type: string
  *                        ta_hashtag:
  *                            type: array
  *                            items:
  *                              oneOf:
  *                               type: string
  *                            example: ["Beta","Test"]
  *                        ta_token_budget:
  *                            type: integer
  *                        ta_budget_per_user:
  *                            type: integer
  *                        ta_stars_per_user:
  *                            type: integer
  *                        ta_energy_per_user:
  *                            type: integer
  *                        ta_total_available:
  *                            type: integer
  *                        ta_estimated_user:
  *                            type: integer
  *                        ta_do:
  *                            type: array
  *                            items:
  *                              oneOf:
  *                               type: string
  *                            example: ["This is testing"]
  *                        ta_dont_do:
  *                            type: array
  *                            items:
  *                              oneOf:
  *                               type: string
  *                            example: ["don't do this task"]
  *                        ta_insta_question:
  *                            type: array
  *                            items:
  *                              oneOf:
  *                               type: string
  *                            example: ["how r you","how many followers do you have"]
  *                        ta_photos_required:
  *                            type: integer
  *                        ta_videos_required:
  *                            type: integer
  *                        ta_mentioned:
  *                            type: string
  *                        ta_start_date:
  *                            type: string
  *                            format: date-time
  *                            example: 2020-09-30
  *                        ta_end_date:
  *                            type: string
  *                            format: date-time
  *                            example: 2020-09-30
  *                        ta_status:
  *                            type: integer
  *     parameters:
  *         - name: taskID
  *           in: path
  *           required: true
  *           schema:
  *              type: string
  *     tags:
  *       - Tasks
  *     description: Update tasks
  *     produces:
  *       - application/json
  *     responses:
  *       201:
  *         description: Tasks updated
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
  router.put("/tasks/:taskID", access, Tasks.updateTasks);
	/**
	* @swagger
	* /api/media-upload:
	*   post:
	*     requestBody:
	*        required: true
	*        content:
	*            multipart/form-data:
	*                schema:
	*                    type: object
	*                    properties:
	*                        media_file:
	*                            type: array
	*                            items:
	*                             type: string
	*                             format: binary
	*                        media_action:
	*                            type: string
	*                            example: "task:ta_post_insp_image,ta_header_image,ta_sound,ta_bonus_rewards_benefits brand:cr_co_logo_path, post:ucpl_content_data,thumb user:u_prof_img_path ,contest: ct_post_insp_image,ct_header_image,ct_sound,shipping_confirmation: product_img,level_task: task_banner_img"
	*                        actionID:
	*                            type: string
	*                            example: "1"
	*                        tblAlias:
	*                            type: string
	*                            example: "task,brand,campaign,user,post,contest,shipping_confirmation,level_task"
	*                        note:
	*                            type: string
	*     tags:
	*       - File Upload
	*     description: upload media like images,files
	*     produces:
	*       - application/json
	*     responses:
	*       200:
	*         description: Media upload succesfully
	*       400:
	*         description: You must select at least 1 file
	*       500:
	*         description: Error when trying upload many files
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
  router.post("/media-upload", auth, Tasks.mediaUpload);



  /**
  * @swagger
  * /api/contest/{taskID}:
  *   put:
  *     requestBody:
  *        required: false
  *        content:
  *            application/json:
  *                schema:
  *                    type: object
  *                    properties:
  *                        ct_name:
  *                            type: string
  *                        cp_campaign_id:
  *                            type: integer
  *                        brand_id:
  *                            type: integer
  *                        ct_type:
  *                            type: integer
  *                            example: "1: video,2: image,3: sound,4: versus ( we provide first half of sound/ makes second half of sound with our provided music behind),5: video response ( user gives a video explaining answer to question brand asked),6: caption this ( user captions photo we provide),7: background (NEW-using a background we provide)"
  *                        reward_type:
  *                            type: integer
  *                            example: "1: tokens- fixed per entry,2: available presents (token value here),3: available chests (token value here ),4: Contest (tokens to winner only"
  *                        reward_center_id:
  *                            type: integer
  *                        audience:
  *                            type: integer
  *                            example: "1: public , 2: tier 2,3: tier3, 4: bonus task winner,5: specific group "
  *                        bonus_reward_type:
  *                            type: integer
  *                            example: "1: add prizes , 2: bonus sets, 3: single price, 4: no bonus"
  *                        bonus_set_id:
  *                            type: integer
  *                        bonus_item_id:
  *                            type: integer
  *                        tickets_per_task_submissions:
  *                            type: integer
  *                        ct_media:
  *                            type: array
  *                            items:
  *                              oneOf:
  *                               type: string
  *                            example: ["xyz.png","abc.mp4"]
  *                        ct_desc:
  *                            type: string
  *                        ct_hashtag:
  *                            type: array
  *                            items:
  *                              oneOf:
  *                               type: string
  *                            example: ["Beta","Test"]
  *                        ct_token_budget:
  *                            type: integer
  *                        ct_budget_per_user:
  *                            type: integer
  *                        ct_stars_per_user:
  *                            type: integer
  *                        ct_energy_per_user:
  *                            type: integer
  *                        ct_total_available:
  *                            type: integer
  *                        ct_estimated_user:
  *                            type: integer
  *                        ct_do:
  *                            type: array
  *                            items:
  *                              oneOf:
  *                               type: string
  *                            example: ["This is testing"]
  *                        ct_dont_do:
  *                            type: array
  *                            items:
  *                              oneOf:
  *                               type: string
  *                            example: ["don't do this task"]
  *                        ct_insta_question:
  *                            type: array
  *                            items:
  *                              oneOf:
  *                               type: string
  *                            example: ["how r you","how many followers do you have"]
  *                        ct_photos_required:
  *                            type: integer
  *                        ct_videos_required:
  *                            type: integer
  *                        ct_mentioned:
  *                            type: string
  *                        ct_start_date:
  *                            type: string
  *                            format: date-time
  *                            example: 2020-09-30
  *                        ct_end_date:
  *                            type: string
  *                            format: date-time
  *                            example: 2020-09-30
  *                        ct_start_voting_date:
  *                            type: string
  *                            format: date-time
  *                            example: 2020-09-30
  *                        ct_end_voting_date:
  *                            type: string
  *                            format: date-time
  *                            example: 2020-09-30
  *                        ct_winner_date:
  *                            type: string
  *                            format: date-time
  *                            example: 2020-09-30
  *                        ct_status:
  *                            type: integer
  *     parameters:
  *         - name: taskID
  *           in: path
  *           required: true
  *           schema:
  *              type: string
  *     tags:
  *       - Contest Tasks
  *     description: Update contest
  *     produces:
  *       - application/json
  *     responses:
  *       201:
  *         description: contest updated
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
  router.put("/contest/:taskID", access, Tasks.updateContest);
  /**
    * @swagger
    * /api/file/{action_id}/{media_token}/{attachment}:
    *   get:
    *     parameters:
    *         - name: action_id
    *           in: path
    *           required: true
    *           schema:
    *              type: string
  *           example: 'uid: list api, id of record :signle details api'
    *         - name: media_token
    *           in: path
    *           required: true
    *           schema:
    *              type: string
    *         - name: attachment
    *           in: path
    *           required: true
    *           schema:
    *              type: string
    *     tags:
    *       - File Upload
    *     description: Retrieve a single image(enter uid as action_id if we hit any list api and enter id of record as action_id if we hit any signle details api) ( Pass opt=thumb in query to get thumb of a image or video)
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description: Details of a job
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
  router.get("/file/:action_id/:media_token/:attachment", imgAuth, function (
    req,
    res,
    next
  ) {
    var options = {
      root: (req.query.opt && req.query.opt === 'thumb') ? appConfig[env].FILE_UPLOAD_DIR + '/thumbnails' : appConfig[env].FILE_UPLOAD_DIR,
      dotfiles: "deny",
      headers: {
        "x-timestamp": Date.now(),
        "x-sent": true
      }
    };
    var fileName = req.params.attachment;
    res.sendFile(fileName, options, function (err) {
      if (err) {
        next(err);
      } else {
        console.log("Sent:", fileName);
      }
    });
  });

  /**
    * @swagger
    * /api/contest:
    *   get:
    *     parameters:
    *     tags:
    *       - Tasks
    *     description: Returns all contest
    *     produces:
    *       - application/json
    *     responses:
    *       200:
    *         description: A list of contest
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
   router.get('/tasks_user_state', Tasks.userTasksState)

  app.use("/api", router);
};
