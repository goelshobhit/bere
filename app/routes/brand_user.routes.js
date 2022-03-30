module.exports = app => {
    const brand_user = require("../controllers/brand_user.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
	const access = require("../middleware/access");
    /**
     * @swagger
     * /api/brand_user_share:
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
     *                        User Id:
     *                            type: integer
     *                        Is Brand Follow:
     *                            type: integer
     *                        Is Fb Share:
     *                            type: integer
     *                        Is Twitter Share:
     *                            type: integer
     *                        Is Pinterest Share:
     *                            type: integer
     *                        Is Insta Share:
     *                            type: integer
     *                        Is Tiktok Share:
     *                            type: integer
     *     tags:
     *       - Brand User
     *     description: Share Brand User
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Share Brand User
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
    router.post("/brand_user_share", auth, brand_user.BrandUserShare);

    // Retrieve all Brands
    /**
     * @swagger
     * /api/brand_user_share:
     *   get:
     *     parameters:
     *         - name: brandUserShareId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: brandId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: userId
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
     *              example: bus_id,brand_id,user_id,is_brand_follow,is_facebook_share,is_twitter_share,is_pinterest_share,is_instagram_share,is_tiktok_share    # Example of a parameter value
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
     *       - Brand User
     *     description: Returns all brand user share listing
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of brand user shares
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
    router.get('/brand_user_share', auth, brand_user.listing)
   
	 
    // Update a Brand Share with id
    /**
     * @swagger
     * /api/brand_user_share/{brandUserShareId}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        brand_id:
     *                            type: integer
     *                        user_id:
     *                            type: integer
     *                        is_brand_follow:
     *                            type: integer
     *                        is_facebook_share:
     *                            type: integer
     *                        is_twitter_share:
     *                            type: integer
     *                        is_pinterest_share:
     *                            type: integer
     *                        is_instagram_share:
     *                            type: integer
     *                        is_tiktok_share:
     *                            type: integer
     *     parameters:
     *         - name: brandUserShareId
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *     tags:
     *       - Brand User
     *     description: Update Brand user share
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Brand user share updated
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
    router.put("/brand_user_share/:brandUserShareId", auth, brand_user.updateBrandUserShare);
	    // Retrieve all Brands
   
    app.use("/api", router);
};