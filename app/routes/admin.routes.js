module.exports = app => {
    const Users = require("../controllers/admin.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
	const access = require("../middleware/access");
    const adminValidate = require("../middleware/adminValidate");
    /**
     * @swagger
     * /api/admin_users:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        User name:
     *                            type: string
     *                        User email:
     *                            type: string
     *                        User password:
     *                            type: string
     *                        User status:
     *                            type: integer
     *                        User role:
     *                            type: integer
     *     tags:
     *       - Admin User
     *     description: Add new user
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add new admin
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
    router.post("/admin_users",auth, access, adminValidate.validate("create_admin"), Users.createNewAdmin);
    /**
     * @swagger
     * /api/admin_users:
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
     *              example: au_user_id,au_email,au_name,au_active_status    # Example of a parameter value
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
     *       - Admin Users
     *     description: Returns all admin users
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of users
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
    router.get('/admin_users',auth, access, Users.listing)

    // Retrieve a single Brand with brandID
    /**
     * @swagger
     * /api/admin_users/{userID}:
     *   get:
     *     parameters:
     *         - name: userID
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *     tags:
     *       - Admin Users
     *     description: Retrieve a single Admin with Usersid
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Details of a Admin
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
    router.get("/admin_users/:userID", auth, access, Users.userDetail);
	// Retrieve a admin_setting
    /**
     * @swagger
     * /api/admin_setting:
     *   get:
     *     tags:
     *       - Admin Users
     *     description: Retrieve a admin setting
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: admin setting result
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
    router.get("/admin_setting", auth, access, Users.adminSetting);
	/**
     * @swagger
     * /api/admin_setting:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        ad_conversion_rate:
     *                            type: integer
     *                        ad_min_withdraw_limit:
     *                            type: integer
     *                        ad_max_withdraw_limit:
     *                            type: integer
     *     tags:
     *       - Admin Users
     *     description: Update Admin setting 
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Admin setting  updated
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
    router.put("/admin_setting",auth, access, Users.updateadminSetting);
    /**
     * @swagger
     * /api/admin_users/{userID}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        au_email:
     *                            type: string
     *                        au_name:
     *                            type: string
     *                        au_active_status:
     *                            type: integer
     *                        ar_role_id:
     *                            type: integer
     *                        au_is_deleted:
     *                            type: integer
     *     parameters:
     *         - name: userID
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *     tags:
     *       - Admin Users
     *     description: Update Admin
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Admin updated
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
    router.put("/admin_users/:userID",auth, access, adminValidate.validate("update_admin"), Users.updateUser);
    /**
     * @swagger
     * /api/admin_users/login:
     *   post:
     *     requestBody:
     *        required: true
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        email:
     *                            type: string
     *                        password:
     *                            type: string
     *     tags:
     *       - Admin Users
     *     description: Login to the application
     *     security:  []
     *     produces:
     *       - application/json
     *     responses:
     *        200:
     *            description: Login successful
     *            content:
     *                application/json:
     *                    schema:
     *                        type: object
     *                        properties:
     *                            data:
     *                                type: object
     *                                properties:
     *                                    user_id:
     *                                        type: integer
     *                                        format: int64
     *                                        example: 4
     *                                    name:
     *                                        type: string
     *                                        example: John Doe
     *                                    user_role:
     *                                        type: string
     *                                        example: Designer
     *                                    user_role_id:
     *                                        type: integer
     *                                        format: int64
     *                                        example: 2
     *                            access_token:
     *                                type: string
     *                                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1ODc2MTM0MDMsImV4cCI6MTU4NzYxNzAwM30.VW0msq1TdvCOXwn-To5i-5lZeNyAjWSIeCGeW_Jj1p0"
     *        500:
     *            description: Internal server error
     *            content:
     *                application/json:
     *                    schema:
     *                        type: object
     *                        properties:
     *                            message:
     *                                type: string
     *                                example: internal server error
     *        422:
     *            description: Validation failed
     *            content:
     *                application/json:
     *                    schema:
     *                        type: object
     *                        properties:
     *                            message:
     *                                type: string
     *                                example: email and password required
     *        404:
     *            description: user does not exists
     *            content:
     *                application/json:
     *                    schema:
     *                        type: object
     *                        properties:
     *                            message:
     *                                type: string
     *                                example: user does not exists
     *
     *        400:
     *            description: Bad request
     *            content:
     *                application/json:
     *                    schema:
     *                        type: object
     *                        properties:
     *                            message:
     *                                type: string
     *                                example: email or password is incorrect
     *
     */
    router.post("/admin_users/login", Users.userlogin);
	/**
     * @swagger
     * /api/constants:
     *   get:
     *     tags:
     *       - Admin Users
     *     description: Returns all admin site Constants
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of users
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
    router.get('/constants', Users.constantsVariables)
	 /**
     * @swagger
     * /api/app_feedback:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Subject:
     *                            type: string
     *                        Message:
     *                            type: string
     *     tags:
     *       - User Admin feedback
     *     description: Add new user Feedback
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add new user Feedback
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
    router.post("/app_feedback",auth,Users.createUserFeedback);
	    /**
     * @swagger
     * /api/app_feedback:
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
     *              example: uf_u_id    # Example of a parameter value
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
     *       - User Admin feedback
     *     description: Returns all user feedbacks to admin
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Returns all user feedbacks to admin
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
    router.get('/app_feedback',auth,Users.feedbacklisting)
    
    app.use("/api", router);
};
