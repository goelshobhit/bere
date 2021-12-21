module.exports = app => {
    const rewardRequest = require("../../controllers/reward/rewards_request.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
     /**
     * @swagger
     * /api/rewards-engine/request_rewards:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Rewards Id:
     *                            type: integer
     *                        Rewards Event Id:
     *                            type: integer
     *                        Rewards Event Request Id:
     *                            type: string
     *     tags:
     *       - Rewards-Engine
     *     description: Create Reward Request
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Create Reward Request
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
    router.post("/rewards-engine/request_rewards", rewardRequest.createRewardRequest);

     // Retrieve all rewards request
    /**
     * @swagger
     * /api/rewards-engine/request_rewards:
     *   get:
     *     parameters:
     *         - name: rewardsRequestId
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
     *              example: rewards_request_id,rewards_id,rewards_timestamp,rewards_user_id,rewards_event_owner_id,rewards_event_id,rewards_event_request_id    # Example of a parameter value
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
     *       - Rewards-Engine
     *     description: Returns all User Reward Requests
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of User Reward Requests
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
    router.get('/rewards-engine/request_rewards', auth, rewardRequest.rewardRequestlisting)
    app.use("/api", router);
};