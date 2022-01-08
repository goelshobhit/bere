module.exports = app => {
    const BonusTicket = require("../../controllers/bonus/bonus_ticket.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
  /**
   * @swagger
   * /api/bonus_tickets:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Bonus Summary:
   *                            type: integer
   *                        Entry Timestamp:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        Start Timestamp:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        End Timestamp:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        Rules Id:
   *                            type: integer
   *                        Rules:
   *                            type: string
   *                        User Id:
   *                            type: integer
   *                        Entry 1:
   *                           type: integer
   *                        Winning:
   *                           type: integer
   *                        Task Id:
   *                           type: integer
   *     tags:
   *       - Bonus Tickets
   *     description: Add new Bonus Ticket
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new Bonus Ticket
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
	router.post("/bonus_tickets",auth, BonusTicket.createBonusTicket);
  /**
   * @swagger
   * /api/bonus_tickets/{bonusTicketId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        bonus_summary_id:
   *                            type: integer
   *                        bonus_ticket_entry_timestamp:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        bonus_ticket_contest_start_timestamp:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        bonus_ticket_contest_end_timestamp:
   *                            format: date-time
   *                            example: 2020-09-30
   *                        bonus_ticket_rules_id:
   *                            type: integer
   *                        bonus_ticket_rules:
   *                            type: string
   *                        bonus_ticket_usrid:
   *                            type: integer
   *                        bonus_ticket_entry1:
   *                           type: integer
   *                        bonus_ticket_winning:
   *                           type: integer
   *                        bonus_ticket_bonus_taskid:
   *                           type: integer
   *     parameters:
   *         - name: bonusTicketId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Bonus Tickets
   *     description: Update Bonus Ticket
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Bonus Ticket updated
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
   router.put("/bonus_tickets/:bonusTicketId",auth, BonusTicket.updateBonusTicket);
  /**
   * @swagger
   * /api/bonus_tickets:
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
   *              example: bonus_summary_id,bonus_ticket_entry_timestamp,bonus_ticket_contest_start_timestamp,bonus_ticket_contest_end_timestamp,bonus_ticket_rules_id,bonus_ticket_rules,bonus_ticket_usrid,bonus_ticket_entry1,bonus_ticket_winning, bonus_ticket_bonus_taskid # Example of a parameter value
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
   *       - Bonus Tickets
   *     description: Returns all Bonus Ticket
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
    router.get('/bonus_tickets',auth, BonusTicket.bonusTicketListing)
  /**
   * @swagger
   * /api/bonus_tickets/{bonusTicketId}:
   *   get:
   *     parameters:
   *         - name: bonusTicketId
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
   *       - Bonus Tickets
   *     description: Retrieve a single Bonus Ticket with bonusTicketId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Bonus Ticket
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
    router.get("/bonus_tickets/:bonusTicketId",auth, BonusTicket.bonusTicketDetails);
   /**
   * @swagger
   * /api/bonus_tickets/{bonusTicketId}:
   *   delete:
   *     parameters:
   *         - name: bonusTicketId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Bonus Tickets
   *     description: Delete a bonus ticket with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a bonus ticket
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
    router.delete("/bonus_tickets/:bonusTicketId", auth, BonusTicket.deleteBonusTicket); 
    app.use("/api", router);
};
  