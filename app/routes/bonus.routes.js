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
    // Retrieve all Bonus Items
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
    router.get('/bonus_set', auth, Bonus.bonusSetlisting)
    app.use("/api", router);
};