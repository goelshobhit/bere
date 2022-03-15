module.exports = app => {
    const BonusSummary = require("../../controllers/bonus/bonus_summary.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
    /**
     * @swagger
     * /api/bonus_summary:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Bonus Item id:
     *                            type: integer
     *                        Bonus Summary Name:
     *                            type: string
     *                        Bonus Summary_Hashtag:
     *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["Beta","Test"]
     *                        Bonus Summary Timestamp:
     *                            type: string
     *                        Bonus Summary Start Timestamp:
     *                            type: string
     *                        Bonus_Summary Entryclose Time:
     *                            type: string
     *                        Bonus Summary End Date:
     *                            type: string
     *                        Bonus Summary Set Id:
     *                            type: integer
     *                        Bonus Summary Set Items:
     *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
     *                        Bonus Summary Set Items Qty:
     *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: integer
   *                            example: [10,20]
     *                        Bonus Summary Total Token:
     *                            type: integer
     *                        Bonus Summary Total Stars:
     *                            type: integer
     *                        Bonus Summary Stars Balance:
     *                            type: integer
     *                        Bonus Summary Set Token Balance:
     *                            type: integer
     *     tags:
     *       - Bonus Summary
     *     description: Add bonus Summary
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add bonus Summary
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
    router.post("/bonus_summary", BonusSummary.createBonusItemSummary);
    // update bonus summary
    /**
     * @swagger
     * /api/bonus_summary/{BonusSummaryId}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        bonus_item_id:
     *                            type: integer
     *                        bonus_summary_name:
     *                            type: string
     *                        bonus_summary_hashtag:
     *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["Beta","Test"]
     *                        bonus_summary_timestamp:
     *                            type: string
     *                        bonus_summary_start_timestamp:
     *                            type: string
     *                        bonus_summary_entryclose_time:
     *                            type: string
     *                        bonus_summary_end_date:
     *                            type: string
     *                        bonus_summary_set_id:
     *                            type: integer
     *                        bonus_summary_set_items:
     *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
     *                        bonus_summary_set_items_qty:
     *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: integer
   *                            example: [10,20]
     *                        bonus_summary_total_token:
     *                            type: integer
     *                        bonus_summary_total_stars:
     *                            type: integer
     *                        bonus_summary_stars_balance:
     *                            type: integer
     *                        bonus_summary_set_token_balance:
     *                            type: integer
     *     tags:
     *       - Bonus Summary
     *     description: Update bonus Summary
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Update bonus Summary
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
   router.put("/bonus_summary/:BonusSummaryId",auth,BonusSummary.updateBonusItemSummary);

   /**
   * @swagger
   * /api/bonus_summary/{BonusSummaryId}:
   *   delete:
   *     parameters:
   *         - name: BonusSummaryId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Bonus Summary
   *     description: Delete Bonus Summary with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete Bonus Summary
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
  router.delete("/bonus_summary/:BonusSummaryId", auth, BonusSummary.deleteBonusItemSummary); 

    // Retrieve all Bonus Summaries
    /**
     * @swagger
     * /api/bonus_summary:
     *   get:
     *     parameters:
     *         - name: BonusSummaryId
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
     *              example: bonus_summary_id,bonus_item_id,bonus_summary_name,bonus_summary_timestamp,bonus_summary_start_timestamp,bonus_summary_entryclose_time,bonus_summary_end_date,bonus_summary_set_id,bonus_summary_total_token    # Example of a parameter value
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
     *       - Bonus Summary
     *     description: Returns all Bonus Item Summary
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Bonus Item Summary
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
    router.get('/bonus_summary', auth, BonusSummary.bonusSummarylisting);
    app.use("/api", router);
};