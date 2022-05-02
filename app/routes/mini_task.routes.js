module.exports = app => {
    const mini_task = require("../controllers/mini_task.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
    const access = require("../middleware/access");

    /**
   * @swagger
   * /api/mini_task:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Mini Task Object Type:
   *                           type: integer
   *                        Mini Task Qty:
   *                           type: integer
   *                        Mini Task Time State:
   *                           type: integer
   *                        Mini Task Reward Type:
   *                            type: integer
   *                        Mini Task Image Url:
   *                            type: string
   *                        Mini Task Reward Amount:
   *                            type: integer
   *                        Mini Task Status:
   *                           type: integer
   *                        Mini Task App Placement Page:
   *                           type: string
   *                        Mini Task Increase In Hardness:
   *                           type: integer
   *                        Mini Task Hardness:
   *                           type: integer
   *                        Mini Task Hardness Action Description:
   *                           type: string
   *                        Mini Tasks Hardness Action:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["Action 1","Action 2"]
   *     tags:
   *       - Mini Task
   *     description: Add Mini Task
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add Mini Task
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
    router.post("/mini_task", access, mini_task.addMiniTask);

    

    // Retrieve all Mini Tasks listing
    /**
     * @swagger
     * /api/mini_task:
     *   get:
     *     parameters:
     *         - name: miniTaskId
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
     *              example: mini_task_id,mini_task_object_type,mini_task_qty,mini_task_time_state,mini_task_reward_type,mini_task_image_url,mini_task_reward_amount,mini_task_status,mini_task_app_placement_page,mini_task_increase_in_hardness,mini_task_hardness,mini_task_hardness_action_description,mt_created_at,mt_updated_at    # Example of a parameter value
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
     *       - Mini Task
     *     description: Returns all Mini Tasks
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Mini Tasks
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
    router.get('/mini_task', auth, mini_task.miniTaskListing)

    
  app.use("/api", router);
};