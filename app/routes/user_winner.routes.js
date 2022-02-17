module.exports = app => {
    const user_winner = require("../controllers/user_winner.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    /**
   * @swagger
   * /api/winner:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Bonus Task Id:
   *                           type: integer
   *                        Bonus Task Completion Date:
   *                           type: date
   *                           example: 2022-02-16
   *                        Winner User Id:
   *                           type: integer
   *     tags:
   *       - Winner
   *     description: Add Winner
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add Winner
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
    router.post("/winner", auth, user_winner.addWinner);

    

    // Retrieve all winner listing
    /**
     * @swagger
     * /api/winner:
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
     *              example: winner_algo_id,bonus_task_id,bonus_task_complete_time,winner_user_id,wa_created_at,wa_updated_at    # Example of a parameter value
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
     *       - Winner
     *     description: Returns all Winners
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Winners
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
    router.get('/winner', auth, user_winner.winnerListing)

    
  app.use("/api", router);
};