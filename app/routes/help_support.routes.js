module.exports = app => {
    const helpSupport = require("../controllers/help_support.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    /**
   * @swagger
   * /api/help_support:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Email:
   *                           type: string
   *                        Content:
   *                           type: string
   *     tags:
   *       - Help & Support
   *     description: Send Help & Support Email
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Send Help & Support Email
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
    router.post("/help_support", auth, helpSupport.sendhelpSupportEmail);

   // Retrieve all Help & Support Listing
    /**
     * @swagger
     * /api/help_support:
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
     *              example: help_support_id,user_id,email,created_at,updated_at    # Example of a parameter value
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
     *       - Help & Support
     *     description: Returns all Help & Support Content Listing
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Help & Support Content
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
    router.get('/help_support', auth, helpSupport.helpSupportListing);
    app.use("/api", router);
};