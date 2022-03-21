module.exports = app => {
    const RewardCenter = require("../../controllers/reward/reward_center.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
  /**
   * @swagger
   * /api/reward_center:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Center Name:
   *                            type: string
   *                        Center Image:
   *                            type: string
   *                        Owner Id:
   *                            type: integer
   *                        Location Id:
   *                            type: integer
   *                        Reward Type:
   *                            type: integer
   *                        Trigger Id:
   *                            type: integer
   *                        Reward Center Dists:
   *                          type: array
   *                          items:
   *                             type: object
   *                             properties:  
   *                                 Dist Status:
   *                                     type: integer  
   *                                 One Freq:
   *                                     type: integer
   *                                 One Total Token:
   *                                     type: integer
   *                                 Segment Id:
   *                                     type: integer
   *                                 One Name:
   *                                     type: string
   *                                 One Stars:
   *                                     type: integer
   *                                 Stars Name:
   *                                     type: integer
   *                                 Stars To Token:
   *                                     type: integer
   *                                 One Coins:
   *                                     type: integer
   *                                 Coins Name:
   *                                     type: string
   *                                 Coins To Token:
   *                                     type: integer
   *                                 One Keys:
   *                                     type: integer
   *                                 Keys Name:
   *                                     type: string
   *                                 Keys To Token:
   *                                     type: integer
   *                                 One Booster:
   *                                     type: integer
   *                                 Booster Name:
   *                                     type: string
   *                                 Boster To Token:
   *                                     type: integer
   *                                 Card 1 Id:
   *                                     type: integer
   *                                 Card 2 Id:
   *                                     type: integer
   *                                 Card 3 Id:
   *                                     type: integer
   *                                 Card 4 Id:
   *                                     type: integer
   *                                 Card 5 Id:
   *                                     type: integer
   *                                 Card 6 Id:
   *                                     type: integer
   *                                 Card 7 Id:
   *                                     type: integer
   *                                 Card 1 Name:
   *                                     type: string
   *                                 Card 2 Name:
   *                                     type: string
   *                                 Card 3 Name:
   *                                     type: string
   *                                 Card 4 Name:
   *                                     type: string
   *                                 Card 5 Name:
   *                                     type: string
   *                                 Card 6 Name:
   *                                     type: string
   *                                 Card 7 Name:
   *                                     type: string
   *                                 Card 1 Value:
   *                                     type: string
   *                                 Card 2 Value:
   *                                     type: string
   *                                 Card 3 Value:
   *                                     type: string
   *                                 Card 4 Value:
   *                                     type: string
   *                                 Card 5 Value:
   *                                     type: string
   *                                 Card 6 Value:
   *                                     type: string
   *                                 Card 7 Value:
   *                                     type: string
   *                                 Puzzle 1 Id:
   *                                     type: integer
   *                                 Puzzle 1 Name:
   *                                     type: string
   *                                 Puzzle 1 Value:
   *                                     type: string
   *                                 Spin Reward Id:
   *                                     type: integer
   * 
   *     tags:
   *       - Reward Center
   *     description: Add new Reward Center
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Reward Center
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
	router.post("/reward_center",auth, RewardCenter.createRewardCenter);
  /**
   * @swagger
   * /api/reward_center/{rewardCenterId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        reward_center_name:
   *                            type: string
   *                        reward_center_image:
   *                            type: string
   *                        reward_center_owner_id:
   *                            type: integer
   *                        reward_center_location_id:
   *                            type: integer
   *                        reward_center_reward_type:
   *                            type: integer
   *                        reward_center_reward_trigger_id:
   *                            type: integer
   *                        reward_center_dists:
   *                          type: array
   *                          items:
   *                             type: object
   *                             properties:  
   *                                 reward_center_dist_status:
   *                                     type: integer  
   *                                 reward_center_dist_one_freq:
   *                                     type: integer
   *                                 reward_center_dist_one_total_token:
   *                                     type: integer
   *                                 reward_center_dist_one_segment_id:
   *                                     type: integer
   *                                 reward_center_dist_one_name:
   *                                     type: string
   *                                 reward_center_dist_one_stars:
   *                                     type: integer
   *                                 reward_center_dist_one_stars_name:
   *                                     type: string
   *                                 reward_center_dist_one_stars_to_token:
   *                                     type: integer
   *                                 reward_center_dist_one_coins:
   *                                     type: integer
   *                                 reward_center_dist_one_coins_name:
   *                                     type: string
   *                                 reward_center_dist_one_coins_to_token:
   *                                     type: integer
   *                                 reward_center_dist_one_keys:
   *                                     type: integer
   *                                 reward_center_dist_one_keys_name:
   *                                     type: string
   *                                 reward_center_dist_one_keys_to_token:
   *                                     type: integer
   *                                 reward_center_dist_one_booster:
   *                                     type: integer
   *                                 reward_center_dist_one_booster_name:
   *                                     type: string
   *                                 reward_center_dist_one_boster_to_token:
   *                                     type: integer
   *                                 reward_center_dist_one_card1_id:
   *                                     type: integer
   *                                 reward_center_dist_one_card2_id:
   *                                     type: integer
   *                                 reward_center_dist_one_card3_id:
   *                                     type: integer
   *                                 reward_center_dist_one_card4_id:
   *                                     type: integer
   *                                 reward_center_dist_one_card5_id:
   *                                     type: integer
   *                                 reward_center_dist_one_card6_id:
   *                                     type: integer
   *                                 reward_center_dist_one_card7_id:
   *                                     type: integer
   *                                 reward_center_dist_one_card1_name:
   *                                     type: string
   *                                 reward_center_dist_one_card2_name:
   *                                     type: string
   *                                 reward_center_dist_one_card3_name:
   *                                     type: string
   *                                 reward_center_dist_one_card4_name:
   *                                     type: string
   *                                 reward_center_dist_one_card5_name:
   *                                     type: string
   *                                 reward_center_dist_one_card6_name:
   *                                     type: string
   *                                 reward_center_dist_one_card7_name:
   *                                     type: string
   *                                 reward_center_dist_one_card1_value:
   *                                     type: string
   *                                 reward_center_dist_one_card2_value:
   *                                     type: string
   *                                 reward_center_dist_one_card3_value:
   *                                     type: string
   *                                 reward_center_dist_one_card4_value:
   *                                     type: string
   *                                 reward_center_dist_one_card5_value:
   *                                     type: string
   *                                 reward_center_dist_one_card6_value:
   *                                     type: string
   *                                 reward_center_dist_one_card7_value:
   *                                     type: string
   *                                 reward_center_dist_puzzle1_id:
   *                                     type: integer
   *                                 reward_center_distr_one_puzzle1_name:
   *                                     type: string
   *                                 reward_center_distr_one_puzzle1_value:
   *                                     type: string
   *                                 reward_center_spin_reward_id:
   *                                     type: integer
   *     parameters:
   *         - name: rewardCenterId
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Reward Center
   *     description: Update Reward Center
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Reward Center updated
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
   router.put("/reward_center/:rewardCenterId",auth, RewardCenter.updateRewardCenter);
   
   /**
   * @swagger
   * /api/reward_center:
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
   *              example: reward_center_name,reward_center_image,reward_center_owner_id,reward_center_location_id,reward_center_reward_type,reward_center_reward_trigger_id # Example of a parameter value
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
   *       - Reward Center
   *     description: Returns all Reward Center
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Reward Center
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
    router.get('/reward_center',auth, RewardCenter.rewardCenterListing)
  /**
   * @swagger
   * /api/reward_center/{rewardCenterId}:
   *   get:
   *     parameters:
   *         - name: rewardCenterId
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
   *       - Reward Center
   *     description: Retrieve a single Reward Center with rewardCenterId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Reward Center
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
    router.get("/reward_center/:rewardCenterId",auth, RewardCenter.rewardCenterDetails);
   /**
   * @swagger
   * /api/reward_center/{rewardCenterId}:
   *   delete:
   *     parameters:
   *         - name: rewardCenterId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Reward Center
   *     description: Delete a reward center with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a reward center
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
    router.delete("/reward_center/:rewardCenterId", auth, RewardCenter.deleteRewardCenter); 
    app.use("/api", router);
};
  