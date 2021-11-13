const { campaigns } = require("../models");
module.exports = app => {
	const Comments_likes = require("../controllers/comments_likes.controller");
	var router = require("express").Router();
	const auth = require("../middleware/auth");
	const access = require("../middleware/access");
    // CREATE CAMPAIGN ROUTE
    /** 
     * @swagger
     * /api/comments_likes:
     *  post:
     *      requestBody:
     *          required: false
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
	 *                          comment_id:
     *                              type: integer
	 *                              example: 1
	 *                          like:
     *                              type: integer
	 *                              example: "0: Unlike,1: Like"
     *      tags:
     *          - Comments likes
     *      description: Add New Comments likes
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: Add New likes
     *          422:
     *              description: Validation Error
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
    router.post("/comments_likes",auth,Comments_likes.createCommentLikes);
    // LIST ALL CAMPAIGN
    /** 
     * @swagger
     * /api/comments_likes:
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
     *                example: cl_post_id,cl_commenter_uid
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
     *      tags:
     *          - Comments likes
     *      description: Return All Comments likes
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: A list of Comments likes
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
    router.get('/comments_likes',auth, Comments_likes.listing)

    // GET SINGLE CAMPAIGN
    /** 
     * @swagger
     * /api/comments_likes/{id}:
     *  get:
     *      parameters:
     *          - name: id
     *            in: path
     *            required: true
     *            schema:
     *                type: integer
     *      tags:
     *          - Comments likes
     *      description: Retrieve a single comment like details
     *      produces:
     *          - application/json:
     *      responses:
     *          200:
     *              description: Details of a comment like details
     *          401:
     *              description: Unauthorized
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: Authorisation Required
    */    
    router.get("/comments_likes/:id",auth,  Comments_likes.commentDetail)
    app.use("/api", router);
}