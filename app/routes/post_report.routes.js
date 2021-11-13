const { campaigns } = require("../models");
module.exports = app => {
	const postReport = require("../controllers/post_report.controller");
	var router = require("express").Router();
	const auth = require("../middleware/auth");
    // CREATE CAMPAIGN ROUTE
    /** 
     * @swagger
     * /api/post_report:
     *  post:
     *      requestBody:
     *          required: false
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
	 *                          Post_id:
     *                              type: integer
	 *                              example: "post_id,u_id,comment_id"
	 *                          Report_question:
     *                              type: string
     *                          Report_answer:
     *                              type: string
	 *                          Report_Type:
     *                              type: string
	 *                              example: "post, comment or user"
     *      tags:
     *          - Post Report
     *      description: Add New Report on user,comment and any comment.for user pass u_id in Post_id and user in Report_Type.for post pass post_id in Post_id and post in Report_Type. for comment pass comment_id in Post_id and post in Report_Type
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: Add New Post Report
     *          500:
     *              description: Internal Server Error
     *          401:
     *              description: Unauthorized Access
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: Authorisation Required
    */
    router.post("/post_report",auth,postReport.createpostReport);
    // LIST ALL CAMPAIGN
    /** 
     * @swagger
     * /api/post_report/{postId}:
     *  get:
     *      parameters:
     *          - name: pageNumber
     *            in: query
     *            required: false
     *            schema:
     *                type: integer
     *          - name: sortBy
     *            in: query
     *            required: false
     *            schema:
     *                type: string
     *          - name: sortOrder
     *            in: query
     *            required: false
     *            schema:
     *                type: string
     *                example: ASC,DESC
     *          - name: sortVal
     *            in: query
     *            required: false
     *            schema:
     *                type: string
	 *          - name: report_type
     *            in: query
     *            required: true
     *            schema:
     *                type: string
	 *                example: "post,comment"
     *          -  name: postId
     *             in: path
     *             required: true
     *             schema:
     *                type: integer
     *      tags:
     *          - Post Report
     *      description: Return All Post Report
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: A list of Post Report
     *          401:
     *              descpription: Unauthorized
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: Authorisation Required
    */
    router.get('/post_report/:postId',auth, postReport.listing)
    app.use("/api", router);
}