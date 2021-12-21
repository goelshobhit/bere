                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        module.exports = app => {
    const energy = require("../controllers/energy.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
	const access = require("../middleware/access");
    /**
     * @swagger
     * /api/deduct_userenergy:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Energy UserId:
     *                            type: string
     *                        Energy Deduction:
     *                            type: string
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
    router.post("/deduct_userenergy", auth, energy.deductUserEnergylevel);

     /**
     * @swagger
     * /api/add_userenergy:
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
    router.post("/add_userenergy", energy.addUserEnergylevel);
    app.use("/api", router);
};