module.exports = app => {
    const BonusItemSet = require("../../controllers/bonus/bonus_item_set.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
    const access = require("../../middleware/access");
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
     *                        Bonus Item ids:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: integer
     *                            example: ["1","2"]
     *                        Bonus Set Item Name:
     *                            type: string
     *                        Bonus Set Item Qty:
     *                            type: integer
     *                        Bonus Set Icons:
     *                            type: string
     *                        Bonus Set Images:
     *                            type: string
     *                        Bonus Set Start Date:
     *                            type: string
     *                            format: date-time
     *                            example: 2022-04-07
     *                        Bonus Set Default:
     *                            type: integer
     *                        Bonus Set Item Timestamp:
     *                            type: string
     *                        Bonus Set Status:
     *                            type: integer
     *                        Bonus Set Duration:
     *                            type: integer
     *                        Bonus Rule Ids:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: integer
     *                            example: ["1","2"]
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
    router.post("/bonus_set", access, BonusItemSet.createBonusItemSet);
    
   /**
     * @swagger
     * /api/bonus_set/{bonusSetId}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        bonus_set_brand_id:
     *                            type: integer
     *                        bonus_item_id:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: integer
     *                            example: ["1","2"]
     *                        bonus_set_item_name:
     *                            type: string
     *                        bonus_set_item_qty:
     *                            type: integer
     *                        bonus_set_duration:
     *                            type: string
     *                        bonus_tickets_rules_ids:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: integer
     *                            example: ["1","2"]
     *                        bonus_set_icons:
     *                            type: string
     *                        bonus_set_images:
     *                            type: string
     *                        bonus_set_start_date:
     *                            type: string
     *                            format: date-time
     *                            example: 2022-04-07
     *                        bonus_set_default:
     *                            type: integer
     *                        bonus_set_item_timestamp:
     *                            type: string
     *                        bonus_set_status:
     *                            type: integer
     *     tags:
     *       - Bonus Item Set
     *     description: Update bonus Item Set
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Update bonus Item Item
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
    router.put("/bonus_set/:bonusSetId",access,BonusItemSet.updateBonusSet);

    /**
   * @swagger
   * /api/bonus_set/{bonusSetId}:
   *   delete:
   *     parameters:
   *         - name: bonusSetId
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
  router.delete("/bonus_set/:bonusSetId", access, BonusItemSet.deleteBonusSet); 

    // Retrieve all Bonus sets
    /**
     * @swagger
     * /api/bonus_set:
     *   get:
     *     parameters:
     *         - name: bonusSetId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: bonusSetDefault
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: brandId
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