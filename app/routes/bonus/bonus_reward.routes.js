module.exports = app => {
    const BonusRewards = require("../../controllers/bonus/bonus_rewards.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
  /**
   * @swagger
   * /api/bonus_reward:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Bonus Summary:
   *                            type: integer
   *                        Bonus Set Id:
   *                            type: integer
   *                        User Id:
   *                            type: integer
   *                        Item Id:
   *                            type: integer
   *                        Item Name:
   *                            type: string
   *                        Item Qty:
   *                            type: integer
   *                        Delivery Date:
   *                            type: string
   *                        Confirmation Date:
   *                            type: string
   *                        Video Url:
   *                            type: integer
   *                        Completion Date:
   *                            type: integer
   *                        Additional Task Id:
   *                            type: integer
   *     tags:
   *       - Bonus Reward
   *     description: Add new Bonus Reward
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Bonus Reward
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
	router.post("/bonus_reward",auth, BonusRewards.createBonusRewards);
  /**
   * @swagger
   * /api/bonus_reward/{bonusRewardsId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Bonus Summary:
   *                            type: integer
   *                        Bonus Set Id:
   *                            type: integer
   *                        User Id:
   *                            type: integer
   *                        Item Id:
   *                            type: integer
   *                        Item Name:
   *                            type: string
   *                        Item Qty:
   *                            type: integer
   *                        Delivery Date:
   *                            type: string
   *                        Confirmation Date:
   *                            type: string
   *                        Video Url:
   *                            type: integer
   *                        Completion Date:
   *                            type: integer
   *                        Additional Task Id:
   *                            type: integer
   *     parameters:
   *         - name: bonusRewardsId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Bonus Reward
   *     description: Update Bonus Reward
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Bonus Reward updated
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
  router.put("/bonus_reward/:bonusRewardsId",auth, BonusRewards.updateBonusRewards);
  /**
   * @swagger
   * /api/bonus_reward:
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
   *              example: bonus_summary_id,bonus_rewards_bonus_setid,bonus_rewards_usrid,bonus_rewards_item_id,bonus_rewards_item_name,bonus_rewards_item_qty,bonus_rewards_item_delivery_date, bonus_rewards_item_confirmation_date,bonus_rewards_additional_task_id # Example of a parameter value
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
   *       - Bonus Reward
   *     description: Returns all Bonus Reward
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Bonus Reward
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
    router.get('/bonus_reward',auth, BonusRewards.bonusRewardsListing)
  /**
   * @swagger
   * /api/bonus_reward/{bonusRewardsId}:
   *   get:
   *     parameters:
   *         - name: bonusRewardsId
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
   *       - Bonus Reward
   *     description: Retrieve a single Bonus Reward with BonusRewardId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Bonus Reward
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
    router.get("/bonus_reward/:bonusRewardsId",auth, BonusRewards.bonusRewardsDetails);
   /**
   * @swagger
   * /api/bonus_reward/{bonusRewardsId}:
   *   delete:
   *     parameters:
   *         - name: bonusRewardsId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Bonus Reward
   *     description: Delete a Bonus Reward with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a Bonus Reward
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
    router.delete("/bonus_reward/:bonusRewardsId", auth, BonusRewards.deleteBonusRewards); 
    app.use("/api", router);
};
  