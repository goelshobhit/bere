module.exports = app => {
    const faq = require("../controllers/faq.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    /**
   * @swagger
   * /api/faq:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        FAQ Question:
   *                           type: string
   *                        FAQ Answer:
   *                           type: string
   *     tags:
   *       - Faq
   *     description: Add FAQ
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add FAQ
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
    router.post("/faq", auth, faq.addFAQ);

    

    // Retrieve all FAQ Listing
    /**
     * @swagger
     * /api/faq:
     *   get:
     *     parameters:
     *         - name: faqId
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
     *              example: faq_id,faq_question,faq_answer    # Example of a parameter value
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
     *       - Faq
     *     description: Returns all FAQ
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of FAQs
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
    router.get('/faq', auth, faq.faqListing);

    /**
   * @swagger
   * /api/faq/{faqId}:
   *   get:
   *     parameters:
   *         - name: faqId
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Faq
   *     description: Retrieve FAQ with faqId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a FAQ
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
  router.get("/faq/:faqId",auth, faq.faqDetails);

  /**
 * @swagger
 * /api/faq/{faqId}:
 *   put:
 *     requestBody:
 *        required: false
 *        content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        faq_question:
 *                            format: string
 *                        faq_answer:
 *                            type: string
 *     parameters:
 *         - name: faqId
 *           in: path
 *           required: true
 *           schema:
 *              type: string
 *     tags:
 *       - Faq
 *     description: Update FAQ
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: FAQ updated
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
 router.put("/faq/:faqId",auth, faq.updateFAQ);

 /**
 * @swagger
 * /api/faq/{faqId}:
 *   delete:
 *     parameters:
 *         - name: faqId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *      - Faq
 *     description: Delete FAQ with id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Delete FAQ
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
router.delete("/faq/:faqId", auth, faq.deleteFAQ);
    
  app.use("/api", router);
};