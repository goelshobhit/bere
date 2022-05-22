module.exports = app => {
    const Brands = require("../controllers/brands.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
	const access = require("../middleware/access");
    /**
     * @swagger
     * /api/brand:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Brand name:
     *                            type: string
     *                        Brand address:
     *                            type: string
     *                        Brand city:
     *                            type: string
     *                        Brand state:
     *                            type: string
     *                        Brand country:
     *                            type: string
     *                        Pincode:
     *                            type: string
     *                        Phone:
     *                            type: string
     *                        Email:
     *                            type: string
     *                        Facbook Handle:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
     *                            example: ["xyz","abc"]
     *                        Twitter Handle:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
     *                            example: ["xyz","abc"]
     *                        Pintrest Handle:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
     *                            example: ["xyz","abc"]
     *                        Instagram Handle:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
     *                            example: ["xyz","abc"]
     *                        Snapchat Handle:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
     *                            example: ["xyz","abc"]
     *                        Tiktok Handle:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
     *                            example: ["xyz","abc"]
     *                        Who We Are looking For:
     *                            type: string
     *                        Brand Restrictions:
     *                            type: string
     *                        Brand Logo:
     *                            type: string
     *                        Cover Image:
     *                            type: string
     *                        Brand Short Description:
     *                            type: string
     *                        Long Description:
     *                            type: string
     *                        Brand Website:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
     *                            example: ["xyz","abc"]
     *                        Contact Person Name:
     *                            type: string
     *                        Person Department:
     *                            type: string
     *                        Phone Extension:
     *                            type: string
     *                        Person Email:
     *                            type: string
     *                        Person Title:
     *                            type: string
     *                        Person Industry:
     *                            type: string
     *                        Total Token:
     *                            type: integer
     *                        Brand Status:
     *                            type: integer
     *     tags:
     *       - Brand
     *     description: Add new brand
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add new brand
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
    router.post("/brand", access, Brands.createNewBrand);

    // Retrieve all Brands
    /**
     * @swagger
     * /api/brand:
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
     *              example: cr_co_id,cr_co_name,cr_co_created_at,cr_co_updated_at    # Example of a parameter value
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
     *       - Brand
     *     description: Returns all brands
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of brands
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
    router.get('/brand', auth, Brands.listing)
    /**
     * @swagger
     * /api/brand/{brandID}:
     *   get:
     *     parameters:
     *         - name: brandID
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *     tags:
     *       - Brand
     *     description: Retrieve a single brand with brandID
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Details of a brand
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
    router.get("/brand/:brandID", auth, Brands.brandDetail);

    /**
     * @swagger
     * /api/brand_user_listing/{brandID}:
     *   get:
     *     parameters:
     *         - name: brandID
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *     tags:
     *       - Brand
     *     description: Retrieve User Listing For Given brandID
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: User Listing for Brands
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
    router.get("/brand_user_listing/:brandID", auth, Brands.brandUsersListing);
	    /**
     * @swagger
     * /api/brand_tasklist/{brandID}:
     *   get:
     *     parameters:
     *         - name: brandID
     *           in: path
     *           required: true
     *           schema:
     *              type: string
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
     *         - name: sortOrder
     *           in: query
     *           required: false
     *           schema:
     *              type: string
     *              example: ASC,DESC    # Example of a parameter value
     *     tags:
     *       - Brand
     *     description: Retrieve a single brand details with task and post list by brandID
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Details of a brand
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
    router.get("/brand_tasklist/:brandID", auth, Brands.brandDetailWithJsonTask);

    // Update a Brand with id
    /**
     * @swagger
     * /api/brand/{brandID}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        cr_co_name:
     *                            type: string
     *                        cr_co_address:
     *                            type: string
     *                        cr_co_city:
     *                            type: string
     *                        cr_co_state:
     *                            type: string
     *                        cr_co_country:
     *                            type: string
     *                        cr_co_pincode:
     *                            type: string
     *                        cr_co_phone:
     *                            type: string
     *                        cr_co_email:
     *                            type: string
     *                        cr_co_fb_handle:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
     *                            example: ["xyz","abc"]
     *                        cr_co_tw_handle:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
     *                            example: ["xyz","abc"]
     *                        cr_co_pint_handle:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
     *                            example: ["xyz","abc"]
     *                        cr_co_insta_handle:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
     *                            example: ["xyz","abc"]
     *                        cr_co_snapchat_handle:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
     *                            example: ["xyz","abc"]
     *                        cr_co_tiktok_handle:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
     *                            example: ["xyz","abc"]
     *                        cr_co_who_we_are_looking_for:
     *                            type: string
     *                        cr_co_restrictions:
     *                            type: string
     *                        cr_co_logo_path:
     *                            type: string
     *                        cr_co_cover_img_path:
     *                            type: string
     *                        cr_co_desc_short:
     *                            type: string
     *                        cr_co_desc_long:
     *                            type: string
     *                        cr_co_website:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
     *                            example: ["xyz","abc"]
     *                        cr_co_contact_pers:
     *                            type: string
     *                        cr_co_contact_pers_dept:
     *                            type: string
     *                        cr_co_contact_pers_phone_ext:
     *                            type: string
     *                        cr_co_contact_pers_email:
     *                            type: string
     *                        cr_co_contact_pers_title:
     *                            type: string
     *                        cr_co_contact_pers_industry:
     *                            type: string
     *                        cr_co_status:
     *                            type: integer
     *                        cr_co_total_token:
     *                            type: string
     *     parameters:
     *         - name: brandID
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *     tags:
     *       - Brand
     *     description: Update  Brand
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Brand updated
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
    router.put("/brand/:brandID",  access, Brands.updateBrand);
	    // Retrieve all Brands
    /**
     * @swagger
     * /api/quick_list:
     *   get:
     *     tags:
     *       - Brand
     *     description: Returns all brands
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of brands
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
    router.get('/quick_list', auth,Brands.Brandslisting)
	/**
     * @swagger
     * /api/brandbudget:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Brand id:
     *                            type: integer
     *                        Budget amount:
     *                            type: string
     *                        Token Value In Usd:
     *                            type: Integer
     *                        Tokens:
     *                            type: Integer
     *                        Note:
     *                            type: string
     *     tags:
     *       - Brand
     *     description: Add new brand's budget
     *     produces0:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add new brand's budget
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
    router.post("/brandbudget", access, Brands.addBrandBudget);
        /**
     * @swagger
     * /api/brandbudget/{brandID}:
     *   get:
     *     parameters:
     *         - name: brandID
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *     tags:
     *       - Brand
     *     description: all list of a brand budget
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: all list of a brand budget
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
    router.get("/brandbudget/:brandID", auth, Brands.brandBudgets);

      /**
     * @swagger
     * /api/brand_task_closed:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Brand Id:
     *                            type: integer
     *                        Task Id:
     *                            type: array
     *                            items:
     *                             type: integer
     *                        brand_task_closed:
     *                            type: integer
     *     tags:
     *       - Brand
     *     description: Close Brand task
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Close Brand task
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
    router.post("/brand_task_closed", auth, Brands.closedBrandTask)

     // Retrieve all Brand task closed
    /**
     * @swagger
     * /api/brand_task_closed:
     *   get:
     *     parameters:
     *         - name: brandId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: taskId
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
     *              example: btc_id,brand_id,task_id,brand_task_closed    # Example of a parameter value
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
     *       - Brand
     *     description: Returns all brands task closed
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of brands task closed
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
    router.get('/brand_task_closed', auth, Brands.brandTaskClosedListing)

    // Retrieve all Brand task closed
    /**
     * @swagger
     * /api/brand_user_task_closed/{brandID}:
     *   get:
     *     parameters:
     *         - name: brandId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: taskId
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
     *              example: ta_task_id    # Example of a parameter value
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
     *       - Brand
     *     description: Returns all brands User task closed
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of brands User task closed
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
    router.get('/brand_user_task_closed/:brandID', auth, Brands.brandUserTaskClosedListing)

    app.use("/api", router);
};