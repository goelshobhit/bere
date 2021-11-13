const { campaigns } = require("../models");
module.exports = app => {
	const postReactions = require("../controllers/post_reactions.controller");
	var router = require("express").Router();
    const auth = require("../middleware/auth");
    require("dotenv").config();
    const appConfig = require("../config/config.js");
    const env = process.env.NODE_ENV || "development";
    // CREATE CAMPAIGN ROUTE
    /** 
     * @swagger
     * /api/post_reactions:
     *  post:
     *      requestBody:
     *          required: false
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
	 *                          Post id:
     *                              type: integer
	 *                              example: "1"
	 *                          reaction:
     *                              type: string
	 *                              example: "abc"
     *                          reaction type:
     *                              type: string
	 *                              example: "Single,Contest"
     *      tags:
     *          - Post Reactions
     *      description: Add New Post Reactions
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: Add New Post Reactions
     *          500:
     *              description: Internal Server Error
     *          401:
     *              description: Unauthorized Access
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: Authorisation Required
    */
    router.post("/post_reactions",auth,postReactions.createpostReaction);
    // LIST ALL CAMPAIGN
    /** 
     * @swagger
     * /api/post_reactions/{postId}:
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
     *          -  name: postId
     *             in: path
     *             required: true
     *             schema:
     *                type: integer
     *      tags:
     *          - Post Reactions
     *      description: Return All Post Reactions
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: A list of Post Reactions
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
    router.get('/post_reactions/:postId',auth, postReactions.listing)
    /**
     * @swagger
     * /api/post_reaction_img/{emoji}:
     *   get:
     *     parameters:
     *         - name: emoji
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *     tags:
     *       - Emoji Files
     *     description: Retrieve a single Emoji File
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Retrieve a single Emoji File
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
    router.get("/post_reaction_img/:emoji", function(
        req,
        res,
        next
    ) {
        var options = {
            root: appConfig[env].FILE_UPLOAD_DIR+'/emoji',
            dotfiles: "deny",
            headers: {
                "x-timestamp": Date.now(),
                "x-sent": true
            }
        };
        var fileName = req.params.emoji;
        res.sendFile(fileName, options, function(err) {
            if (err) {
                next(err);
            } else {
                console.log("Sent:", fileName);
            }
        });
    });
    app.use("/api", router);
}