const { campaigns } = require("../models");
module.exports = app => {
	const audit_logs = require("../controllers/audit_logs.controller");
	var router = require("express").Router();
    const auth = require("../middleware/auth");
    /** 
     * @swagger
     * /api/audit_log:
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
     *          - audit logs
     *      description: Return All audit logs
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: A list of audit logs
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
    router.get('/audit_log',auth,audit_logs.listing)
    app.use("/api", router);
}