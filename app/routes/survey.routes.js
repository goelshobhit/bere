const { survey } = require("../models");
module.exports = app => {
	const Survey = require("../controllers/Survey.controller.js");
	var router = require("express").Router();
  const auth = require("../middleware/auth");
  const adminValidate = require("../middleware/adminValidate");
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
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
  *                               example: ["Beta","Test"]
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
     *                        User Restriction:
     *                            type: integer
     *                        Survey Questions:
     *                          type: array
     *                          items:
     *                             type: object
     *                             properties:  
     *                                 Survey Question:
     *                                     type: string  
     *                                 Question Status:
     *                                     type: integer  
     *                                 Question Answers:
     *                                     type: array
     *                                     items:
     *                                       type: object
     *                                       properties:
     *                                           Survey Answer:
     *                                                type: string
     * 
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
    router.post("/survey", auth, adminValidate.validate("create_survey"), Survey.createNewSurvey);
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
     *                example: sr_id,sr_brand_id,sr_title,sr_description,sr_color,sr_startdate_time,sr_enddate_time
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
     *                          sr_brand_id:
     *                              type: integer
     *                          sr_title:
     *                              type: string
     *                          sr_description:
     *                              type: string
     *                          sr_hashtags:
     *                            type: array
     *                            items:
     *                              oneOf:
     *                               type: string
  *                               example: ["Beta","Test"]
     *                          sr_color:
     *                              type: integer
     *                          sr_startdate_time:
     *                              type: date
     *                              example: 2021-11-22
     *                          sr_enddate_time: 
     *                              type: date
     *                              example: 2021-12-22
     *                          sr_status:
     *                              type: integer
     *                          survey_questions:
     *                            type: array
     *                            items:
     *                               type: object
     *                               properties:
     *                                   question_id:
     *                                       type: integer  
     *                                   question:
     *                                       type: string  
     *                                   status:
     *                                       type: integer  
     *                                   survey_question_answers:
     *                                       type: array
     *                                       items:
     *                                         type: object
     *                                         properties:
     *                                             answer_id:
     *                                                  type: integer
     *                                             answer:
     *                                                  type: string
     *                                        
	 *      parameters:
     *         - name: surveyID
     *           in: path
     *           required: true
     *           schema:
     *              type: integer
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
    router.post("/survey_questions", auth, adminValidate.validate("create_survey_question"), Survey.createSurveyQuestions);
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
     *                example: srq_id,sr_id,question,status
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
     *      description: Return All Survey Questions and Answers
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: A list of Surveys Questions and Answers
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
   * /api/survey_questions/{surveyQuestionId}:
   *   delete:
   *     parameters:
   *         - name: surveyQuestionId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *      - Survey
   *     description: Delete Survey Question with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete Survey Question with id
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
  router.delete("/survey_questions/:surveyQuestionId", auth, Survey.deleteSurveyQuestion); 

  /**
     * @swagger
     * /api/survey_question_answers:
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
     *                            required: true
     *                        Survey Question Id:
     *                            type: integer
     *                            required: true
     *                        Question Answers:
     *                            type: array
     *                            required: true
     *                            items:
     *                              type: string
     *     tags:
     *       - Survey
     *     description: Add Survey Question Answers
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add Survey Question Answers
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
    router.post("/survey_question_answers", auth, adminValidate.validate("create_survey_question_answer"), Survey.createSurveyQuestionAnswer);

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
     *                            required: true
     *                        Question ID:
     *                            type: integer
     *                            required: true
     *                        Survey Answer Ids:
     *                            type: array
     *                            required: true
     *                            items:
     *                              type: integer
     *                        Rewards Star:
     *                            type: integer
     *                        Rewards Collection Date:
     *                            type: date
     *                            example: 2022-01-20
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
    router.post("/survey_submissions", auth, adminValidate.validate("survey_submit"), Survey.submitSurvey);

    /**
   * @swagger
   * /api/survey_submissions/{surveySubmissionId}:
   *   delete:
   *     parameters:
   *         - name: surveySubmissionId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *      - Survey
   *     description: Delete Survey Submitted Record with id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Delete Survey Submitted Record with id
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
  router.delete("/survey_submissions/:surveySubmissionId", auth, Survey.deleteSurveySubmission);

// LIST Survey Statistic Based On Answers
    /** 
     * @swagger
     * /api/survey_stats:
     *  get:
     *      parameters:
     *          - name: surveyID
     *            in: query
     *            required: false
     *            schema:
     *                type: integer
     *          - name: surveyQuestionId
     *            in: query
     *            required: false
     *            schema:
     *                type: integer
     *          - name: surveyAnswerId
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
     *                example: st_id,sr_id,srq_id,srq_answer_id,srq_answer_count
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
     *      description: Return Survey Statistic Based On Answers
     *      produces:
     *          - application/json
     *      responses:
     *          200:
     *              description: A list of Survey Statistic Based On Answers
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

   /**
     * @swagger
     * /api/survey_tracking:
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
     *                            required: true
     *     tags:
     *       - Survey
     *     description: Survey Tracking
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Survey Tracking
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
    router.post("/survey_tracking", auth, adminValidate.validate("survey_tracking"), Survey.surveyTracking);
  
   /**
     * @swagger
     * /api/survey_tracking:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Survey ID:
     *                            type: integer
     *                            required: true
     *                        Survey Completed:
     *                            type: integer
     *     tags:
     *       - Survey
     *     description: Update Survey Tracking
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Update Survey Tracking
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
   router.put("/survey_tracking",auth, adminValidate.validate("survey_tracking"), Survey.updateSurveyTracking)
    app.use("/api", router);
}