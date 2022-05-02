module.exports = app => {
  const Contentreport = require("../../controllers/contentReport/content_report_category.controller.js");
  var router = require("express").Router();
  const auth = require("../../middleware/auth");
  const access = require("../../middleware/access");
  /**
   * @swagger
   * /api/contentreport_category:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Content Content Report Cat Autotakedown:
   *                            type: integer
   *                            required: true
   *                        Content Report Cat Name:
   *                            type: string
   *                        Content Report Cat Hide:
   *                            type: integer
   *                            required: true
   *                        Content Report Cat Usr Hide:
   *                            type: integer
   *                            required: true
   *     tags:
   *       - Content Report
   *     description: Create Content Report Category
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Create Content Report Category
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
  router.post("/contentreport_category", access, Contentreport.createContentReportCategory);

  // LIST all Content Report Categories
  /** 
   * @swagger
   * /api/contentreport_category:
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
   *                example: content_report_cat_id,content_report_cat_name,content_report_cat_hide,content_report_cat_usr_hide
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
   *          - Content Report
   *      description: Return All Content Report Categories
   *      produces:
   *          - application/json
   *      responses:
   *          200:
   *              description: A list of Content Report Categories
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
  router.get('/contentreport_category', auth, Contentreport.contentReportCategoriesListing)

  // UPDATE Content Report Category
  /** 
   * @swagger
   * /api/contentreport_category/{contentReportCatID}:
   *  put:
   *      requestBody:
   *          required: false
   *          content:
   *              application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                          content_report_cat_autotakedown:
   *                              type: integer
   *                          content_report_cat_name:
   *                              type: string
   *                          content_report_cat_hide:
   *                              type: string
   *                          content_report_cat_usr_hide:
   *                              type: string
 *      parameters:
   *         - name: contentReportCatID
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *      tags:
   *          - Content Report
   *      description: Update Content Report Category
   *      produces:
   *          - application/json
   *      responses:
   *          200:
   *              description: Content Report Category Updated
   *          422:
   *              description: validation errors
   *          500:
   *              description: Internal server error
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
  router.put("/contentreport_category/:contentReportCatID", access, Contentreport.updateContentReportCategory);
  /**
 * @swagger
 * /api/contentreport_category/{contentReportCatID}:
 *   delete:
 *     parameters:
 *         - name: contentReportCatID
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *       - Content Report
 *     description: Delete Content Report Category with id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Delete Content Report Category
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
  router.delete("/contentreport_category/:contentReportCatID", access, Contentreport.deleteContentReportCategory);
  app.use("/api", router);
};