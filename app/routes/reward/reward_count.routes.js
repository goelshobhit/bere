module.exports = app => {
    const RewardCount = require("../../controllers/reward/reward_count.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
  /**
   * @swagger
   * /api/reward_count:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Dist Id:
   *                            type: integer
   *                        Dist Name:
   *                            type: string
   *                        Timestamp:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        User Id:
   *                            type: integer
   *                        Number Of Rewards:
   *                            type: integer
   *                        Summary Url:
   *                            type: string
   *     tags:
   *       - Reward Count
   *     description: Add new Reward Count
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Reward Count
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
	router.post("/reward_count",auth, RewardCount.createRewardCount);
  /**
   * @swagger
   * /api/reward_count/{rewardCountId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Dist Id:
   *                            type: integer
   *                        Dist Name:
   *                            type: string
   *                        Timestamp:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        User Id:
   *                            type: integer
   *                        Number Of Rewards:
   *                            type: integer
   *                        Summary Url:
   *                            type: string
   *     parameters:
   *         - name: rewardCountId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Reward Count
   *     description: Update Reward Count
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Reward Count updated
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
   router.put("/reward_count/:rewardCountId",auth, RewardCount.updateRewardCount);
   /**
   * @swagger
   * /api/reward_count:
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
   *              example: reward_count_dist_id,reward_count_dist_name,reward_count_timestamp,reward_count_usr_id,reward_count_no_of_rewards,reward_count_summary_url # Example of a parameter value
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
   *       - Reward Count
   *     description: Returns all Reward Count
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Reward Count
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
    router.get('/reward_count',auth, RewardCount.rewardCountListing)
  /**
   * @swagger
   * /api/reward_count/{rewardCountId}:
   *   get:
   *     parameters:
   *         - name: rewardCountId
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
   *       - Reward Count
   *     description: Retrieve a single Reward Count with rewardCountId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Reward Count
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
    router.get("/reward_count/:rewardCountId",auth, RewardCount.rewardCountDetails);
   /**
   * @swagger
   * /api/reward_count/{rewardCountId}:
   *   delete:
   *     parameters:
   *         - name: rewardCountId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Reward Count
   *     description: Delete a Reward Count with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a Reward Count
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
    router.delete("/reward_count/:rewardCountId", auth, RewardCount.deleteRewardCount); 
    app.use("/api", router);
};
  