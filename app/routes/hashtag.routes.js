module.exports = app => {
  const Hashtag = require("../controllers/hashtags.controller.js");
  var router = require("express").Router();
   const auth = require("../middleware/auth");
  /**
   * @swagger
   * /api/hashtag:
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
   *              example: th_hashtag_id,th_hashtag_values    # Example of a parameter value
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
   *       - Hashtag
   *     description: Returns all hashtag
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of hashtag
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
     router.get('/hashtag',auth,  Hashtag.listing)
   app.use("/api", router);
  };
  