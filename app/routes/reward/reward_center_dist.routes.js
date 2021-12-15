// module.exports = app => {
//     const RewardCenterDist = require("../../controllers/reward/reward_center_dist_dist.controller.js");
//     var router = require("express").Router();
//     const auth = require("../../middleware/auth");
//   /**
//    * @swagger
//    * /api/reward_center_dist:
//    *   post:
//    *     requestBody:
//    *        required: false
//    *        content:
//    *            application/json:
//    *                schema:
//    *                    type: object
//    *                    properties:
//    *                        Event Name:
//    *                            type: integer
//    *                        Event Type:
//    *                            type: integer
//    *                        Brand Id:
//    *                            type: integer
//    *                        Event Date:
//    *                            format: date-time
//    *                            example: 2020-09-30
//    *                        Event Usrid:
//    *                            type: integer
//    *                        Event UsrOptin:
//    *                            type: integer
//    *                        Event UsrOptOut:
//    *                            type: integer
//    *                        Event UsrOptOut Date:
//    *                           type: integer
//    *     tags:
//    *       - Reward Center Dist
//    *     description: Add new Reward Center Dist
//    *     produces:
//    *       - application/json
//    *     responses:
//    *       201:
//    *         description: Add new Reward Center Dist
//    *       422:
//    *         description: validation errors
//    *       500:
//    *         description: Internal server error
//    *       401:
//    *          description: Unauthorized
//    *          content:
//    *              application/json:
//    *                  schema:
//    *                      type: object
//    *                      properties:
//    *                          message:
//    *                              type: string
//    *                              example: Authorisation Required
//    */
// 	router.post("/reward_center_dist",auth, RewardCenterDist.createRewardCenterDist);
//   /**
//    * @swagger
//    * /api/reward_center_dist/{rewardCenterDistId}:
//    *   put:
//    *     requestBody:
//    *        required: false
//    *        content:
//    *            application/json:
//    *                schema:
//    *                    type: object
//    *                    properties:
//   *                        Event Name:
//    *                            type: integer
//    *                        Event Type:
//    *                            type: integer
//    *                        Brand Id:
//    *                            type: integer
//    *                        Event Date:
//    *                            format: date-time
//    *                            example: 2020-09-30
//    *                        Event Usrid:
//    *                            type: integer
//    *                        Event UsrOptin:
//    *                            type: integer
//    *                        Event UsrOptOut:
//    *                            type: integer
//    *                        Event UsrOptOut Date:
//    *                           type: integer
//    *     parameters:
//    *         - name: rewardCenterDistId
//    *           in: path
//    *           required: true
//    *           schema:
//    *              type: string
//    *     tags:
//    *       - Reward Center Dist
//    *     description: Update Reward Center Dist
//    *     produces:
//    *       - application/json
//    *     responses:
//    *       201:
//    *         description: Reward Center Dist updated
//    *       422:
//    *         description: validation errors
//    *       500:
//    *         description: Internal server error
//    *       401:
//    *          description: Unauthorized
//    *          content:
//    *              application/json:
//    *                  schema:
//    *                      type: object
//    *                      properties:
//    *                          message:
//    *                              type: string
//    *                              example: Authorisation Required
//    */
//    router.put("/reward_center_dist/:rewardCenterDistId",auth, RewardCenterDist.updateRewardCenterDist);
//   /**
//    * @swagger
//    * /api/reward_center_dist:
//    *   get:
//    *     parameters:
//    *         - name: pageNumber
//    *           in: query
//    *           required: false
//    *           schema:
//    *              type: integer
//    *         - name: sortBy
//    *           in: query
//    *           required: false
//    *           schema:
//    *              type: string
//    *              example: notify_event_id,notify_event_name,notify_event_type,cr_co_id,notify_event_date,notify_event_usrid,notify_event_usrOptin,notify_event_usrOptOut,notify_event_usrOptOut_date # Example of a parameter value
//    *         - name: sortOrder
//    *           in: query
//    *           required: false
//    *           schema:
//    *              type: string
//    *              example: ASC,DESC    # Example of a parameter value
//    *         - name: sortVal
//    *           in: query
//    *           required: false
//    *           schema:
//    *              type: string
//    *     tags:
//    *       - Reward Center Dist
//    *     description: Returns all Reward Center Dist
//    *     produces:
//    *       - application/json
//    *     responses:
//    *       200:
//    *         description: A list of Reward Center Dist
//    *       401:
//    *          description: Unauthorized
//    *          content:
//    *              application/json:
//    *                  schema:
//    *                      type: object
//    *                      properties:
//    *                          message:
//    *                              type: string
//    *                              example: Authorisation Required
//    */
//     router.get('/reward_center_dist',auth, RewardCenterDist.rewardCenterDistListing)
//   /**
//    * @swagger
//    * /api/reward_center_dist/{rewardCenterDistId}:
//    *   get:
//    *     parameters:
//    *         - name: rewardCenterDistId
//    *           in: path
//    *           required: true
//    *           schema:
//    *              type: string
//    *         - name: pageSize
//    *           in: query
//    *           required: false
//    *           schema:
//    *              type: integer
//    *         - name: pageNumber
//    *           in: query
//    *           required: false
//    *           schema:
//    *              type: integer
//    *     tags:
//    *       - Reward Center Dist
//    *     description: Retrieve a single Reward Center Dist with rewardCenterDistId
//    *     produces:
//    *       - application/json
//    *     responses:
//    *       200:
//    *         description: Details of a Reward Center Dist
//    *       401:
//    *          description: Unauthorized
//    *          content:
//    *              application/json:
//    *                  schema:
//    *                      type: object
//    *                      properties:
//    *                          message:
//    *                              type: string
//    *                              example: Authorisation Required
//    */
//     router.get("/reward_center_dist/:rewardCenterDistId", auth, RewardCenterDist.rewardCenterDistDetails);
//    /**
//    * @swagger
//    * /api/reward_center_dist/{rewardCenterDistId}:
//    *   delete:
//    *     parameters:
//    *         - name: rewardCenterDistId
//    *           in: path
//    *           required: true
//    *           schema:
//    *              type: integer
//    *     tags:
//    *       - Reward Center Dist
//    *     description: Delete a Reward Center Dist with id
//    *     produces:
//    *       - application/json
//    *     responses:
//    *       200:
//    *         description: Delete a Reward Center Dist
//    *       401:
//    *          description: Unauthorized
//    *          content:
//    *              application/json:
//    *                  schema:
//    *                      type: object
//    *                      properties:
//    *                          message:
//    *                              type: string
//    *                              example: Authorisation Required
//    */
//     router.delete("/reward_center_dist/:rewardCenterDistId", auth, RewardCenterDist.deleteRewardCenterDist); 
//     app.use("/api", router);
// };
  