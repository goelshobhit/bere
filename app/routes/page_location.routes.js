module.exports = app => {
    const pageLocation = require("../controllers/page_location.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    /**
   * @swagger
   * /api/page_location:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Page Name:
   *                           type: string
   *                        Page Description:
   *                           type: string
   *                        Page Image Path:
   *                           type: string
   *     tags:
   *       - Page Location
   *     description: Add Page Location
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add Page Location
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
    router.post("/page_location", auth, pageLocation.addPageLocation);

    

    // Retrieve all task level listing
    /**
     * @swagger
     * /api/page_location:
     *   get:
     *     parameters:
     *         - name: pageId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: pageName
     *           in: query
     *           required: false
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
     *              example: page_id,page_name,page_description,page_image_path,pl_created_at,pl_updated_at    # Example of a parameter value
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
     *       - Page Location
     *     description: Returns all Page Locations
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Votes
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
    router.get('/page_location', auth, pageLocation.pageLocationListing);

    /**
   * @swagger
   * /api/page_location/{pageId}:
   *   get:
   *     parameters:
   *         - name: pageId
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Page Location
   *     description: Retrieve a Page Location with pageId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Page Location
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
  router.get("/page_location/:pageId",auth, pageLocation.pageLocationDetails);

  /**
 * @swagger
 * /api/page_location/{pageId}:
 *   put:
 *     requestBody:
 *        required: false
 *        content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        page_name:
 *                            format: string
 *                        page_description:
 *                            type: string
 *                        page_image_path:
 *                            format: string
 *     parameters:
 *         - name: pageId
 *           in: path
 *           required: true
 *           schema:
 *              type: string
 *     tags:
 *       - Page Location
 *     description: Update Page Location
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Page Location updated
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
 router.put("/page_location/:pageId",auth, pageLocation.updatepageLocation);

 /**
 * @swagger
 * /api/page_location/{pageId}:
 *   delete:
 *     parameters:
 *         - name: pageId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *      - Page Location
 *     description: Delete Page Location with id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Delete Page Location
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
router.delete("/page_location/:pageId", auth, pageLocation.deletePageLocation);
    
  app.use("/api", router);
};