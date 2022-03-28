module.exports = app => {
    const Contentreport = require("../../controllers/contentReport/content_report.controller.js");
    var router = require("express").Router();
    const auth = require("../../middleware/auth");
    // Submit Content Report
    /** 
     * @swagger
     * /api/contentreport:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Content Report Cat Id:
     *                            type: integer
     *                            required: true
     *                        Content Id:
     *                            type: integer
     *                            required: true
     *                        Content Type:
     *                            type: string
     *                            required: true
     *                        Content Report Name:
     *                            type: string
     *                        Content Report Type:
     *                            type: integer
     *                            required: true
     *                        Content Report Type Id:
     *                            type: integer
     *                            required: true
     *                        Content Report Owner Id:
     *                            type: integer
     *                            required: true
     *                        Content Report Page Id:
     *                            type: integer
     *                        Content Report Reason:
     *                            type: string
     *     tags:
     *       - Content Report
     *     description: Submit Content Report
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Submit Content Report
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
    router.post("/contentreport", auth, Contentreport.submitContentReport);
      // LIST all Content Reports
    /** 
     * @swagger
     * /api/contentreport:
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
     *                example: content_id,content_type,content_report_id,content_report_cat_id,content_report_name,content_report_type,content_report_cat_type_id,content_report_cat_owner_id,content_report_cat_reporter_id
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
     *      description: Return All Content Reports
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: A list of Content Reports
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
   router.get('/contentreport',auth, Contentreport.contentReportListing);
   /**
     * @swagger
     * /api/contentreport_action:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Content Report Id:
     *                            type: integer
     *                            required: true
     *                        Content Report Autotakedown:
     *                            type: integer
     *                        Content Report Hide From User:
     *                            type: integer
     *                        Content Report Desc:
     *                            type: string
     *     tags:
     *       - Content Report
     *     description: Take Content Report Action
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Take Content Report Action
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
    router.post("/contentreport_action", auth, Contentreport.contentReportAction);
    app.use("/api", router);
};