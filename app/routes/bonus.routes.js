module.exports = app => {
    const Bonus = require("../controllers/bonus.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
    /**
     * @swagger
     * /api/bonus_user:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Bonus user Reddim Level:
     *                            type: integer
     *                        Bonus user Followers riddim:
     *                            type: integer
     *                        Bonus User History Not Won:
     *                            type: integer
     *     tags:
     *       - Brand Bonus
     *     description: Add bonus user
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add bonus user
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
    router.post("/bonus_user", Bonus.createBonusUser);

    // Retrieve all Bonus Users
    /**
     * @swagger
     * /api/bonus_user:
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
     *              example: bu_id,bonus_usr_id,bonus_usr_riddim_level,bonus_usr_history_not_won,bonus_usr_followers_riddim,bonus_usr_created_at,bonus_usr_updated_at    # Example of a parameter value
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
     *       - Brand Bonus
     *     description: Returns all Bonus users
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Bonus users
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
    router.get('/bonus_user', auth, Bonus.bonusUserlisting)
    // Update Bonus Users
    /**
     * @swagger
     * /api/bonus_user/{BonusUserId}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Bonus user Reddim Level:
     *                            type: integer
     *                        Bonus user Followers riddim:
     *                            type: integer
     *                        Bonus User History Not Won:
     *                            type: integer
     *     tags:
     *       - Brand Bonus
     *     description: Update bonus user
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Update bonus user
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
    router.put("/bonus_user/:BonusUserId",auth,Bonus.updateBonusUser)

    /**
     * @swagger
     * /api/bonus_sm_share:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Bonus SM Name:
     *                            type: string
     *                        Bonus SM Share Timestamp:
     *                            type: string
     *                        Bonus SM Share Ack:
     *                            type: string
     *                        Bonus Sm Share Url:
     *                            type: string
     *     tags:
     *       - Brand Bonus
     *     description: Add bonus SM share user
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add bonus SM share user
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
    router.post("/bonus_sm_share", Bonus.createBonusSocialMediaShare);
    
    // Retrieve all Bonus SM share users
    /**
     * @swagger
     * /api/bonus_sm_share:
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
     *              example: bonus_item_id,bonus_item_brand_id,bonus_item_name,bonus_item_qty,bonus_item_remaining_qty,bonus_item_timestamp    # Example of a parameter value
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
     *       - Brand Bonus
     *     description: Returns all Bonus Social Media Share
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Bonus Social Media Share
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
    router.get('/bonus_sm_share', auth, Bonus.smSharelisting)

    /**
     * @swagger
     * /api/bonus_item:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Bonus Item Brand Id:
     *                            type: integer
     *                        Bonus Item Name:
     *                            type: string
     *                        Bonus Item Qty:
     *                            type: integer
     *                        Bonus Item Remaining Qty:
     *                            type: integer
     *                        Bonus item Timestamp:
     *                            type: string
     *     tags:
     *       - Brand Bonus
     *     description: Add bonus Item
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add bonus Item
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
    router.post("/bonus_item", Bonus.createBonusItem);

    /**
     * @swagger
     * /api/bonus_item/{BonusSummaryId}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Bonus Item Brand Id:
     *                            type: integer
     *                        Bonus Item Name:
     *                            type: string
     *                        Bonus Item Qty:
     *                            type: integer
     *                        Bonus Item Remaining Qty:
     *                            type: integer
     *                        Bonus item Timestamp:
     *                            type: string
     *     tags:
     *       - Brand Bonus
     *     description: Update bonus Item
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Update bonus Item
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
    router.put("/bonus_item/:bonusItemId",auth,Bonus.updateBonusItem)

     // Retrieve all Bonus Items
    /**
     * @swagger
     * /api/bonus_item:
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
     *              example: bonus_item_id,bonus_item_brand_id,bonus_item_name,bonus_item_qty,bonus_item_remaining_qty,bonus_item_timestamp    # Example of a parameter value
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
     *       - Brand Bonus
     *     description: Returns all Bonus items
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Bonus Items
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
    router.get('/bonus_item', auth, Bonus.bonusItemlisting)
     /**
     * @swagger
     * /api/bonus_set:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Bonus Item Brand Id:
     *                            type: integer
     *                        Bonus Item Name:
     *                            type: string
     *                        Bonus Item Remaining Qty:
     *                            type: integer
     *                        Bonus item Timestamp:
     *                            type: string
     *     tags:
     *       - Brand Bonus
     *     description: Add bonus Item Set
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add bonus Item Item
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
    router.post("/bonus_set", Bonus.createBonusItemSet);
    
    /**
     * @swagger
     * /api/bonus_set/{BonusSetId}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Bonus Item Brand Id:
     *                            type: integer
     *                        Bonus Item Name:
     *                            type: string
     *                        Bonus Item Remaining Qty:
     *                            type: integer
     *                        Bonus item Timestamp:
     *                            type: string
     *     tags:
     *       - Brand Bonus
     *     description: update bonus Item Set
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: update bonus Item Set
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
    router.put("/bonus_set/:BonusSetId",auth,Bonus.updateBonusSet)

    // Retrieve all Bonus sets
    /**
     * @swagger
     * /api/bonus_set:
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
     *              example: bonus_set_id,bonus_set_brand_id,bonus_item_id,bonus_set_item_name,bonus_set_item_qty,bonus_set_item_timestamp,bonus_set_status    # Example of a parameter value
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
     *       - Brand Bonus
     *     description: Returns all Bonus Items set
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of  Bonus Items set
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
    router.get('/bonus_set', auth, Bonus.bonusSetlisting);
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
     *                            type: string
     *                        Bonus Summary Set Items Qty:
     *                            type: string
     *                        Bonus Summary Total Token:
     *                            type: integer
     *                        Bonus Summary Total Stars:
     *                            type: integer
     *                        Bonus Summary Stars Balance:
     *                            type: integer
     *                        Bonus Summary Set Token Balance:
     *                            type: integer
     *     tags:
     *       - Brand Bonus
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
    router.post("/bonus_summary", Bonus.createBonusItemSummary);
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
     *                            type: string
     *                        Bonus Summary Set Items Qty:
     *                            type: string
     *                        Bonus Summary Total Token:
     *                            type: integer
     *                        Bonus Summary Total Stars:
     *                            type: integer
     *                        Bonus Summary Stars Balance:
     *                            type: integer
     *                        Bonus Summary Set Token Balance:
     *                            type: integer
     *     tags:
     *       - Brand Bonus
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
   router.put("/bonus_summary/:BonusSummaryId",auth,Bonus.updateBonusItemSummary)

    // Retrieve all Bonus sets
    /**
     * @swagger
     * /api/bonus_summary:
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
     *       - Brand Bonus
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
    router.get('/bonus_summary', auth, Bonus.bonusSummarylisting);
    app.use("/api", router);
};