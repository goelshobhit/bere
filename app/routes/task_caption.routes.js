module.exports = app => {
    const task_caption = require("../controllers/task_caption.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    /**
   * @swagger
   * /api/task_caption:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Task Caption Hashtags:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["Beta","Test"]
   *                        User Id:
   *                           type: integer
   *                        Task Spots Available:
   *                           type: integer
   *                        Shared Social Media Id:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: integer
   *                            example: [123,345]
   *                        Task Caption Rules:
   *                            type: string
   *     tags:
   *       - Task Caption
   *     description: Save Shared Task Caption By User
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Save Shared Task Caption By User
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
    router.post("/task_caption_shared", auth, task_caption.taskCaptionSharedUser);

    

    // Retrieve all Task Caption listing
    /**
     * @swagger
     * /api/task_caption:
     *   get:
     *     parameters:
     *         - name: taskCaptionId
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
     *              example: task_caption_id,task_caption_user_id,task_spots_available,task_caption_timestamp,Task_caption_rules,tc_created_at,tc_updated_at    # Example of a parameter value
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
     *       - Task Caption
     *     description: Returns all Shared Task Caption
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Shared Task Caption
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
    router.get('/task_caption_shared', auth, task_caption.taskCaptionSharedListing)

    
  app.use("/api", router);
};