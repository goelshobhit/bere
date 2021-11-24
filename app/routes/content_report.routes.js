module.exports = app => {
    const Brands = require("../controllers/content_report.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
	const access = require("../middleware/access");
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
     *                        content_report_cat_id:
     *                            type: interger
     *                            required: true
     *                        content_report_name:
     *                            type: string
     *                        content_report_task_id:
     *                            type: interger
     *                            required: true
     *                        content_report_content_id:
     *                            type: interger
     *                            required: true
     *                        content_report_owner_id:
     *                            type: interger
     *                            required: true
     *                        content_report_category:
     *                            type: string
     *                        content_report_reason:
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
    router.post("/contentreport", auth, Brands.submitContentReport);
    app.use("/api", router);
};