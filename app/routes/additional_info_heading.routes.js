module.exports = app => {
    const AdditionalInfoHeading = require("../controllers/additional_info_heading.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
	const access = require("../middleware/access");
    /**
     * @swagger
     * /api/addtionalInfoHeading:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Heading:
     *                            type: string
     *                        Type:
     *                            type: string
     *     tags:
     *       - Additional Info Heading
     *     description: Add new additional info heading
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add new additional info heading
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
    router.post("/addtionalInfoHeading",auth, AdditionalInfoHeading.createNewAdditionalInfoHeading);

    // Update a Heading with id
    /**
     * @swagger
     * /api/addtionalInfoHeading/{adInfoId}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        ad_info_name:
     *                            type: string
     *                        ad_info_type_name:
     *                            type: string
     *     parameters:
     *         - name: adInfoId
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *     tags:
     *       - Additional Info Heading
     *     description: Update  Heading
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Heading updated
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
     router.put("/additionalInfoHeading/:adInfoId", auth, AdditionalInfoHeading.updateAddtionalInfoHeading);
    // Retrieve all Headings
    /**
     * @swagger
     * /api/addtionalInfoHeading:
     *   get:
     *     parameters:
     *         - name: pageNumber
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: type
     *           in: query
     *           required: false
     *           schema:
     *              type: string
     *              example: Tips, FAQ, Rules  # Example of a parameter value
     *         - name: sortBy
     *           in: query
     *           required: false
     *           schema:
     *              type: string
     *              example: ad_info_id,ad_info_name,ad_info_type_name  # Example of a parameter value
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
     *       - Additional Info Heading
     *     description: Returns all Additional Info Heading
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Additional Info Heading
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
    router.get('/addtionalInfoHeading', auth, AdditionalInfoHeading.listing)
    /**
     * @swagger
     * /api/addtionalInfoHeading/{adInfoId}:
     *   get:
     *     parameters:
     *         - name: adInfoId
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *     tags:
     *       - Additional Info Heading
     *     description: Retrieve a single heading with adInfoId
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Details of a  Additional Info Heading
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
    router.get("/addtionalInfoHeading/:adInfoId", auth, AdditionalInfoHeading.addtionalInfoHeadingDetail);

 /**
 * @swagger
 * /api/addtionalInfoHeading/{id}:
 *   delete:
 *     parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *      - Additional Info Heading
 *     description: Delete heading with id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Delete heading
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
  router.delete("/addtionalInfoHeading/:id", auth, AdditionalInfoHeading.deleteHeading);
    app.use("/api", router);
};