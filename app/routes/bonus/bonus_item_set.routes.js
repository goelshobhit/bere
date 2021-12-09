module.exports = app => {
    const BonusItemSet = require("../../controllers/bonus/bonus_item_set.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
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
     *                        Bonus Set Brand Id:
     *                            type: integer
     *                        Bonus Item id:
     *                            type: integer
     *                        Bonus Set Item Name:
     *                            type: string
     *                        Bonus Set Item Qty:
     *                            type: integer
     *                        Bonus Set Item Timestamp:
     *                            type: string
     *                        Bonus Set Status:
     *                            type: integer
     *     tags:
     *       - Bonus Item Set
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
    router.post("/bonus_set", BonusItemSet.createBonusItemSet);
    
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
     *       - Bonus Item Set
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
    router.put("/bonus_set/:BonusSetId",auth,BonusItemSet.updateBonusSet);

    /**
   * @swagger
   * /api/bonus_set/{BonusSetId}:
   *   delete:
   *     parameters:
   *         - name: BonusSetId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Bonus Item Set
   *     description: Delete Bonus Set with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete Bonus Set
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
  router.delete("/bonus_set/:BonusSetId", auth, BonusItemSet.deleteBonusSet); 

    // Retrieve all Bonus sets
    /**
     * @swagger
     * /api/bonus_set:
     *   get:
     *     parameters:
     *         - name: BonusSetId
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
     *       - Bonus Item Set
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
    router.get('/bonus_set', auth, BonusItemSet.bonusSetlisting);
      app.use("/api", router);
};