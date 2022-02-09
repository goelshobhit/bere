module.exports = app => {
    const BonusTicketRules = require("../../controllers/bonus/bonus_ticket_rules.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
    /**
   * @swagger
   * /api/bonus_tickets_rule:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Bonus Ticket Rule Name:
   *                            type: string
   *     tags:
   *       - Bonus Tickets Rules
   *     description: Add new Bonus Ticket Rule
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Bonus Ticket Rule
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
  router.post("/bonus_tickets_rule",auth, BonusTicketRules.addBonusTicketRule);
  
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
   * /api/bonus_tickets_rule:
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
   *              example: bonus_tickets_rules_id,bonus_tickets_rule_name,bonus_tickets_rule_created_at,bonus_tickets_rule_updated_at # Example of a parameter value
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
   *       - Bonus Tickets Rule
   *     description: Returns all Bonus Ticket Rule Name with ID
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Bonus Ticket Rule Name with ID
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
  router.get('/bonus_tickets_rule',auth, BonusTicketRules.bonusTicketRuleListing)

  /**
   * @swagger
   * /api/bonus_tickets_rules/{bonusTicketsRulesAutoId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        bonus_tickets_rule_id:
   *                            type: integer
   *                        bonus_tickets_rules:
   *                            type: object
   *                            properties:
   *                               user_id
   *                        bonus_tickets_how_it_works:
   *                            type: string
   *                        bonus_tickets_cashout_rules:
   *                            type: string
   *     parameters:
   *         - name: bonusTicketsRulesAutoId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
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
   router.put("/bonus_tickets_rules/:bonusTicketsRulesAutoId",auth, BonusTicketRules.updateBonusTicketRules);
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
   * /api/bonus_tickets_rules/{bonusTicketsRulesAutoId}:
   *   get:
   *     parameters:
   *         - name: bonusTicketsRulesAutoId
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
   *       - Bonus Tickets Rules
   *     description: Retrieve a single Bonus Ticket Rules with bonusTicketsRulesAutoId
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
    router.get("/bonus_tickets_rules/:bonusTicketsRulesAutoId",auth, BonusTicketRules.bonusTicketRulesDetails);
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
   *                        Bonus Tickets Rules Id:
   *                            type: integer
   *                        Bonus Ticket Rules:
   *                            type: object
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
   * /api/bonus_tickets_rules/{bonusTicketsRulesAutoId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        bonus_tickets_rules_id:
   *                            type: integer
   *                        bonus_tickets_rules:
   *                            type: object
   *                        bonus_tickets_how_it_works:
   *                            type: string
   *                        bonus_tickets_cashout_rules:
   *                            type: string
   *     parameters:
   *         - name: bonusTicketsRulesAutoId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
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
   router.put("/bonus_tickets_rules/:bonusTicketsRulesAutoId",auth, BonusTicketRules.updateBonusTicketRules);
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
   *              example: bonus_tickets_rules_autoid,bonus_tickets_rules_id,bonus_tickets_how_it_works,bonus_tickets_cashout_rules # Example of a parameter value
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
   * /api/bonus_tickets_rules/{bonusTicketsRulesAutoId}:
   *   get:
   *     parameters:
   *         - name: bonusTicketsRulesAutoId
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
   *       - Bonus Tickets Rules
   *     description: Retrieve a single Bonus Ticket Rules with bonusTicketsRulesAutoId
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
    router.get("/bonus_tickets_rules/:bonusTicketsRulesAutoId",auth, BonusTicketRules.bonusTicketRulesDetails);
   /**
   * @swagger
   * /api/bonus_tickets_rules/{bonusTicketsRulesAutoId}:
   *   delete:
   *     parameters:
   *         - name: bonusTicketsRulesAutoId
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
    router.delete("/bonus_tickets_rules/:bonusTicketsRulesAutoId", auth, BonusTicketRules.deleteBonusTicketRules); 
    app.use("/api", router);
};
  