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
    
    router.post("/reward_user_selection", auth, rewardSelection.rewardUserSelection);
    app.use("/api", router);
};