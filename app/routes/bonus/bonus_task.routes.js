module.exports = app => {
    const BonusTask = require("../../controllers/bonus/bonus_task.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
  /**
   * @swagger
   * /api/bonus_task:
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
   *                        Caption 1:
   *                            type: string
   *                        Caption 2:
   *                            type: string
   *                        Caption 3:
   *                            type: string
   *                        Own Caption:
   *                            type: string
   *                        Task Title:
   *                            type: string
   *                        Summary Content:
   *                            type: string
   *                        Image Url:
   *                            type: string
   *                        Video Url:
   *                            type: string
   *                        Completion Date:
   *                            type: string
   *                        Entry Date:
   *                            type: string
   *                        Hashtag:
   *                            type: string
   *                        Bonus Task Images:
   *                            type: string
   *                        Bonus Task Start Date:
   *                            type: string
   *     tags:
   *       - Bonus Task
   *     description: Add new Bonus Task
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Bonus Task
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
	router.post("/bonus_task",auth, BonusTask.createBonusTask);
  /**
   * @swagger
   * /api/bonus_task/{bonusTaskId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        bonus_task_brand_id:
   *                            type: integer
   *                        bonus_task_usr_id:
   *                            type: integer
   *                        bonus_task_caption1:
   *                            type: string
   *                        bonus_task_caption2:
   *                            type: string
   *                        bonus_task_caption3:
   *                            type: string
   *                        bonus_task_own_caption:
   *                            type: string
   *                        bonus_task_title:
   *                            type: string
   *                        bonus_task_summary_content:
   *                            type: string
   *                        bonus_task_image_url:
   *                            type: string
   *                        bonus_task_video_url:
   *                            type: string
   *                        bonus_task_completion_date:
   *                            type: string
   *                        bonus_task_entry_date:
   *                            type: string
   *                        bonus_task_hashtag:
   *                            type: string
   *                        bonus_task_images:
   *                            type: string
   *                        bonus_task_start_date:
   *                            type: string
   *     parameters:
   *         - name: bonusTaskId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Bonus Task
   *     description: Update Bonus Task
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Bonus Task updated
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
  router.put("/bonus_task/:bonusTaskId",auth, BonusTask.updateBonusTask);
  /**
   * @swagger
   * /api/bonus_task:
   *   get:
   *     parameters:
   *         - name: brandId
   *           in: query
   *           required: false
   *           schema:
   *              type: integer
   *         - name: bonusTaskId
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
   *              example: bonus_task_brand_id,bonus_task_usr_id,bonus_task_caption1,bonus_task_caption2,bonus_task_caption3,bonus_task_own_caption,bonus_task_title,bonus_task_summary_content,bonus_task_image_url,bonus_task_video_url,bonus_task_completion_date,bonus_task_entry_date,bonus_task_hashtag # Example of a parameter value
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
   *       - Bonus Task
   *     description: Returns all Bonus Task
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Bonus Task
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
    router.get('/bonus_task',auth, BonusTask.bonusTaskListing)
  /**
   * @swagger
   * /api/bonus_task/{bonusTaskId}:
   *   get:
   *     parameters:
   *         - name: bonusTaskId
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
   *       - Bonus Task
   *     description: Retrieve a single Bonus Task with BonusTaskId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Bonus Task
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
    router.get("/bonus_task/:bonusTaskId",auth, BonusTask.bonusTaskDetails);
   /**
   * @swagger
   * /api/bonus_task/{bonusTaskId}:
   *   delete:
   *     parameters:
   *         - name: bonusTaskId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Bonus Task
   *     description: Delete a Bonus Task with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a Bonus Task
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
    router.delete("/bonus_task/:bonusTaskId", auth, BonusTask.deleteBonusTask); 

    /**
   * @swagger
   * /api/bonus_task_user_state:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Bonus Task Id:
   *                            type: integer
   *                        User Id:
   *                            type: integer
   *                        State:
   *                            type: integer
   *     tags:
   *       - Bonus Task
   *     description: User Progress for Bonus Task
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: User Progress for Bonus Task
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
  router.post("/bonus_task_user_state",auth, BonusTask.bonusTaskUserProgress);

  /**
   * @swagger
   * /api/bonus_task_user_state/{bonusTaskUserStateId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        bonus_task_id:
   *                            type: integer
   *                        bonus_task_usr_id:
   *                            type: integer
   *                        usr_state:
   *                            type: integer
   *     parameters:
   *         - name: bonusTaskUserStateId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Bonus Task
   *     description: Update Bonus Task User State
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Bonus Task User State updated
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
  router.put("/bonus_task_user_state/:bonusTaskUserStateId",auth, BonusTask.updateUserProgress);
  
  /**
   * @swagger
   * /api/bonus_task_user_state:
   *   get:
   *     parameters:
   *         - name: bonusTaskUserStateId
   *           in: query
   *           required: false
   *           schema:
   *              type: integer
   *         - name: bonusTaskId
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
   *              example: btus_id,bonus_task_id,bonus_task_usr_id,usr_state # Example of a parameter value
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
   *       - Bonus Task
   *     description: Returns all Bonus Task Users state
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Bonus Task Users state
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
  router.get('/bonus_task_user_state',auth, BonusTask.UserProgressListing);

  /**
   * @swagger
   * /api/bonus_task_user_state/{bonusTaskId}:
   *   get:
   *     parameters:
   *         - name: bonusTaskId
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
   *       - Bonus Task
   *     description: Retrieve Bonus Task User State with BonusTaskId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Bonus Task
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
  router.get("/bonus_task_user_state/:bonusTaskId",auth, BonusTask.bonusTaskUserStateDetails);

    app.use("/api", router);
};
  