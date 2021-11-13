module.exports = app => {
  const Posts = require("../controllers/user_posts.controller.js");
  var router = require("express").Router();
   const auth = require("../middleware/auth");
  /**
   * @swagger
   * /api/user_task_posts:
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
   *              example: ucpl_u_id    # Example of a parameter value
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
   *       - User task posts
   *     description: Returns all hashtag
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of hashtag
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
   router.get('/user_task_posts',auth,Posts.listing);
     /**
   * @swagger
   * /api/user_posts:
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
   *              example: ucpl_u_id    # Example of a parameter value
   *         - name: sortOrder
   *           in: query
   *           required: false
   *           schema:
   *              type: string
   *              example: ASC,DESC # Example of a parameter value
   *         - name: userId
   *           in: query
   *           required: required
   *           schema:
   *              type: string
   *         - name: sortId
   *           in: query
   *           required: false
   *           schema:
   *              type: string
   *     tags:
   *       - User task posts
   *     description: To return post of user by userid
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: To return post of user by userid
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
   router.get('/user_posts',auth,Posts.userPostlisting);
  /**
   * @swagger
   * /api/task_posts:
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
   *              example: ucpl_u_id    # Example of a parameter value
   *         - name: sortOrder
   *           in: query
   *           required: false
   *           schema:
   *              type: string
   *              example: ASC,DESC # Example of a parameter value
   *         - name: taskId
   *           in: query
   *           required: required
   *           schema:
   *              type: string
   *         - name: sortId
   *           in: query
   *           required: false
   *           schema:
   *              type: string
   *     tags:
   *       - User task posts
   *     description: To return post by taskId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: To return post by taskId
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
   router.get('/task_posts',auth,Posts.taskPostlisting);
	/**
	* @swagger
	* /api/user_task_posts:
	*   post:
	*     requestBody:
	*        required: false
	*        content:
	*            application/json:
	*                schema:
	*                    type: object
	*                    properties:
	*                        Task id:
	*                            type: integer
	*                        Post hashtags:
	*                            type: string
	*                            example: "#abc,#bcd,#ncb"
	*                        Post insta answers:
    *                            type: array
    *                            items:
    *                              oneOf:
    *                               type: string
    *                            example: {"Question": "How r you?","Ans": "I am fine"}
	*                        Post insta friends:
    *                            example: "@abc,@bcd,@ncb"
	*                        userId:
	*                            type: integer
	*                            example: "Required only in case if admin add post"
    *                        Post Type:
	*                            type: integer
	*                            example: "1 for single 2 for Contest"
	*     tags:
	*       - User task posts
	*     description: Add new user task posts
	*     produces:
	*       - application/json
	*     responses:
	*       201:
	*         description: Add new user task posts
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
	router.post("/user_task_posts", auth, Posts.createNewPost);
  /**
   * @swagger
   * /api/user_task_posts/{content_id}:
   *   get:
   *     parameters:
   *         - name: content_id
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - User task posts
   *     description: Retrieve a single post with content_id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a post
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
    router.get("/user_task_posts/:content_id",auth, Posts.postDetail);
  /**
   * @swagger
   * /api/user_task_post/{post_id}:
   *   get:
   *     parameters:
   *         - name: post_id
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - User task posts
   *     description: Retrieve a single post with post_id or ucpl_id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a post
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
   router.get("/user_task_post/:post_id",auth, Posts.postDetailBYid);
	  /**
   * @swagger
   * /api/related_posts:
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
   *              example: ucpl_u_id    # Example of a parameter value
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
   *         - name: content_id
   *           in: query
   *           required: false
   *           schema:
   *              type: string
   *         - name: task_id
   *           in: query
   *           required: false
   *           schema:
   *              type: string
   *     tags:
   *       - User task posts
   *     description: Returns all hashtag
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of hashtag
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
   router.get('/related_posts',auth,Posts.relatedPosts);
	/**
	 * @swagger
	 * /api/post_to_fav/{post_id}:
	 *   put:
	 *     requestBody:
	 *        required: false
	 *        content:
	 *            application/json:
	 *                schema:
	 *                    type: object
	 *                    properties:
	 *                        addToFav:
	 *                            type: integer
	 *                                    
	 *     parameters:
	 *         - name: post_id
	 *           in: path
	 *           required: true
	 *           schema:
	 *              type: string
	 *     tags:
	 *       - User task posts
	 *     description: Add post as favouritePost
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description: favouritePost updated
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
  router.put("/post_to_fav/:post_id",auth, Posts.favouritePost);
	/**
	 * @swagger
	 * /api/post_not_interested/{post_id}:
	 *   put:
	 *     requestBody:
	 *        required: false
	 *        content:
	 *            application/json:
	 *                schema:
	 *                    type: object
	 *                    properties:
	 *                        notInterested:
	 *                            type: integer
     *                            example: '1: add as not_interested,0:remove as not_interested'
	 *                                    
	 *     parameters:
	 *         - name: post_id
	 *           in: path
	 *           required: true
	 *           schema:
	 *              type: string
	 *     tags:
	 *       - User task posts
	 *     description: post not interested
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description:  post not interested
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
  router.put("/post_not_interested/:post_id",auth, Posts.notInterestedPost);
   /**
   * @swagger
   * /api/delete_post/{post_id}:
   *   delete:
   *     parameters:
   *         - name: post_id
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - User task posts
   *     description: Delete a post with post_id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a post
   *       400:
   *         description: Can not delete other user post
   *       403:
   *         description: post id required
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
  router.delete("/delete_post/:post_id", Posts.deletePost);
   app.use("/api", router);
  };
  