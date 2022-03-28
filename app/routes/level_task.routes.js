module.exports = app => {
    const levelTask = require("../controllers/level_task.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    /**
     * @swagger
     * /api/task_level/post_level_task:
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
     *                        Task Level:
     *                            type: integer
     *                        Task Details:
     *                            type: string
     *                        Task Price:
     *                            type: integer
     *     tags:
     *       - Task Level
     *     description: Add Task level
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add Task level
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
    router.post("/task_level/post_level_task", auth, levelTask.postTaskLevel);

    // Update task level with id
    /**
     * @swagger
     * /api/task_level/update_level_task/{levelTaskID}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        brand_id:
     *                            type: integer
     *                        task_id:
     *                            type: integer
     *                        task_level:
     *                            type: integer
     *                        task_details:
     *                            type: string
     *                        task_price:
     *                            type: integer
     *     parameters:
     *         - name: levelTaskID
     *           in: path
     *           required: true
     *           schema:
     *              type: integer
     *     tags:
     *       - Task Level
     *     description: Update  task level
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Update  task level
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
    router.put("/task_level/update_level_task/:levelTaskID", auth, levelTask.updateTaskLevel);


    // Retrieve all task level listing
    /**
     * @swagger
     * /api/task_level/get_level_task:
     *   get:
     *     parameters:
     *         - name: brandId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: taskId
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
     *              example: level_task_id,brand_id,task_id,task_level,la_created_at,la_updated_at    # Example of a parameter value
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
     *       - Task Level
     *     description: Returns all level task listing
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of level task
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
    router.get('/task_level/get_level_task', auth, levelTask.taskLevelListing)

     /**
   * @swagger
   * /api/task_level/delete_level_task/{levelTaskId}:
   *   delete:
   *     parameters:
   *         - name: levelTaskId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *      - Task Level
   *     description: Delete level task with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete level task with id
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
  router.delete("/task_level/delete_level_task/:levelTaskId", auth, levelTask.deleteLevelTask);

    /**
     * @swagger
     * /api/task_level/post_task_cta_response:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Task Id:
     *                            type: integer
     *                        Task Type:
     *                            type: integer
     *                        User CTA Action:
     *                            type: integer
     *                        User CTA Reasons:
     *                            type: integer
     *                        Task User Id:
     *                            type: integer
     *                        Time Allowance:
     *                            type: integer
     *                        Timer Countdown Start Time:
     *                            type: date
     *                            example: 2022-02-10
     *                        Usr Brandscore Penalty:
     *                            type: integer
     *                        Task Status:
     *                            type: integer
     *     tags:
     *       - Task Level
     *     description: Add User Task level Action
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add User Task level Action
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
    router.post("/task_level/post_task_cta_response", auth, levelTask.postUserTaskLevelAction);

     // Update task level with id
    /**
     * @swagger
     * /api/task_level/update_task_cta_response/{userlevelTaskActionID}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
      *                        task_id:
     *                            type: integer
     *                        task_type:
     *                            type: integer
     *                        user_cta_action:
     *                            type: integer
     *                        user_cta_reasons:
     *                            type: integer
     *                        task_user_id:
     *                            type: integer
     *                        time_allowance:
     *                            type: integer
     *                        timer_countdown_start_time:
     *                            type: date
     *                            example: 2022-02-10
     *                        usr_brandscore_penalty:
     *                            type: integer
     *                        task_status:
     *                            type: integer
     *     parameters:
     *         - name: userlevelTaskActionID
     *           in: path
     *           required: true
     *           schema:
     *              type: integer
     *     tags:
     *       - Task Level
     *     description: Update User Task level Action
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Update User Task level Action
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
    router.put("/task_level/update_task_cta_response/:userlevelTaskActionID", auth, levelTask.updateUserTaskLevelAction);

    // Retrieve all task level listing
    /**
     * @swagger
     * /api/task_level/level_task_submit_listing:
     *   get:
     *     parameters:
     *         - name: userId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: taskId
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
     *              example: user_level_task_action_id,task_type,task_id,user_cta_action,user_cta_reasons,task_user_id,created_at,updated_at    # Example of a parameter value
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
     *       - Task Level
     *     description: Returns all submitted user level task
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Returns all submitted user level tasks
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
    router.get('/task_level/level_task_submit_listing', auth, levelTask.levelTaskSubmitListing)

     /**
     * @swagger
     * /api/task_level/post_user_address:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        data:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: object 
     *     tags:
     *       - Task Level
     *     description: Add User Shipping Address
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add User Shipping Address
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
    router.post("/task_level/post_user_address", auth, levelTask.postUserAddress);

    // Retrieve all user addresses
    /**
     * @swagger
     * /api/task_level/get_user_address:
     *   get:
     *     parameters:
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
     *              example: usr_shipping_address_id,usr_id,usr_shipping_address,usr_default_shipping_address,sa_created_at,sa_updated_at    # Example of a parameter value
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
     *       - Task Level
     *     description: Returns all user shipping address
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of all user shipping address
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
    router.get('/task_level/get_user_address', auth, levelTask.userAddressListing)

    /**
   * @swagger
   * /api/task_level/delete_user_address/{usrShippingAddressId}:
   *   delete:
   *     parameters:
   *         - name: usrShippingAddressId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *      - Task Level
   *     description: Delete Shipping Address with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete Shipping Address with id
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
  router.delete("/task_level/delete_user_address/:usrShippingAddressId", auth, levelTask.deleteuserAddress);

  /**
     * @swagger
     * /api/task_level/shipping_confirmation:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Task Id:
     *                            type: integer
     *                        Shipping Stage:
     *                            type: integer
     *                        Shipping Stage Description:
     *                            type: string
     *                        Shipping Stage Description Id:
     *                            type: integer
     *                        Free Text Descripton:
     *                            type: string
     *     tags:
     *       - Task Level
     *     description: Add User Task level Action
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add User Task level Action
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
    router.post("/task_level/shipping_confirmation", auth, levelTask.shippingConfirmation);

    // Retrieve shipping confirmation
    /**
     * @swagger
     * /api/task_level/shipping_confirmation:
     *   get:
     *     parameters:
     *         - name: userId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: taskId
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
     *              example: sc_id,user_id,task_id,shipping_stage,shipping_stage_description,shipping_stage_description_id,free_text_descripton,sc_created_at,sc_updated_at    # Example of a parameter value
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
     *       - Task Level
     *     description: Returns Shipping Confirmation Status
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of all shipping confirmation status
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
    router.get('/task_level/shipping_confirmation', auth, levelTask.shippingConfirmationListing)
    app.use("/api", router);
};