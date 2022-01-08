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
   *                        Owner Id:
   *                            type: integer
   *                        Location Id:
   *                            type: integer
   *                        Location Name:
   *                            type: integer
   *                        Reward Type:
   *                            type: integer
   *                        Trigger Id:
   *                            type: integer
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
   *                        reward_center_owner_id:
   *                            type: integer
   *                        reward_center_location_id:
   *                            type: integer
   *                        reward_center_location_name:
   *                            type: integer
   *                        reward_center_reward_type:
   *                            type: integer
   *                        reward_center_reward_trigger_id:
   *                            type: integer
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
   *              example: reward_center_name,reward_center_owner_id,reward_center_location_id,reward_center_location_name,reward_center_reward_type,reward_center_reward_trigger_id # Example of a parameter value
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
  