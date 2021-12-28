                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        module.exports = app => {
    const energy = require("../controllers/energy.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
	const access = require("../middleware/access");
    /**
     * @swagger
     * /api/energy/submit_task:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Energy UserId:
     *                            type: integer
     *                        Energy Deduction:
     *                            type: integer
     *                        Energy TaskId:
     *                            type: integer
     *     tags:
     *       - Energy
     *     description: Deduct Energy for user when submit task
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Deduct Energy for user when submit task
     *       400:
     *         description: invalid request
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
    router.post("/energy/submit_task", auth, energy.submitTask);

     /**
     * @swagger
     * /api/energy/add_userenergy:
     *   post:
     *     tags:
     *       - Energy
     *     description: Add Energy For User After Six Hours
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add Energy For User After Six Hours
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
    router.post("/energy/add_userenergy", energy.addUserEnergylevel);

    // Retrieve all unsubmitted task
    /**
     * @swagger
     * /api/energy/unsubmitted_task:
     *   get:
     *     parameters:
     *         - name: taskId
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
     *              example: energy_id,energy_userid,energy_deduction,energy_bal,energy_created_at,energy_updated_at # Example of a parameter value
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
     *       - Energy
     *     description: Returns all unsubmitted tasks
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of unsubmitted tasks
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
    router.get('/energy/unsubmitted_task', auth, energy.unsubmittedTaskListing);

     /**
     * @swagger
     * /api/resubmit_task:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Energy Id:
     *                            type: integer
     *     tags:
     *       - Energy
     *     description: Deduct Energy for user when Resubmit task
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Deduct Energy for user when Resubmit task
     *       400:
     *         description: invalid request
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
    router.post("/energy/resubmit_task", auth, energy.resubmitTask);

    app.use("/api", router);
};