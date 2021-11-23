const { survey } = require("../models");
module.exports = app => {
	const Survey = require("../controllers/Survey.controller.js");
	var router = require("express").Router();
	const auth = require("../middleware/auth");
	/**
     * @swagger
     * /api/survey:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Brand ID:
     *                            type: integer
     *                        Survey title:
     *                            type: string
     *                        Survey Desc:
     *                            type: string
     *                        Survey Hashtag:
     *                            type: string
     *                        Survey Color:
     *                            type: integer
     *                        Start Date:
     *                            type: date
     *                            example: 2021-11-22
     *                        End Date:
     *                            type: date
     *                            example: 2021-12-22
     *                        Survey Status:
     *                            type: integer
     *     tags:
     *       - Survey
     *     description: Add new Survey
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add new survey
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
    router.post("/survey", Survey.createNewSurvey);
    // LIST ALL SURVEYS
    /** 
     * @swagger
     * /api/survey:
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
     *          - Survey
     *      description: Return All Surveys
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: A list of Surveys
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
   router.get('/survey',auth, Survey.surveyListing)

   // GET SINGLE SURVEY
   /** 
    * @swagger
    * /api/survey/{surveyID}:
    *  get:
    *      parameters:
    *          - name: surveyID
    *            in: path
    *            required: true
    *            schema:
    *                type: integer
    *      tags:
    *          - Survey
    *      description: Retrieve a single survey with surveyID
    *      produces:
    *          - application/json:
    *      responses:
    *          200:
    *              description: Details of a campaign
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
   
   router.get("/survey/:surveyID",auth,  Survey.surveyDetails)
    // UPDATE survey
    /** 
     * @swagger
     * /api/survey/{surveyID}:
     *  put:
     *      requestBody:
     *          required: false
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          Brand ID:
     *                              type: integer
     *                          Survey title:
     *                              type: string
     *                          Survey Desc:
     *                              type: string
     *                          Survey Hashtag:
     *                              type: string
     *                          Survey Color:
     *                              type: integer
     *                          Start Date:
     *                              type: date
     *                              example: 2021-11-22
     *                          End Date: 
     *                              type: date
     *                              example: 2021-12-22
     *                          Survey Status:
     *                              type: integer
	 *      parameters:
     *         - name: surveyID
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *      tags:
     *          - Survey
     *      description: Update survey
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: Survey Updated
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

   router.put("/survey/:surveyID",auth,Survey.updateSurvey)
   /**
     * @swagger
     * /api/survey_questions:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Survey ID:
     *                            type: integer
     *                        Survey Question:
     *                            type: string
     *                        Question Status:
     *                            type: integer
     *     tags:
     *       - Survey
     *     description: Add new Survey Questions
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add new survey questions
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
    router.post("/survey_questions", Survey.createSurveyQuestions);
    // LIST ALL Survey Questions
    /** 
     * @swagger
     * /api/survey_questions:
     *  get:
     *      parameters:
     *          - name: surveyID
     *            in: query
     *            required: false
     *            schema:
     *                type: integer
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
     *          - Survey
     *      description: Return All Survey Questions
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: A list of Surveys
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
   router.get('/survey_questions',auth, Survey.surveyQuestionListing);

   /**
     * @swagger
     * /api/survey_submissions:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Survey ID:
     *                            type: integer
     *                        Question ID:
     *                            type: string
     *                        Survey Answer:
     *                            type: string
     *                        Rewards Star:
     *                            type: integer
     *                        Rewards Collection Date:
     *                            type: date
     *     tags:
     *       - Survey
     *     description: Submit Survey
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Submit Survey
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
    router.post("/survey_submissions", Survey.submitSurvey);
// LIST ALL Survey Questions
    /** 
     * @swagger
     * /api/survey_questions:
     *  get:
     *      parameters:
     *          - name: surveyID
     *            in: query
     *            required: false
     *            schema:
     *                type: integer
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
     *          - Survey
     *      description: Return All Survey Questions
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: A list of Surveys
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
   router.get('/survey_stats',auth, Survey.surveyStatsListing);
    app.use("/api", router);
}