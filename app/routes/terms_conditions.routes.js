module.exports = app => {
    const terms_conditions = require("../controllers/terms_conditions.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    /**
   * @swagger
   * /api/terms_conditions:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Description:
   *                           type: string
   *     tags:
   *       - Terms & Conditions
   *     description: Add Terms & Conditions
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add Terms & Conditions
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
    router.post("/terms_conditions", auth, terms_conditions.addTermsConditions);

    

    // Retrieve all Terms & Conditions Listing
    /**
     * @swagger
     * /api/terms_conditions:
     *   get:
     *     parameters:
     *         - name: termId
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
     *              example: id,description    # Example of a parameter value
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
     *       - Terms & Conditions
     *     description: Returns all Terms & Conditions
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Terms & Conditions
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
    router.get('/terms_conditions', auth, terms_conditions.termsListing);

  
  /**
 * @swagger
 * /api/terms_conditions/{termsId}:
 *   put:
 *     requestBody:
 *        required: false
 *        content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        description:
 *                            format: string
 *     parameters:
 *         - name: termsId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *       - Terms & Conditions
 *     description: Update Terms & Conditions
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Terms & Conditions updated
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
 router.put("/terms_conditions/:termsId",auth, terms_conditions.updateTermsConditions);

 /**
 * @swagger
 * /api/terms_conditions/{termsId}:
 *   delete:
 *     parameters:
 *         - name: termsId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *      - Terms & Conditions
 *     description: Delete Terms & Conditions with id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Delete Terms & Conditions
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
router.delete("/terms_conditions/:termsId", auth, terms_conditions.deleteTerms);

// Retrieve all Terms & Conditions Listing
    /**
     * @swagger
     * /api/system_basic_listing:
     *   get:
     *     parameters:
     *     tags:
     *       - System Basic Listing
     *     description: Returns all Terms & Conditions, FAQ, Tips
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Terms & Conditions, FAQ, Tips
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
    router.get('/system_basic_listing', auth, terms_conditions.allSystemBasicListing);
    
  app.use("/api", router);
};