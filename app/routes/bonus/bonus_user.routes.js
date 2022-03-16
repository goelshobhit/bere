module.exports = app => {
    const BonusUser = require("../../controllers/bonus/bonus_user.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
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
     *                        Bonus User Id:
     *                            type: integer
     *                        Bonus user Reddim Level:
     *                            type: integer
     *                        Bonus user Followers riddim:
     *                            type: integer
     *                        Bonus User History Not Won:
     *                            type: integer
     *     tags:
     *       - Bonus User
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
    router.post("/bonus_user", BonusUser.createBonusUser);

    // Retrieve all Bonus Users
    /**
     * @swagger
     * /api/bonus_user:
     *   get:
     *     parameters:
     *         - name: BonusUserId
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
     *       - Bonus User
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
    router.get('/bonus_user', auth, BonusUser.bonusUserlisting)
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
     *                        bonus_usr_id:
     *                            type: integer
     *                        bonus_usr_riddim_level:
     *                            type: integer
     *                        bonus_usr_history_not_won:
     *                            type: integer
     *                        bonus_usr_followers_riddim:
     *                            type: integer
     *     tags:
     *       - Bonus User
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
    router.put("/bonus_user/:BonusUserId",auth,BonusUser.updateBonusUser);

     /**
   * @swagger
   * /api/bonus_user/{bonusUserId}:
   *   delete:
   *     parameters:
   *         - name: bonusUserId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Bonus User
   *     description: Delete bonus user with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete bonus user
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
  router.delete("/bonus_user/:bonusUserId", auth, BonusUser.deleteBonusUser); 

   /**
   * @swagger
   * /api/bonus_user/{bonusUserId}:
   *   get:
   *     parameters:
   *         - name: bonusUserId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
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
   *       - Bonus User
   *     description: Retrieve a single Bonus User Detail with bonusUserId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Bonus User
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
  router.get("/bonus_user/:bonusUserId",auth, BonusUser.bonusUserDetails);
  app.use("/api", router);
};