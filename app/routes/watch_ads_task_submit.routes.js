module.exports = app => {
  const WatchAdsSubmit = require("../controllers/watch_ads_task_submit.controller.js");
  var router = require("express").Router();
  const auth = require("../middleware/auth");
/**
 * @swagger
 * /api/watch_ads_task_submit:
 *   post:
 *     requestBody:
 *        required: false
 *        content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        User Id:
 *                           type: integer
 *                        Watch Ads Task Id:
 *                           type: integer
 *                        Watch Timestamp:
 *                           format: date-time
 *                           example: 2020-09-30
 *                        Watch Completion:
 *                           type: integer
 *                        Submit Timestamp:
 *                           format: date-time
 *                           example: 2020-09-30
 *                        Reward Ack:
 *                           type: integer
 *     tags:
 *       - Watch Ads Task Submit
 *     description: Submit Watch Ads Task
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Submit Watch Ads Task
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
router.post("/watch_ads_task_submit",auth, WatchAdsSubmit.createWatchAdsTaskSubmit);
/**
 * @swagger
 * /api/watch_ads_task_submit/{watchAdsTaskSubmitId}:
 *   put:
 *     requestBody:
 *        required: false
 *        content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        submit_watch_timestamp:
 *                            format: date-time
 *                            example: 2020-09-30
 *                        submit_watch_completion:
 *                            type: integer
 *                        submit_timestamp:
 *                            format: date-time
 *                            example: 2020-09-30
 *                        submit_reward_ack:
 *                            type: integer
 *     parameters:
 *         - name: watchAdsTaskSubmitId
 *           in: path
 *           required: true
 *           schema:
 *              type: string
 *     tags:
 *       - Watch Ads Task Submit
 *     description: Update Watch Ads Task Submit
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Watch Ads Task Submit updated
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
 router.put("/watch_ads_task_submit/:watchAdsTaskSubmitId",auth, WatchAdsSubmit.updatewatchAdsTaskSubmit);
/**
 * @swagger
 * /api/watch_ads_task_submit:
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
 *              example: submit_watch_completion,u_id,watch_ads_task_id,submit_reward_ack # Example of a parameter value
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
 *       - Watch Ads Task Submit
 *     description: Returns all Watch Ads Task Submit
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of Watch Ads Task Submit
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
  router.get('/watch_ads_task_submit',auth, WatchAdsSubmit.watchAdsTaskSubmitListing)
/**
 * @swagger
 * /api/watch_ads_task_submit/{watchAdsTaskSubmitId}:
 *   get:
 *     parameters:
 *         - name: watchAdsTaskSubmitId
 *           in: path
 *           required: true
 *           schema:
 *              type: string
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
 *       - Watch Ads Task Submit
 *     description: Retrieve a single Watch Ads Task Submit with watchAdsTaskSubmitId
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Details of a Watch Ads Task Submit
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
  router.get("/watch_ads_task_submit/:watchAdsTaskSubmitId",auth, WatchAdsSubmit.watchAdsTaskSubmitDetails);
/**
 * @swagger
 * /api/watch_ads_task_submit/{watchAdsTaskSubmitId}:
 *   delete:
 *     parameters:
 *         - name: watchAdsTaskSubmitId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *      - Watch Ads Task Submit
 *     description: Delete a Watch Ads Task Submit with id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Delete a Watch Ads Task Submit
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
 router.delete("/watch_ads_task_submit/:watchAdsTaskSubmitId", auth, WatchAdsSubmit.deletewatchAdsTaskSubmit);   
  app.use("/api", router);
};
