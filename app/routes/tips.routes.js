module.exports = app => {
    const tips = require("../controllers/tips.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
    const access = require("../middleware/access");

    /**
   * @swagger
   * /api/tips:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Heading:
   *                           type: string
   *                        Sub Heading:
   *                           type: string
   *                        Description:
   *                           type: string
   *                        Image:
   *                           type: string
   *     tags:
   *       - Tips
   *     description: Add tips
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add tips
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
    router.post("/tips", access, tips.addTips);

   // Retrieve all Tips Listing
    /**
     * @swagger
     * /api/tips:
     *   get:
     *     parameters:
     *         - name: tipId
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
     *              example: id,heading,sub_heading,description,tips_created_at,tips_updated_at    # Example of a parameter value
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
     *       - Tips
     *     description: Returns all Tips
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Tips
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
    router.get('/tips', auth, tips.tipsListing);

    

    /**
   * @swagger
   * /api/tips/{tipId}:
   *   get:
   *     parameters:
   *         - name: tipId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - tips
   *     description: Retrieve tips with tipId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a tips
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
  router.get("/tips/:tipId",auth, tips.tipsDetails);

  /**
 * @swagger
 * /api/tips/{tipId}:
 *   put:
 *     requestBody:
 *        required: false
 *        content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        tips_question:
 *                            format: string
 *                        tips_answer:
 *                            type: string
 *     parameters:
 *         - name: tipId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *       - Tips
 *     description: Update tips
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: tips updated
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
 router.put("/tips/:tipId",access, tips.updateTips);

 /**
 * @swagger
 * /api/tips/{tipId}:
 *   delete:
 *     parameters:
 *         - name: tipId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *      - Tips
 *     description: Delete tips with id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Delete tips
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
router.delete("/tips/:tipId", access, tips.deleteTips);
    
  app.use("/api", router);
};