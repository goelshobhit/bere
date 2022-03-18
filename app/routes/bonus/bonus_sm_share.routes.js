module.exports = app => {
    const BonusSMShare = require("../../controllers/bonus/bonus_sm_share.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
    
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
     *       - Bonus Social Media Share
     *     description: Add Bonus Share on social media
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add Bonus Share on social media
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
    router.post("/bonus_sm_share", BonusSMShare.createBonusSocialMediaShare);

    /**
     * @swagger
     * /api/bonus_sm_share/{BonusSMShareId}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        bonus_sm_name:
     *                            type: string
     *                        bonus_sm_share_user_id:
     *                            type: string
     *                        bonus_sm_share_timestamp:
     *                            type: string
     *                        bonus_sm_share_ack:
     *                            type: string
     *                        bonus_sm_share_url:
     *                            type: string
     *     tags:
     *       - Bonus Social Media Share
     *     description: Update Bonus Share on social media
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Update Bonus Share on social media
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
    router.put("/bonus_sm_share/:BonusSMShareId", BonusSMShare.updateBonusSocialMediaShare);
    
    // Retrieve all Bonus SM share users
    /**
     * @swagger
     * /api/bonus_sm_share:
     *   get:
     *     parameters:
     *         - name: BonusSMShareId
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
     *       - Bonus Social Media Share
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
    router.get('/bonus_sm_share', auth, BonusSMShare.smSharelisting)
 
  /**
   * @swagger
   * /api/bonus_sm_share/{BonusSMShareId}:
   *   delete:
   *     parameters:
   *         - name: BonusSMShareId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Bonus Social Media Share
   *     description: Delete bonus social share with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete bonus social share
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
  router.delete("/bonus_sm_share/:BonusSMShareId", auth, BonusSMShare.deleteSmShareRecord); 
  app.use("/api", router);
};