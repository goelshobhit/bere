module.exports = app => {
    const BonusTicketRules = require("../controllers/bonus_ticket_rules.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
  /**
   * @swagger
   * /api/bonus_tickets_rules:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Bonus Ticket Rules:
   *                            type: string
   *                        How It Works:
   *                            type: string
   *                        Cashout Rules:
   *                            type: string
   *     tags:
   *       - Bonus Tickets Rules
   *     description: Add new Bonus Ticket Rules
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Bonus Ticket Rules
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
	router.post("/bonus_tickets_rules",auth, BonusTicketRules.createBonusTicketRules);
  /**
   * @swagger
   * /api/bonus_tickets_rules/{bonusTicketsRulesId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Bonus Ticket Rules:
   *                            type: string
   *                        How It Works:
   *                            type: string
   *                        Cashout Rules:
   *                            type: string
   *     parameters:
   *         - name: bonusTicketsRulesId
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Bonus Tickets Rules
   *     description: Update Bonus Ticket Rules
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Bonus Ticket Rules updated
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
   router.put("/bonus_tickets_rules/:bonusTicketsRulesId",auth, BonusTicketRules.updateBonusTicketRules);
  /**
   * @swagger
   * /api/bonus_tickets_rules:
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
   *              example: bonus_tickets_rules,bonus_tickets_how_it_works,bonus_tickets_cashout_rules # Example of a parameter value
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
   *       - Bonus Tickets Rules
   *     description: Returns all Bonus Ticket Rules
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Bonus Ticket
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
    router.get('/bonus_tickets_rules',auth, BonusTicketRules.bonusTicketRulesListing)
  /**
   * @swagger
   * /api/bonus_tickets_rules/{bonusTicketsRulesId}:
   *   get:
   *     parameters:
   *         - name: bonusTicketsRulesId
   *           in: path
   *           required: true
   *           schema:
   *              type: string
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
   *       - Bonus Tickets Rules
   *     description: Retrieve a single Bonus Ticket Rules with bonusTicketRulesId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Bonus Ticket Rules
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
    router.get("/bonus_tickets_rules/:bonusTicketsRulesId",auth, BonusTicketRules.bonusTicketRulesDetails);
   /**
   * @swagger
   * /api/bonus_tickets_rules/{bonusTicketsRulesId}:
   *   delete:
   *     parameters:
   *         - name: bonusTicketsRulesId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Bonus Tickets Rules
   *     description: Delete a bonus ticket rules with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a bonus ticket rules
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
    router.delete("/bonus_tickets_rules/:bonusTicketsRulesId", auth, BonusTicket.deleteBonusTicketRules); 
    app.use("/api", router);
};
  