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

    // Retrieve all Random User Rewards Listing
    /**
     * @swagger
     * /api/reward_user_selection:
     *   get:
     *     parameters:
     *         - name: randomWinnerId
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
     *              example: random_winner_id,random_winner_usrid,random_winner_reward_id,random_winner_reward_name,random_winner_event_id,random_winner_event_type,random_winner_selected,random_winner_admin_id,randon_winner_ack,random_winner_created_at,random_winner_updated_at    # Example of a parameter value
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
     *       - Rewards-Selection
     *     description: Returns all Random User Rewards Listing
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Random User Rewards Listing
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
    router.get('/reward_user_selection', auth, rewardSelection.rewardRandomUserslisting);

    app.use("/api", router);
};