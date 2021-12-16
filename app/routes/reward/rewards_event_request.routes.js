module.exports = app => {
    const rewardEventRequest = require("../../controllers/reward/rewards_event_request.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
     /**
     * @swagger
     * /api/rewards-engine/request_id:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Rewards Event Id:
     *                            type: integer
     *                        Rewards Event Type:
     *                            type: string
     *                            example: "Single, Contest"
     *     tags:
     *       - Rewards-Engine
     *     description: Create Reward Request Id
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Create Reward Request Id
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
    router.post("/rewards-engine/request_id", rewardEventRequest.createRewardRequestId);
    app.use("/api", router);
};