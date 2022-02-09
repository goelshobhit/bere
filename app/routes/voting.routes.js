module.exports = app => {
    const voting = require("../controllers/voting.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    /**
   * @swagger
   * /api/voting:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Voting Brand Id:
   *                           type: integer
   *                        Voter User Id:
   *                           type: integer
   *                        Voting Hashtag:
   *                           type: string
   *                        Voting Indicator:
   *                            format: integer
   *                        Voter Nominator Img:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["xyz.png","abc.png"]
   *                        Voter Nominator Usr Id:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: integer
   *                            example: [123,456]
   *                        Voted:
   *                           type: integer
   *                        Voted Usr Top:
   *                             type: integer
   *                        Voter Stars:
   *                             type: integer
   *                        Usr Top1:
   *                             type: integer
   *                        Usr Top2:
   *                             type: integer
   *                        Usr Top3:
   *                             type: integer
   *                        Vote Main Instruction:
   *                             type: string
   *                        Vote Sub Instruction:
   *                             type: string
   *                        Vote Rewards1 Id:
   *                             type: integer
   *                        Vote Rewards1 Amount:
   *                             type: integer
   *                        Vote Rewards2 Id:
   *                             type: integer
   *                        Vote Rewards2 Amount:
   *                             type: integer
   *     tags:
   *       - Voting
   *     description: Add Vote
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add Vote
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
    router.post("/voting", auth, voting.addVoting);

    

    // Retrieve all task level listing
    /**
     * @swagger
     * /api/voting:
     *   get:
     *     parameters:
     *         - name: brandId
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
     *              example: voting_id,voter_usr_id,voting_brand_id,voting_indicator,voted,voted_usr_top,voter_stars,usr_top1,usr_top2,usr_top3,vote_main_instruction    # Example of a parameter value
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
     *       - Voting
     *     description: Returns all Votings
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Votes
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
    router.get('/voting', auth, voting.votingListing)

    
  app.use("/api", router);
};