module.exports = app => {
  const Comments = require("../controllers/user_post_comments.controller.js");
  var router = require("express").Router();
  const auth = require("../middleware/auth");   
   /**
     * @swagger
     * /api/post_comments:
     *   post:
     *     requestBody:
     *        content:
     *            multipart/form-data:
     *                schema:
     *                    type: object
     *                    properties:
     *                        comment_file:
     *                            type: array
     *                            items:
     *                             type: string
     *                             format: binary
     *                        Comment:
     *                            type: string
     *                            required: true
     *                            example: "Yes ,i have tested it."
     *                        Post id:
     *                            type: interger
     *                            required: true
     *                            example: "1"
     *                        comment_id:
     *                            type: interger
     *                            required: true
     *                            example: "1"
     *                        comment_mid:
     *                            type: interger
     *                            required: true
     *                            example: "1"
     *     tags:
     *       - Post Comments
     *     description: Add Post comments with comment_file,comment
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Post comments added succesfully
     *       400:
     *         description: job_id and Post comment data required
     *       500:
     *         description: Error when trying upload many files
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
    router.post("/post_comments", auth,Comments.createPostComment);
  /**
   * @swagger
   * /api/all_post_comments:
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
   *              example: pc_post_id,ucpl_id    # Example of a parameter value
   *         - name: sortOrder
   *           in: query
   *           required: false
   *           schema:
   *              type: string
   *              example: ASC,DESC # Example of a parameter value
   *         - name: sortVal
   *           in: query
   *           required: false
   *           schema:
   *              type: string
   *     tags:
   *       - Post Comments
   *     description: Returns all Post Comments
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Post Comments
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
   router.get('/all_post_comments',Comments.listing);
  /**
   * @swagger
   * /api/post_comments:
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
   *              example: pc_post_id,ucpl_id    # Example of a parameter value
   *         - name: sortOrder
   *           in: query
   *           required: false
   *           schema:
   *              type: string
   *              example: ASC,DESC # Example of a parameter value
   *         - name: sortVal
   *           in: query
   *           required: false
   *           schema:
   *              type: string
   *         - name: pageSize
   *           in: query
   *           required: false
   *           schema:
   *              type: string
   *         - name: postId
   *           in: query
   *           required: false
   *           schema:
   *              type: required
   *     tags:
   *       - Post Comments
   *     description: Returns all Post Comments
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Post Comments
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
   router.get('/post_comments',auth,Comments.postCommentslisting);
   /**
   * @swagger
   * /api/post_comment_comments:
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
   *              example: pc_post_id,ucpl_id    # Example of a parameter value
   *         - name: sortOrder
   *           in: query
   *           required: false
   *           schema:
   *              type: string
   *              example: ASC,DESC # Example of a parameter value
   *         - name: sortVal
   *           in: query
   *           required: false
   *           schema:
   *              type: string
   *         - name: comment_id
   *           in: query
   *           required: false
   *           schema:
   *              type: required
   *     tags:
   *       - Post Comments
   *     description: Returns all Post Comments of a comment
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Post Comments of a comment
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
  router.get('/post_comment_comments',Comments.Commentslisting);
   /**
   * @swagger
   * /api/post_comments/{id}:
   *   get:
   *     parameters:
   *         - name: id
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Post Comments 
   *     description: Retrieve a single comment with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a comment
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
   router.get("/post_comments/:id", Comments.commentDetail);
  /**
   * @swagger
   * /api/post_comments/{comment_id}:
   *   delete:
   *     parameters:
   *         - name: comment_id
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Post Comments 
   *     description: Delete a comment with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a comment
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
   router.delete("/post_comments/:comment_id", auth,Comments.deleteComment);
	app.use("/api", router);
};