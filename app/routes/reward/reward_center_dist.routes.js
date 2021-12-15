module.exports = app => {
    const RewardCenterDist = require("../../controllers/reward/reward_center_dist.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
  /**
   * @swagger
   * /api/reward_center_dist:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Center Id:
   *                            type: integer
   *                        Dist Status:
   *                            type: integer
   *                        Center Name:
   *                            type: string
   *                        One Freq:
   *                            type: integer
   *                        One Total Token:
   *                            type: integer
   *                        Segment Id:
   *                            type: string
   *                        One Name:
   *                            type: string
   *                        One Stars:
   *                           type: integer
   *                        Stars Name:
   *                           type: string
   *                        Stars To Token:
   *                           type: integer
   *                        One Coins:
   *                           type: integer
   *                        Coins Name:
   *                           type: string
   *                        Coins To Token:
   *                           type: integer
   *                        One Keys:
   *                           type: integer
   *                        Keys Name:
   *                           type: string
   *                        Keys To Token:
   *                           type: integer
   *                        One Booster:
   *                           type: integer
   *                        Booster Name:
   *                           type: string
   *                        Boster To Token:
   *                           type: integer
   *                        Card 1 Id:
   *                           type: integer
   *                        Card 2 Id:
   *                           type: integer
   *                        Card 3 Id:
   *                           type: integer
   *                        Card 4 Id:
   *                           type: integer
   *                        Card 5 Id:
   *                           type: integer
   *                        Card 6 Id:
   *                           type: integer
   *                        Card 7 Id:
   *                           type: integer
   *                        Card 1 Name:
   *                           type: string
   *                        Card 2 Name:
   *                           type: string
   *                        Card 3 Name:
   *                           type: string
   *                        Card 4 Name:
   *                           type: string
   *                        Card 5 Name:
   *                           type: string
   *                        Card 6 Name:
   *                           type: string
   *                        Card 7 Name:
   *                           type: string
   *                        Card 1 Value:
   *                           type: string
   *                        Card 2 Value:
   *                           type: string
   *                        Card 3 Value:
   *                           type: string
   *                        Card 4 Value:
   *                           type: string
   *                        Card 5 Value:
   *                           type: string
   *                        Card 6 Value:
   *                           type: string
   *                        Card 7 Value:
   *                           type: string
   *                        Puzzle 1 Id:
   *                           type: integer
   *                        Puzzle 1 Name:
   *                           type: string
   *                        Puzzle 1 Value:
   *                           type: string
   *                        Spin Reward Id:
   *                           type: integer
   * 
   *     tags:
   *       - Reward Center Dist
   *     description: Add new Reward Center Dist
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Reward Center Dist
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
	router.post("/reward_center_dist",auth, RewardCenterDist.createRewardCenterDist);
  /**
   * @swagger
   * /api/reward_center_dist/{rewardCenterDistId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Center Id:
   *                            type: integer
   *                        Dist Status:
   *                            type: integer
   *                        Center Name:
   *                            type: string
   *                        One Freq:
   *                            type: integer
   *                        One Total Token:
   *                            type: integer
   *                        Segment Id:
   *                            type: string
   *                        One Name:
   *                            type: string
   *                        One Stars:
   *                           type: integer
   *                        Stars Name:
   *                           type: string
   *                        Stars To Token:
   *                           type: integer
   *                        One Coins:
   *                           type: integer
   *                        Coins Name:
   *                           type: string
   *                        Coins To Token:
   *                           type: integer
   *                        One Keys:
   *                           type: integer
   *                        Keys Name:
   *                           type: string
   *                        Keys To Token:
   *                           type: integer
   *                        One Booster:
   *                           type: integer
   *                        Booster Name:
   *                           type: string
   *                        Boster To Token:
   *                           type: integer
   *                        Card 1 Id:
   *                           type: integer
   *                        Card 2 Id:
   *                           type: integer
   *                        Card 3 Id:
   *                           type: integer
   *                        Card 4 Id:
   *                           type: integer
   *                        Card 5 Id:
   *                           type: integer
   *                        Card 6 Id:
   *                           type: integer
   *                        Card 7 Id:
   *                           type: integer
   *                        Card 1 Name:
   *                           type: string
   *                        Card 2 Name:
   *                           type: string
   *                        Card 3 Name:
   *                           type: string
   *                        Card 4 Name:
   *                           type: string
   *                        Card 5 Name:
   *                           type: string
   *                        Card 6 Name:
   *                           type: string
   *                        Card 7 Name:
   *                           type: string
   *                        Card 1 Value:
   *                           type: string
   *                        Card 2 Value:
   *                           type: string
   *                        Card 3 Value:
   *                           type: string
   *                        Card 4 Value:
   *                           type: string
   *                        Card 5 Value:
   *                           type: string
   *                        Card 6 Value:
   *                           type: string
   *                        Card 7 Value:
   *                           type: string
   *                        Puzzle 1 Id:
   *                           type: integer
   *                        Puzzle 1 Name:
   *                           type: string
   *                        Puzzle 1 Value:
   *                           type: string
   *                        Spin Reward Id:
   *                           type: integer
   *     parameters:
   *         - name: rewardCenterDistId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Reward Center Dist
   *     description: Update Reward Center Dist
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Reward Center Dist updated
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
   router.put("/reward_center_dist/:rewardCenterDistId",auth, RewardCenterDist.updateRewardCenterDist);
  /**
   * @swagger
   * /api/reward_center_dist:
   *   get:
   *     parameters:
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
   *              example: reward_center_id,reward_center_dist_status,reward_center_name,reward_center_dist_one_freq,reward_center_dist_one_total_token,reward_center_dist_one_segment_id,reward_center_dist_one_name,reward_center_dist_one_stars,reward_center_dist_one_stars_name,reward_center_dist_one_stars_to_token,reward_center_dist_one_coins,reward_center_dist_one_coins_name,reward_center_dist_one_coins_to_token,reward_center_dist_one_keys_name,reward_center_dist_one_keys_to_token,reward_center_dist_one_booster,reward_center_dist_one_booster_name,reward_center_dist_one_boster_to_token,reward_center_dist_one_card1_id,reward_center_dist_one_card2_id,reward_center_dist_one_card3_id,reward_center_dist_one_card4_id,reward_center_dist_one_card5_id,reward_center_dist_one_card6_id,reward_center_dist_one_card7_id,reward_center_dist_one_card1_name,reward_center_dist_one_card2_name,reward_center_dist_one_card3_name,reward_center_dist_one_card4_name,reward_center_dist_one_card5_name,reward_center_dist_one_card6_name,reward_center_dist_one_card7_name,reward_center_dist_one_card1_value,reward_center_dist_one_card2_value,reward_center_dist_one_card3_value,reward_center_dist_one_card4_value,reward_center_dist_one_card5_value,reward_center_dist_one_card6_value,reward_center_dist_one_card7_value,reward_center_dist_puzzle1_id,reward_center_distr_one_puzzle1_name,reward_center_distr_one_puzzle1_value,reward_center_spin_reward_id # Example of a parameter value
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
   *       - Reward Center Dist
   *     description: Returns all Reward Center Dist
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Reward Center Dist
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
    router.get('/reward_center_dist',auth, RewardCenterDist.rewardCenterDistListing)
  /**
   * @swagger
   * /api/reward_center_dist/{rewardCenterDistId}:
   *   get:
   *     parameters:
   *         - name: rewardCenterDistId
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
   *       - Reward Center Dist
   *     description: Retrieve a single Reward Center Dist with rewardCenterDistId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Reward Center Dist
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
    router.get("/reward_center_dist/:rewardCenterDistId", auth, RewardCenterDist.rewardCenterDistDetails);
   /**
   * @swagger
   * /api/reward_center_dist/{rewardCenterDistId}:
   *   delete:
   *     parameters:
   *         - name: rewardCenterDistId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Reward Center Dist
   *     description: Delete a Reward Center Dist with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a Reward Center Dist
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
    router.delete("/reward_center_dist/:rewardCenterDistId", auth, RewardCenterDist.deleteRewardCenterDist); 
    app.use("/api", router);
};
  