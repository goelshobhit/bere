const { campaigns } = require("../models");

module.exports = app => {
    const Campaign = require("../controllers/campaigns.controller");
    var router = require("express").Router();
	 const auth = require("../middleware/auth");
	 const access = require("../middleware/access");
     const adminValidate = require("../middleware/adminValidate");
    // CREATE CAMPAIGN ROUTE
    /** 
     * @swagger
     * /api/campaign:
     *  post:
     *      requestBody:
     *          required: false
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          Brand ID:
     *                              type: integer
     *                          Campaign Name:
     *                              type: string
     *                          Campaign Desc:
     *                              type: string
     *                          Campaign Tier:
     *                              type: string
     *                          Completion Time:
     *                              type: integer
     *                          Reward:
     *                              type: integer
     *                          Audience:
     *                              type: string
	 *                          Campaign target reach:
     *                              type: string
     *                          Visibility Type:
     *                              type: string
     *                              example: Private, Public
     *                          Campaign Budget:
     *                              type: integer
     *                          Winner Token:
     *                              type: integer
     *                          Start Date:
     *                              type: date
     *                              example: 2020-09-30
     *                          End Date:
     *                              type: date
     *                              example: 2022-10-25
	 *                          Campaign token to be earned:
     *                              type: integer
	 *                          Continue Campaign after coins spent:
     *                              type: boolean
	 *                              example: true
	 *                          Campaign status:
     *                              type: integer
	 *                              example: "0: Waiting for approval,1: Approved,2: Published,3: Draft,4: Closed,5: Cancelled"
	 *                          Task type:
     *                              type: string
	 *                              example: "single, contest, survey"
	 *                          Campaign banner:
     *                              type: String
	 *                              example: "OFF"
     *      tags:
     *          - Campaign
     *      description: Add New Campaign
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: Add New Campaign
     *          422:
     *              description: Validation Error
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
    router.post("/campaign", access, adminValidate.validate("create_camp"),Campaign.createCampaign);

    // LIST ALL CAMPAIGN
    /** 
     * @swagger
     * /api/campaign:
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
     *                example: cp_campaign_id,cp_campaign_name,cp_campaign_start_date,cp_campaign_end_date
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
     *          - Campaign
     *      description: Return All Campaigns
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: A list of campaigns
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
    router.get('/campaign',auth, Campaign.campaignListing)

    // GET SINGLE CAMPAIGN
    /** 
     * @swagger
     * /api/campaign/{campaignID}:
     *  get:
     *      parameters:
     *          - name: campaignID
     *            in: path
     *            required: true
     *            schema:
     *                type: integer
     *      tags:
     *          - Campaign
     *      description: Retrieve a single campaign with campaignID
     *      produces:
     *          - application/json:
     *      responses:
     *          200:
     *              description: Details of a campaign
     *          401:
     *              description: Unauthorized
     *              content:
     *                  application/json:
     *      0                schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: Authorisation Required
    */
    
    router.get("/campaign/:campaignID",auth,  Campaign.campaignDetails)

    // UPDATE CAMPAIGN
    /** 
     * @swagger
     * /api/campaign/{campaignID}:
     *  put:
     *      requestBody:
     *          required: false
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          cr_co_id:
     *                              type: integer
     *                          cp_campaign_name:
     *                              type: string
     *                          cp_campaign_desc:
     *                              type: string
     *                          cp_campaign_tier:
     *                              type: string
     *                          cp_campaign_time_completion:
     *                              type: integer
     *                          cp_campaign_completion_rewards:
     *                              type: integer
     *                          cp_campaign_aud:
     *                              type: string
     *                          cp_campaign_visiblity:
     *                              type: string
     *                              example: Private, Public
     *                          cp_campaign_total_budget:
     *                              type: integer
     *                          cp_campaign_winner_token:
     *                              type: integer
     *                          cp_campaign_start_date:
     *                              type: date
     *                              example: 2020-09-30
     *                          cp_campaign_end_date:
     *                              type: date
     *                              example: 2020-10-25
	 *                          cp_campaign_token_earned:
     *                              type: integer
	 *                          cp_conti_after_coins_spent:
     *                              type: boolean
	 *                          cp_campaign_status:
     *                              type: integer
	 *      parameters:
     *         - name: campaignID
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *      tags:
     *          - Campaign
     *      description: Update Campaign
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: Campaign Updated
     *          422:
     *              description: validation errors
     *          500:
     *              description: Internal server error
     *          401:
     *              description: Unauthorized
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              message:
     *                                  type: string
     *                                  example: Authorisation Required                      
    */

    router.put("/campaign/:campaignID",access,Campaign.updateCampaign)
    app.use("/api", router);
}