const { campaigns } = require("../models");
module.exports = app => {
	const Search = require("../controllers/search.controller");
	var router = require("express").Router();
	const auth = require("../middleware/auth");
	const access = require("../middleware/access");
	/**
   * @swagger
   * /api/search/object:
   *   get:
   *     tags:
   *       - Search
   *     description: Returns search objects
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of search objects
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
    router.get('/search/object',auth,  Search.getSearchObject);
    /**
   * @swagger
   * /api/search/recent:
   *   get:
   *     tags:
   *       - Search
   *     description: Returns recent searched data
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of recent search data
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
     router.get('/search/recent',auth,  Search.searchRecentRecords);
    /**
   * @swagger
   * /api/search:
   *   get:
   *     parameters:
   *         - name: keyWord
   *           in: query
   *           schema:
   *              type: string
   *     tags:
   *       - Search
   *     description: Returns keyWord matched searched data
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of all search data
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
    router.get('/search',auth,  Search.searchRecords);
    /**
   * @swagger
   * /api/search/object:
   *   post:
   *     requestBody:
   *        required: true
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    items:
   *                      oneOf:
   *                       type: string
   *                    example: {"Profile":"1 or 0", "Comments":"1 or 0","Tasks":"1 or 0","Survey":"1 or 0","Quizes":"1 or 0", "Contest":"1 or 0"}
   *     tags:
   *       - Search
   *     description: Add new search objects
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new search objects
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
    router.post("/search/object", auth,  Search.addSearchObject);
    app.use("/api", router);
}