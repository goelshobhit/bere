module.exports = app => {
    const tickets_distribution = require("../controllers/tickets_distribution.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    /**
   * @swagger
   * /api/tickets_distribution:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        User Id:
   *                           type: integer
   *                        Ticket Earned:
   *                           type: integer
   *                        Random Number Algo:
   *                           type: integer
   *     tags:
   *       - Tickets Distribution
   *     description: Add User Tickets
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add User Tickets
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
    router.post("/tickets_distribution", auth, tickets_distribution.addUserTickets);

    

    // Retrieve all ticket distribution listing
    /**
     * @swagger
     * /api/tickets_distribution:
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
     *              example: tickets_distribution_id,tickets_distribution_user_id,tickets_distribution_user_tickets_earned,tickets_distribution_random_number_algo,td_created_at,td_updated_at    # Example of a parameter value
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
     *       - Tickets Distribution
     *     description: Returns all Tickets Distribution
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Tickets Distribution
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
    router.get('/tickets_distribution', auth, tickets_distribution.ticketDistributionListing)

    
  app.use("/api", router);
};