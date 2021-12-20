module.exports = app => {
    const rewardSelection = require("../../controllers/reward/rewards_selection.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
    /**
    * @swagger
    * /api/update_online_user:
    *   post:
    *     tags:
    *       - Rewards-Selection
    *     description: Create Reward Request
    *     produces:
    *       - application/json
    *     responses:
    *       201:
    *         description: Update User
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
    router.post("/update_online_user", auth, rewardSelection.updateOnlineUser);
    
    /**
    * @swagger
    * /api/reward_user_selection:
    *   post:
    *     requestBody:
    *        required: false
    *        content:
    *            application/json:
    *                schema:
    *                    type: object
    *                    properties:
    *                        Rewards Event Type:
    *                            type: string
    *                        Rewards Event Id:
    *                            type: integer
    *                        Rewards Center Id:
    *                            type: integer
    *                        Rewards Admin Id:
    *                            type: integer
    *     tags:
    *       - Rewards-Selection
    *     description: Give Random Reward To User
    *     produces:
    *       - application/json
    *     responses:
    *       201:
    *         description: Give Random Reward To User
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
    router.post("/reward_user_selection", auth, rewardSelection.rewardUserSelection);
    app.use("/api", router);
};