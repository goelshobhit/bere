module.exports = app => {
    const AdditionalInfoData = require("../controllers/additional_info_data.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
	const access = require("../middleware/access");
    /**
     * @swagger
     * /api/addtionalInfoData:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Heading Id:
     *                            type: integer
     *                        Title:
     *                            type: string
     *                        Texts Under:
     *                            type: string
     *                        Image:
     *                            type: string
     *     tags:
     *       - Additional Info Data
     *     description: Add new additional info data
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add new additional info data
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
    router.post("/addtionalInfoData", AdditionalInfoData.createNewAdditionalInfoData);

    // Update a Heading with id
    /**
     * @swagger
     * /api/addtionalInfoData/{adInfoDataId}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        ad_info_id:
     *                            type: integer
     *                        ad_info_data_name:
     *                            type: string
     *                        ad_info_data_description:
     *                            type: string
     *                        ad_info_data_image:
     *                            type: string
     *     parameters:
     *         - name: adInfoDataId
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *     tags:
     *       - Additional Info Data
     *     description: Update  Data
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Data updated
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
     router.put("/additionalInfoData/:adInfoDataId", auth, AdditionalInfoData.updateAddtionalInfoData);
    // Retrieve all Data
    /**
     * @swagger
     * /api/addtionalInfoData:
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
     *              example: ad_info_id,ad_info_data_name,ad_info_data_description,ad_info_data_image  # Example of a parameter value
     *         - name: type
     *           in: query
     *           required: false
     *           schema:
     *              type: string
     *              example: Tips, FAQ, Rules  # Example of a parameter value
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
     *       - Additional Info Data
     *     description: Returns all Additional Info Data
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Additional Info Data
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
    router.get('/addtionalInfoData', auth, AdditionalInfoData.listing)
    /**
     * @swagger
     * /api/addtionalInfoData/{adInfoDataId}:
     *   get:
     *     parameters:
     *         - name: adInfoDataId
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *     tags:
     *       - Additional Info Data
     *     description: Retrieve a single heading with adInfoDataId
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Details of a  Additional Info Data
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
    router.get("/addtionalInfoData/:adInfoDataId", auth, AdditionalInfoData.addtionalInfoDataDetail);

 /**
 * @swagger
 * /api/addtionalInfoData/{id}:
 *   delete:
 *     parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *      - Additional Info Data
 *     description: Delete data with id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Delete data
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
  router.delete("/addtionalInfoData/:id", auth, AdditionalInfoData.deleteData);
    app.use("/api", router);
};