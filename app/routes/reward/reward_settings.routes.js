module.exports = app => {
    const rewardSettings = require("../../controllers/reward/reward_settings.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
    
    /**
   * @swagger
   * /api/reward_settings:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Token Usd Value:
   *                           type: integer
   *                        Star Token Value:
   *                           type: integer
   *                        Key Token Value:
   *                           type: integer
   *                        Booster Token Value:
   *                           type: integer
   *     tags:
   *       - Reward Settings
   *     description: Add Reward Settings
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add Reward Settings
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
  router.post("/reward_settings", auth, rewardSettings.addRewardSettings);

    

  // Retrieve all Reward Settings Listing
  /**
   * @swagger
   * /api/reward_settings:
   *   get:
   *     parameters:
   *         - name: rewardSettingsId
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
   *              example: reward_settings_id,token_value_in_usd,star_value_in_tokens,key_value_in_tokens,booster_value_in_tokens    # Example of a parameter value
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
   *       - Reward Settings
   *     description: Returns all Reward Settings
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Reward Settings
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
  router.get('/reward_settings', auth, rewardSettings.rewardSettingsListing);


/**
* @swagger
* /api/reward_settings/{rewardSettingsId}:
*   put:
*     requestBody:
*        required: false
*        content:
*            application/json:
*                schema:
*                    type: object
*                    properties:
*                        token_value_in_usd:
*                            type: integer
*                        star_value_in_tokens:
*                            type: integer
*                        key_value_in_tokens:
*                            type: integer
*                        booster_value_in_tokens:
*                            type: integer
*     parameters:
*         - name: rewardSettingsId
*           in: path
*           required: true
*           schema:
*              type: string
*     tags:
*       - Reward Settings
*     description: Update Reward Settings
*     produces:
*       - application/json
*     responses:
*       201:
*         description: Reward Settings updated
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
router.put("/reward_settings/:rewardSettingsId",auth, rewardSettings.updateRewardSettings);

/**
* @swagger
* /api/reward_settings/{rewardSettingsId}:
*   delete:
*     parameters:
*         - name: rewardSettingsId
*           in: path
*           required: true
*           schema:
*              type: integer
*     tags:
*      - Reward Settings
*     description: Delete Reward Settings with id
*     produces:
*       - application/json
*     responses:
*       200:
*         description: Delete Reward Settings
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
router.delete("/reward_settings/:rewardSettingsId", auth, rewardSettings.deleteRewardSettings);
  
app.use("/api", router);
};