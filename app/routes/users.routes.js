const { body } = require("express-validator");
const validator = require("../helpers/validator");
module.exports = (app) => {
  const Users = require("../controllers/users.controller.js");
  const test = require("../controllers/test.js");
  var router = require("express").Router();
  const auth = require("../middleware/auth");
  const access = require("../middleware/access");
  /**
   * @swagger
   * /api/users:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Referer id:
   *                            type: integer
   *                        Account type:
   *                            type: integer
   *                        User login:
   *                            type: string
   *                        User password:
   *                            type: string
   *                        User email:
   *                            type: string
   *                        User fb name:
   *                            type: string
   *                        Fb id:
   *                            type: string
   *                        User gmail name:
   *                            type: string
   *                        Gmail id:
   *                            type: string
   *                        User ymail name:
   *                            type: string
   *                        Ymail id:
   *                            type: string
   *                        User pref login:
   *                            type: integer
   *                        User instagram name:
   *                            type: string
   *                        Instagram id:
   *                            type: string
   *                        User status:
   *                            type: boolean
   *                        User Type:
   *                            type: string
   *                            example: "Normal,Fb,Gmail,Ymail,Instagram"
   *     tags:
   *       - Users
   *     description: Add new user
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new user
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
  router.post("/users", Users.createNewUser);

  /**
   * @swagger
   * /api/users/v1:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        username:
   *                            type: string
   *                        display_name:
   *                            type: string
   *                        first_name:
   *                            type: string
   *                        last_name:
   *                            type: string
   *                        password:
   *                            type: string
   *                        email:
   *                            type: string
   *                        date_of_birth:
   *                            type: string
   *                        country_code:
   *                            type: string
   *                        phonenumber:
   *                            type: string
   *                        facebook_handle:
   *                            type: string
   *                        twitter_handle:
   *                            type: string
   *                        pinterest_handle:
   *                            type: integer
   *                        instagram_handle:
   *                            type: string
   *                        tiktok_handle:
   *                            type: string
   *                        snapchat_handle:
   *                            type: string
   *                        status:
   *                            type: boolean
   *                        user_type:
   *                            type: string
   *                            example: "Normal,Fb,Gmail,Ymail,Instagram"
   *                        referer_id:
   *                            type: string
   *                        address:
   *                            type: string
   *                        city:
   *                            type: string
   *                        zipcode:
   *                            type: string
   *                        state:
   *                            type: string
   *                        country:
   *                            type: string
   *                        account_type:
   *                            type: string
   *                        account_section:
   *                            type: string
   *                        bio:
   *                            type: string
   *                        job_title:
   *                            type: string
   *     tags:
   *       - Users
   *     description: Add new user
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new user
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

  router.post("/users/v1", [
    [
      body("username").exists().trim(),
      body("email").exists().trim(),
      body("password").exists().trim(),
      body("display_name").exists().trim(),
      body("first_name").optional().trim(),
      body("last_name").optional().trim(),
      validator,
    ],
    Users.registerUser,
  ]);
  /**
   * @swagger
   * /api/users:
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
   *              example: u_id,u_email,u_gmail_username,u_fb_username,u_ymail_username    # Example of a parameter value
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
   *       - Users
   *     description: Returns all users
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
  router.get("/users", auth, Users.listing);
  router.get("/users/v1", auth, Users.listingv2);

  router.post("/test", test.fetchCmsDetails);
  /**
   * @swagger
   * /api/users/{userID}:
   *   get:
   *     parameters:
   *         - name: userID
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *         - name: pageSize
   *           in: path
   *           required: false
   *           schema:
   *              type: integer
   *         - name: pageNumber
   *           in: path
   *           required: false
   *           schema:
   *              type: integer
   *     tags:
   *       - Users
   *     description: Retrieve a single User details with Role id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a User details
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
  router.get("/users/:userID", auth, Users.userDetail);

  /**
   * @swagger
   * /api/user_details/{userID}:
   *   get:
   *     parameters:
   *         - name: userID
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Users
   *     description: Retrieve a single User details to use in CMS
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a User details
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
  router.get("/user_details/:userID", auth, Users.userDetailForAdmin);

  /**
   * @swagger
   * /api/user/details:
   *   get:
   *     tags:
   *       - Users
   *     description: Retrieve a single User details to use in CMS
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a User details
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
  router.get("/user/details", auth, Users.getMyDetails);

  /**
   * @swagger
   * /api/user_brand_task_detail/{userID}:
   *   get:
   *     parameters:
   *         - name: userID
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *         - name: brandId
   *           in: query
   *           required: false
   *           schema:
   *              type: integer
   *     tags:
   *       - Users
   *     description: Retrieve Brand Task details for Single User
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Brand Task Listing for User.
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
  router.get(
    "/user_brand_task_detail/:userID",
    auth,
    Users.userBrandTaskDetails
  );

  /**
   * @swagger
   * /api/users/{userID}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        u_email:
   *                            type: string
   *                        u_login:
   *                            type: string
   *                        u_acct_type:
   *                            type: integer
   *                        u_act_sec:
   *                            type: integer
   *                        u_active:
   *                            type: boolean
   *                        u_fb_username:
   *                            type: string
   *                        u_fb_id:
   *                            type: integer
   *                        u_gmail_username:
   *                            type: string
   *                        u_gmail_id:
   *                            type: integer
   *                        u_ymail_username:
   *                            type: string
   *                        u_ymail_id:
   *                            type: integer
   *                        u_instagram_username:
   *                            type: string
   *                        u_instagram_id:
   *                            type: integer
   *                        u_pref_login:
   *                            type: integer
   *     parameters:
   *         - name: userID
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Users
   *     description: Update Users
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Users updated
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
  router.put("/users/:userID", auth, Users.updateUser);
  /**
   * @swagger
   * /api/users_profile/{userID}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        u_display_name:
   *                            type: string
   *                        u_profile_name:
   *                            type: string
   *                        u_f_name:
   *                            type: string
   *                        u_l_name:
   *                            type: string
   *                        u_dob_d:
   *                            type: integer
   *                        u_dob_y:
   *                            type: integer
   *                        u_gender:
   *                            type: integer
   *                        u_address:
   *                            type: string
   *                        u_city:
   *                            type: string
   *                        u_state:
   *                            type: string
   *                        u_country:
   *                            type: string
   *                        u_zipcode:
   *                            type: string
   *                        u_prof_img_path:
   *                            type: string
   *                        u_phone:
   *                            type: string
   *                        u_status:
   *                            type: string
   *                        u_has_children:
   *                            type: integer
   *                        u_edu_level:
   *                            type: integer
   *                        u_profession:
   *                            type: integer
   *                        u_property:
   *                            type: integer
   *                        u_vehicle:
   *                            type: integer
   *                        u_vin:
   *                            type: integer
   *                        u_website:
   *                            type: string
   *     parameters:
   *         - name: userID
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Users
   *     description: Update Users
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Users updated
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
  router.put("/users_profile/:userID", auth, Users.updateUserProfile);
  /**
   * @swagger
   * /api/user_social_profile/{userID}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        use_u_facebook_link:
   *                            type: string
   *                        use_u_instagram_link:
   *                            type: string
   *                        use_u_twitter_link:
   *                            type: string
   *                        use_u_pinterest_link:
   *                            type: string
   *                        use_u_snapchat_link:
   *                            type: string
   *                        use_u_tiktok_link:
   *                            type: string
   *                        use_u_facebook_followers_count:
   *                            type: integer
   *                        use_u_instagram_followers_count:
   *                            type: integer
   *                        use_u_twitter_followers_count:
   *                            type: integer
   *                        use_u_pinterest_followers_count:
   *                            type: integer
   *                        use_u_snapchat_followers_count:
   *                            type: integer
   *                        use_u_tiktok_followers_count:
   *                            type: integer
   *                        use_u_platform_followers_count:
   *                            type: integer
   *                        use_u_platform_following_count:
   *                            type: integer
   *                        show_facebook:
   *                            type: boolean
   *                        show_instagram:
   *                            type: boolean
   *                        show_twitter:
   *                            type: boolean
   *                        show_pinterest:
   *                            type: boolean
   *                        show_snapchat:
   *                            type: boolean
   *                        show_tiktok:
   *                            type: boolean
   *     parameters:
   *         - name: userID
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Users
   *     description: Update user social profile
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Users updated
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
  router.put("/user_social_profile/:userID", auth, Users.updateUsersocialExt);
  /**
   * @swagger
   * /api/users/login:
   *   post:
   *     requestBody:
   *        required: true
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        username:
   *                            type: string
   *                            example: "email,fb id,gmail id,Ymail id or Instagram id"
   *                        password:
   *                            type: string
   *                        login_type:
   *                            type: string
   *                            example: "Normal,Fb,Gmail,Ymail,Instagram"
   *     tags:
   *       - Users
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
  router.post("/users/login", Users.userlogin);
  /**
   * @swagger
   * /api/users/forgetpassword:
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
   *     tags:
   *       - Users
   *     description: Forgot password
   *     security:  []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: New password generated successfully and mail send
   *       403:
   *         description: Please enter valid user details
   */
  router.post("/users/forgetpassword", Users.forgetPassword);
  /**
   * @swagger
   * /api/users/forgetpasswordmandrill:
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
   *     tags:
   *       - Users
   *     description: Forgot password
   *     security:  []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: New password generated successfully and mail send
   *       403:
   *         description: Please enter valid user details
   */
  router.post(
    "/users/forgetpasswordmandrill",
    Users.forgetPasswordUsingMandrill
  );
  /**
   * @swagger
   * /api/users/changepassword:
   *   post:
   *     requestBody:
   *        required: required
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        current_password:
   *                            type: string
   *                        new_password:
   *                            type: string
   *                        confirm_password:
   *                            type: string
   *     tags:
   *       - Users
   *     description: Change password of a user
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: user password changed successfully
   *       400:
   *         description: new password and confirm password does not match
   *       403:
   *         description: User does not Exit
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
  router.post("/users/changepassword", auth, Users.changePassword);
  /**
   * @swagger
   * /api/users/check_email:
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
   *     tags:
   *       - Users
   *     description: check email
   *     security:  []
   *     produces:
   *       - application/json
   *     responses:
   *       400:
   *         description: Not Exit
   *       200:
   *         description: Exit
   */
  router.post("/users/check_email", Users.checkUserExits);

  /**
   * @swagger
   * /api/users/check_username:
   *   post:
   *     requestBody:
   *        required: true
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        username:
   *                            type: string
   *     tags:
   *       - Users
   *     description: check username
   *     security:  []
   *     produces:
   *       - application/json
   *     responses:
   *       400:
   *         description: Already Exist
   *       200:
   *         description: Not Exist
   */
  router.post("/users/check_username", Users.checkUserNameExists);

  /**
   * @swagger
   * /api/users/send_email_verify:
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
   *     tags:
   *       - Users
   *     description: check email
   *     security:  []
   *     produces:
   *       - application/json
   *     responses:
   *       400:
   *         description: Not Exit
   *       200:
   *         description: Exit
   */
  router.post("/users/send_email_verify", [
    [body("email").exists().trim(), validator],
    Users.emailVerifyMail,
  ]);
  /**
   * @swagger
   * /api/users/verify_email/{verifyToken}:
   *   get:
   *     parameters:
   *         - name: verifyToken
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Users
   *     description: verify email
   *     security:  []
   *     produces:
   *       - application/json
   *     responses:
   *       400:
   *         description: Not Exit
   *       200:
   *         description: verified
   */
  router.get("/users/verify_email/:verifyToken", Users.verifyEmail);

  /**
   * @swagger
   * /api/users/verify_email_otp:
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
   *     tags:
   *       - Users
   *     description: check email
   *     security:  []
   *     produces:
   *       - application/json
   *     responses:
   *       400:
   *         description: Not Exit
   *       200:
   *         description: Exit
   */
  router.post("/users/verifyEmailOTP", [
    [body("email").exists().trim(), body("otp").exists().trim(), validator],
    Users.verifyEmailOTP,
  ]);

  /**
   * @swagger
   * /api/users/reg_mobile:
   *   post:
   *     requestBody:
   *        required: required
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        mobile_number:
   *                            type: string
   *     tags:
   *       - Users
   *     description: Register and send otp to user mobile
   *     produces:
   *       - application/json
   *     responses:
   *       400:
   *         description: Mobile Number Required
   *       404:
   *         description: Already Exist
   *       200:
   *         description: Otp Send
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
  router.post("/users/reg_mobile", auth, Users.checkMobile);
  /**
   * @swagger
   * /api/users/resend_otp:
   *   post:
   *     requestBody:
   *        required: required
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        mobile_number:
   *                            type: string
   *     tags:
   *       - Users
   *     description: Resend otp to user mobile
   *     produces:
   *       - application/json
   *     responses:
   *       400:
   *         description: Mobile Number Required
   *       404:
   *         description: Already Exist
   *       200:
   *         description: Otp Send
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
  router.post("/users/resend_otp", auth, Users.resendOtp);
  /**
   * @swagger
   * /api/users/verify_phone:
   *   post:
   *     requestBody:
   *        required: required
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        otp:
   *                            type: integer
   *     tags:
   *       - Users
   *     description: Resend otp to user mobile
   *     produces:
   *       - application/json
   *     responses:
   *       400:
   *         description: Otp Required
   *       404:
   *         description: Invalid Otp
   *       200:
   *         description: Otp Verified
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
  router.post("/users/verify_phone", auth, Users.verify_otp);
  /**
   * @swagger
   * /api/users/fan_following:
   *   post:
   *     requestBody:
   *        required: required
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        u_id:
   *                            type: integer
   *                        action:
   *                            type: integer
   *                            example: 1=follow,0=unfollow
   *     tags:
   *       - Users
   *     description: Follow and unfollow users
   *     produces:
   *       - application/json
   *     responses:
   *       400:
   *         description: Otp Required
   *       404:
   *         description: Invalid Otp
   *       200:
   *         description: Otp Verified
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
  router.post("/users/fan_following", auth, Users.user_fan_following);
  /**
   * @swagger
   * /api/user_following:
   *   get:
   *     parameters:
   *         - name: pageNumber
   *           in: query
   *           required: false
   *           schema:
   *              type: integer
   *         - name: pageSize
   *           in: query
   *           required: false
   *           schema:
   *              type: integer
   *         - name: userId
   *           in: query
   *           required: false
   *           schema:
   *              type: integer
   *     tags:
   *       - Users
   *     description: Returns all following users
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of all following users
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
  router.get("/user_following", auth, Users.followingListing);
  /**
   * @swagger
   * /api/user_followers:
   *   get:
   *     parameters:
   *         - name: pageNumber
   *           in: query
   *           required: false
   *           schema:
   *              type: integer
   *         - name: pageSize
   *           in: query
   *           required: false
   *           schema:
   *              type: integer
   *         - name: userId
   *           in: query
   *           required: false
   *           schema:
   *              type: integer
   *     tags:
   *       - Users
   *     description: Returns all followers users
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of all followers users
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
  router.get("/user_followers", auth, Users.followersListing);
  /**
   * @swagger
   * /api/users_coin_transactions:
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
   *              example: trx_type,trx_approval_status
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
   *              example: trx_type(0=debit, 1=credit),trx_approval_status (0=approve, 1=reject, 2=inprogress, 3=cancel)
   *     tags:
   *       - Users
   *     description: Returns all users coin transactions
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of users coin credit/debit transactions
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
  router.get("/users_coin_transactions", auth, Users.user_coins_transactions);
  /**
   * @swagger
   * /api/users_star_transactions:
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
   *              example: trx_type,trx_approval_status
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
   *              example: trx_type(0=debit, 1=credit),trx_approval_status (0=approve, 1=reject, 2=inprogress, 3=cancel)
   *     tags:
   *       - Users
   *     description: Returns all users star transactions
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of users credit/debit coin transactions
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
  router.get("/users_star_transactions", auth, Users.user_star_transactions);
  /**
   * @swagger
   * /api/users/debit_transaction:
   *   post:
   *     requestBody:
   *        required: required
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        coins:
   *                            type: integer
   *                        conversation_amount:
   *                            type: integer
   *                        description :
   *                            type:String
   *     tags:
   *       - Users
   *     description: debit amout from user account
   *     produces:
   *       - application/json
   *     responses:
   *       400:
   *         description: validation error
   *       200:
   *         description: transactions successful
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
  router.post("/users/debit_transaction", auth, Users.user_debit_transactions);

  /**
   * @swagger
   * /api/user_deactivate_hide_account/{userID}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        u_action:
   *                            type: integer
   *                            example: "1: Hide User,2: Unhide User,3: Deactivate Account,4: Activate Account"
   *     parameters:
   *         - name: userID
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Users
   *     description: Update user dectivate or hidden status
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Users updated
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
  router.put(
    "/user_deactivate_hide_account/:userID",
    auth,
    Users.userDeactivateOrHide
  );

  app.use("/api", router);
};
