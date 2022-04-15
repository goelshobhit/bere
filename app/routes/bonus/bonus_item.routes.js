module.exports = app => {
    const BonusItem = require("../../controllers/bonus/bonus_item.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
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
     *                        Bonus Item Description:
     *                            type: string
     *                        Bonus Item Icons:
     *                            type: string
     *                        Bonus Product Images:
     *                            type: string
     *                        Bonus Item Dollar Value:
     *                            type: number
     *                        User Token Value Not Accepting:
     *                            type: integer
     *                        Bonus Item Qty:
     *                            type: integer
     *                        Bonus Item Remaining Qty:
     *                            type: integer
     *                        Bonus Item Timestamp:
     *                            type: string
     *                        Bonus Item Active:
     *                            type: boolean
     *                        Bonus Item Giveaway Type:
     *                            type: integer
     *                            example: "2: level 2,3: level 3,4: brand prize set ,5: task specific"
     *                        Brand Task:
     *                            type: boolean
     *                        Number Of Task Available:
     *                            type: integer
     *     tags:
     *       - Bonus Item
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
    router.post("/bonus_item", BonusItem.createBonusItem);

    /**
     * @swagger
     * /api/bonus_item/{bonusItemId}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        bonus_item_brand_id:
     *                            type: integer
     *                        bonus_item_name:
     *                            type: string
     *                        bonus_item_description:
     *                            type: string
     *                        bonus_item_icons:
     *                            type: string
     *                        bonus_product_images:
     *                            type: string
     *                        bonus_item_dollar_value:
     *                            type: number
     *                        user_token_value_not_accepting:
     *                            type: integer
     *                        bonus_item_qty:
     *                            type: integer
     *                        bonus_item_remaining_qty:
     *                            type: integer
     *                        bonus_item_timestamp:
     *                            type: string
     *                        bonus_item_is_active:
     *                            type: boolean
     *                        bonus_item_giveaway_type:
     *                            type: integer
     *                            example: "2: level 2,3: level 3,4: brand prize set ,5: task specific"
     *                        brand_task:
     *                            type: boolean
     *                        number_of_tasks_available:
     *                            type: integer
     *     tags:
     *       - Bonus Item
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
    router.put("/bonus_item/:bonusItemId",auth,BonusItem.updateBonusItem);

     /**
   * @swagger
   * /api/bonus_item/{bonusItemId}:
   *   get:
   *     parameters:
   *         - name: bonusItemId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Bonus Item
   *     description: Retrieve Bonus Item with bonusItemId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a bonus Item
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
  router.get("/bonus_item/:bonusItemId",auth, BonusItem.bonusItemDetail);

  /**
   * @swagger
   * /api/bonus_item/{bonusItemId}:
   *   delete:
   *     parameters:
   *         - name: bonusItemId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Bonus Item
   *     description: Delete bonus item with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete bonus item
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
  router.delete("/bonus_item/:bonusItemId", auth, BonusItem.deleteBonusItem); 

     // Retrieve all Bonus Items
    /**
     * @swagger
     * /api/bonus_item:
     *   get:
     *     parameters:
     *         - name: bonusItemId
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
     *              example: bonus_item_id,bonus_item_brand_id,bonus_item_name,bonus_item_qty,bonus_item_remaining_qty,bonus_item_timestamp,bonus_item_is_active,bonus_item_giveaway_type,brand_task,number_of_tasks_available    # Example of a parameter value
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
     *       - Bonus Item
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
    router.get('/bonus_item', auth, BonusItem.bonusItemlisting)
       app.use("/api", router);
};