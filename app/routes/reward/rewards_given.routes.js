module.exports = app => {
    const rewardGiven = require("../../controllers/reward/rewards_given.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
    /**
    * @swagger
    * /api/rewards-engine/awards:
    *   post:
    *     requestBody:
    *        required: false
    *        content:
    *            application/json:
    *                schema:
    *                    type: object
    *                    properties:
    *                        Rewards Request Id:
    *                            type: integer
    *                        Rewards Award Event Id:
    *                            type: integer
    *                        Rewards Award Event Type:
    *                            type: string
    *                        Rewards Award UserId:
    *                            type: integer
    *                        Rewards Award Name:
    *                            type: string
    *                        Rewards Award Token:
    *                            type: integer
    *                        Rewards Award Stars:
    *                            type: integer
    *                        Rewards Award Energy:
    *                            type: integer
    *                        Rewards Award Coins:
    *                            type: integer
    *                        Rewards Award Booster:
    *                            type: integer
    *                        Rewards Award Card:
    *                            type: integer
    *     tags:
    *       - Rewards-Engine
    *     description: Give Reward
    *     produces:
    *       - application/json
    *     responses:
    *       201:
    *         description: Give Reward
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
    router.post("/rewards-engine/awards", auth, rewardGiven.giveReward);

    // Retrieve all rewards request
    /**
     * @swagger
     * /api/rewards-engine/awards:
     *   get:
     *     parameters:
     *         - name: rewardsAwardId
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
     *              example: rewards_award_id,rewards_request_id,rewards_award_event_id,rewards_award_event_type,rewards_award_user_id,rewards_award_name,rewards_award_token,rewards_award_stars,rewards_award_energy,rewards_award_coins,rewards_award_booster,rewards_award_card    # Example of a parameter value
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
     *     description: Returns all User Reward Given
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of User Reward Given
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
    router.get('/rewards-engine/awards', auth, rewardGiven.rewardGivenlisting);
    app.use("/api", router);
};