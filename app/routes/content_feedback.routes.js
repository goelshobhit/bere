module.exports = app => {
    const content_feedback = require("../controllers/content_feedback.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
    const access = require("../middleware/access");

    /**
   * @swagger
   * /api/content_feedback:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Category Id:
   *                           type: integer
   *                        Question Type:
   *                           type: integer
   *                        Feedback Question:
   *                           type: string
   *                        Feedback Answer:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
  *                               example: ["Answer 1","Answer 2"]
   *     tags:
   *       - Content Feedback 
   *     description: Add Content Feedback 
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add Content Feedback 
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
    router.post("/content_feedback", access, content_feedback.addContentFeedback);

    

    // Retrieve all Content Feedback Listing
    /**
     * @swagger
     * /api/content_feedback:
     *   get:
     *     parameters:
     *         - name: contentFeedbackId
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
     *              example: content_feedback_id,content_feedback_category_id,content_feedback_question_type,content_feedback_question,content_feedback_answers    # Example of a parameter value
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
     *       - Content Feedback 
     *     description: Returns all Content Feedback 
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Content Feedback
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
    router.get('/content_feedback', auth, content_feedback.feedbackListing);


  /**
 * @swagger
 * /api/content_feedback/{contentFeedbackId}:
 *   put:
 *     requestBody:
 *        required: false
 *        content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        content_feedback_category_id:
 *                            type: integer
 *                        content_feedback_question_type:
 *                            type: integer
 *                        content_feedback_question:
 *                            type: string
 *                        content_feedback_answers:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
  *                               example: ["Answer 1","Answer 2"]
 *     parameters:
 *         - name: contentFeedbackId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *       - Content Feedback 
 *     description: Update Content Feedback 
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Content Feedback  updated
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
 router.put("/content_feedback/:contentFeedbackId",access, content_feedback.updateContentFeedback);

 /**
 * @swagger
 * /api/content_feedback/{contentFeedbackId}:
 *   delete:
 *     parameters:
 *         - name: contentFeedbackId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *      - Content Feedback
 *     description: Delete Content Feedback  with id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Delete Content Feedback 
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
router.delete("/content_feedback/:contentFeedbackId", access, content_feedback.deleteContentFeedback);
    
  app.use("/api", router);
};