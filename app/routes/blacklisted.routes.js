module.exports = app => {
    const BlackListed = require("../controllers/blacklisted.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
  /**
   * @swagger
   * /api/blacklist:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Keyword:
   *                            type: string
   *     tags:
   *       - Black List
   *     description: Add new keyword
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new keyword
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
	router.post("/blacklist", auth, BlackListed.createBlackListed);
  /**
   * @swagger
   * /api/blacklist/{blackListedId}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Keyword:
   *                            type: string
   *     parameters:
   *         - name: blackListedId
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Black List
   *     description: Update keyword
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Keyword updated
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
   router.put("/blacklist/:blackListedId", auth, BlackListed.updateBlackListed);
  /**
   * @swagger
   * /api/blacklist:
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
   *              example: keyword   # Example of a parameter value
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
   *       - Black List
   *     description: Returns all Keywords
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Keywords
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
    router.get('/blacklist', auth, BlackListed.blackListedListing)
  /**
   * @swagger
   * /api/blackList/{blackListedId}:
   *   get:
   *     parameters:
   *         - name: blackListedId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *         - name: pageSize
   *           in: query
   *           required: false
   *           schema:
   *              type: integer
   *         - name: pageNumber
   *           in: query
   *           required: false
   *           schema:
   *              type: integer
   *     tags:
   *       - Black List
   *     description: Retrieve a single Black List with blackListedId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a keyword
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
    router.get("/blacklist/:blackListedId", auth, BlackListed.blackListedDetails);
  /**
   * @swagger
   * /api/blacklist/{blackListedId}:
   *   delete:
   *     parameters:
   *         - name: blackListedId
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Black List
   *     description: Delete a keyword with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete a keyword
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
   router.delete("/blacklist/:blackListedId", auth, BlackListed.deleteBlackListed);   
    app.use("/api", router);
};
  