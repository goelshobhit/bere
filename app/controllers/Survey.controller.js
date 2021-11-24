const db = require("../models");
const Survey = db.survey;
const Brand = db.brands;
const SurveyQuestions = db.survey_questions;
const SurveySubmissions = db.survey_submissions;
const SurveyStats = db.survey_stats;
const SurveyUserComplete = db.survey_user_complete;
const audit_log = db.audit_log;
const logger = require("../middleware/logger");
const {
    validationResult
} = require("express-validator");


/**
 * Function to create new survey
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNewSurvey = async (req, res) => {
    const body = req.body;
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     res.status(422).json({
    //         errors: errors.array()
    //     });
    //     return;
    // }
    if (!req.body["Survey title"]) {
        res.status(500).send({
            msg:
                "Survey Title  is required"
        });
        return;
    }
    if (!body.hasOwnProperty("Brand ID") || !req.body["Brand ID"]) {
        res.status(500).send({
            message: "Please Choose One Brand Before Submitting Survey."
        });
        return;
    }
    const SurveyData = {
        "sr_brand_id": body.hasOwnProperty("Brand ID") ? body["Brand ID"] : 0,
        "sr_title": body.hasOwnProperty("Survey title") ? body["Survey title"] : "",
        "sr_description": body.hasOwnProperty("Survey Desc") ? body["Survey Desc"] : "",
        "sr_hashtags": body.hasOwnProperty("Survey Hashtag") ? body["Survey Hashtag"] : "",
        "sr_color": body.hasOwnProperty("Survey Color") ? body["Survey Color"] : 0,
        "sr_startdate_time": body.hasOwnProperty("Start Date") ? body["Start Date"] : new Date(),
        "sr_enddate_time": body.hasOwnProperty("End Date") ? body["End Date"] : new Date(),
        "sr_status": body.hasOwnProperty("Survey Status") ? body["Survey Status"] : 1
    }
    Survey.create(SurveyData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'Survey', data.sr_id, data.dataValues);
            res.status(201).send({
                msg: "Survey Added Successfully",
                SurveyID: data.sr_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while creating the Survey=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Survey."
            });
        });
}
/**
 * Function to get all surveys
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.surveyListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'sr_id';
    const sortOrder = req.query.sortOrder || 'DESC';

    var options = {
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if (req.query.sortVal) {
        var sortValue = req.query.sortVal.trim();
        options.where = sortValue ? {
            [Op.or]: [{
                sr_title: {
                    [Op.iLike]: `%${sortValue}%`
                }
            }
            ]
        } : null;
    }
    var total = await Survey.count({
        where: options['where']
    });
    const survey_list = await Survey.findAll(options);
    res.status(200).send({
        data: survey_list,
        totalRecords: total
    });
};
/**
 * Function to get single survey
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.surveyDetails = async (req, res) => {
    const surveyID = req.params.surveyID;
    var options = {
        where: {
            sr_id: surveyID
        }
    };
    const survey = await Survey.findOne(options);
    if (!survey) {
        res.status(500).send({
            message: "survey not found"
        });
        return;
    }
    res.status(200).send({
        data: survey
    });
};
/**
 * Function to update single survey
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateSurvey = async (req, res) => {
    const body = req.body;
    const id = req.params.surveyID;
    var SurveyDetails = await Survey.findOne({
        where: {
            sr_id: id
        }
    });
    const SurveyData = {
        "sr_brand_id": body.hasOwnProperty("Brand ID") ? body["Brand ID"] : 0,
        "sr_title": body.hasOwnProperty("Survey title") ? body["Survey title"] : "",
        "sr_description": body.hasOwnProperty("Survey Desc") ? body["Survey Desc"] : "",
        "sr_hashtags": body.hasOwnProperty("Survey Hashtag") ? body["Survey Hashtag"] : "",
        "sr_color": body.hasOwnProperty("Survey Color") ? body["Survey Color"] : 0,
        "sr_startdate_time": body.hasOwnProperty("Start Date") ? body["Start Date"] : new Date(),
        "sr_enddate_time": body.hasOwnProperty("End Date") ? body["End Date"] : new Date(),
        "sr_status": body.hasOwnProperty("Survey Status") ? body["Survey Status"] : 1
    }
    Survey.update(SurveyData, {
        returning: true,
        where: {
            sr_id: id
        }
    }).then(function ([num, [result]]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'update', 'survey', id, result.dataValues, SurveyDetails);
            res.status(200).send({
                message: "Survey updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Survey with id=${id}. Maybe Survey was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err + ":Error updating Survey with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Survey with id=" + id
        });
    });
};

/**
 * Function to create survey question
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createSurveyQuestions = async (req, res) => {
    const body = req.body;
    if (!req.body["Survey Question"]) {
        res.status(500).send({
            msg:
                "Survey question is required."
        });
        return;
    }
    if (!body.hasOwnProperty("Survey ID") || !req.body["Survey ID"]) {
        res.status(500).send({
            message: "Survey ID is required."
        });
        return;
    }
    const SurveyQuestionData = {
        "sr_id": body.hasOwnProperty("Survey ID") ? body["Survey ID"] : 0,
        "question": body.hasOwnProperty("Survey Question") ? body["Survey Question"] : "",
        "status": body.hasOwnProperty("Question Status") ? body["Question Status"] : "1"
    }
    SurveyQuestions.create(SurveyQuestionData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'Survey', data.srq_id, data.dataValues);
            res.status(201).send({
                msg: "Survey Question Added Successfully",
                SurveyQuestionID: data.srq_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while creating the Survey Question=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Survey Question."
            });
        });
}

/**
 * Function to get all surveys
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.surveyQuestionListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'srq_id';
    const sortOrder = req.query.sortOrder || 'DESC';

    var options = {
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if (req.query.sortVal) {
        var sortValue = req.query.sortVal.trim();
        options.where = sortValue ? {
            [Op.or]: [{
                question: {
                    [Op.iLike]: `%${sortValue}%`
                }
            }
            ]
        } : null;
    }
    if (req.query.surveyID) {
        options['where'] = {
            sr_id: req.query.surveyID
        }
    }
    var total = await SurveyQuestions.count({
        where: options['where']
    });
    const survey_question_list = await SurveyQuestions.findAll(options);
    res.status(200).send({
        data: survey_question_list,
        totalRecords: total
    });
};

/**
 * Function to submit survey
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.submitSurvey = async (req, res) => {
    const body = req.body;
    if (!body["Survey ID"]) {
        res.status(500).send({
            msg:
                "Survey ID is required."
        });
        return;
    }
    if (!body.hasOwnProperty("Question ID") || !body["Question ID"]) {
        res.status(500).send({
            message: "Question ID is required."
        });
        return;
    }
    if (!body.hasOwnProperty("Survey Answer") || !body["Survey Answer"]) {
        res.status(500).send({
            message: "Survey Answer is required."
        });
        return;
    }
    var uid = req.header(process.env.UKEY_HEADER || "x-api-key");

    var options = {
        where: {
            sr_uid: uid,
            sr_id: body["Survey ID"]
        }
    };
    const userSurvey = await SurveyUserComplete.findOne(options);

    if (typeof userSurvey !== 'undefined' && userSurvey) {
        res.status(500).send({
            message: "The user is not permitted to complete the same survey Again."
        });
        return;
    }
    var surveyAnswer = body["Survey Answer"];
    const SurveySubmissionData = {
        "srs_sr_id": body["Survey ID"],
        "srs_uid": uid,
        "srs_srq_id": body["Question ID"],
        "srs_srq_answer": surveyAnswer,
        "srs_rewards_star": body.hasOwnProperty("Rewards Star") ? body["Rewards Star"] : "",
        "srs_rewards_collection_date": body.hasOwnProperty("Rewards Collection Date") ? body["Rewards Collection Date"] : ""
    }
    var statOptions = {
        where: {
            srq_answer: surveyAnswer,
            srq_id: body["Question ID"]
        }
    };
    const surveyAnswerExist = await SurveyStats.findOne(statOptions);
    SurveySubmissions.create(SurveySubmissionData)
        .then(data => {
            audit_log.saveAuditLog(uid, 'add', 'Survey', data.srs_id, data.dataValues);
            /* insert or update surveyStat table for answer count */
            if (typeof surveyAnswerExist !== 'undefined' && surveyAnswerExist) {
                const total_answer_count = parseInt(surveyAnswerExist.srq_answer_count) + 1;
                SurveyStats.update({
                    "srq_answer_count": total_answer_count
                }, {
                    where: {
                        st_id: surveyAnswerExist.st_id
                    }
                });
            } else {
                const SurveyStatData = {
                    "sr_id": body["Survey ID"],
                    "srq_id": body["Question ID"],
                    "srq_answer": surveyAnswer,
                    "srq_answer_count": 1
                }
                SurveyStats.create(SurveyStatData).catch(err => {
                    logger.log("error", "Some error occurred while inserting data in surveyStat=" + err);
                });
            }
            const SurveyTrackingData = {
                "sr_id": body["Survey ID"],
                "sr_uid": uid,
                "sr_completion_date": new Date(),
                "sr_usr_restriction": 0
            }
            SurveyUserComplete.create(SurveyTrackingData).catch(err => {
                logger.log("error", "Some error occurred while inserting data in survey tracking table=" + err);
            });
            res.status(201).send({
                msg: "Survey Submission Done Successfully",
                SurveySubmissionID: data.srs_id,
                status_id: 1
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while submitting the Survey=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while submitting the Survey.",
                status_id: 0
            });
        });
};

/**
 * Function to get all surveys
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.surveyStatsListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'srq_id';
    const sortOrder = req.query.sortOrder || 'DESC';

    var options = {
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if (req.query.sortVal) {
        var sortValue = req.query.sortVal.trim();
        options.where = sortValue ? {
            [Op.or]: [{
                question: {
                    [Op.iLike]: `%${sortValue}%`
                }
            }
            ]
        } : null;
    }
    options['include'] = [
        {
          model: Survey,
          required:false,
          attributes:['sr_title'],
          where : {
            sr_status: 1
          },
          include: [{
            model: Brand,
            required:false,
            where : {
              cr_co_status: 1
            },
              attributes:['cr_co_name'],
            }]
        }
      ]
    if (req.query.surveyID) {
        options['where'] = {
            sr_id: req.query.surveyID
        }
    }
    if (req.query.srq_answer) {
        options['where']['srq_answer'] = req.query.srq_answer;
    }
    var total = await SurveyStats.count({
        where: options['where']
    });
    const surveyStatsList = await SurveyStats.findAll(options);
    // res.status(200).send({
    //     data: surveyStatsList,
    //     totalRecords: total
    // });
    const questionAnswerCount = [];
    var QuestionCountObj = {};
    for (const surveyStats in surveyStatsList) {
        if (typeof QuestionCountObj[surveyStatsList[surveyStats].srq_id] !== 'undefined' && QuestionCountObj[surveyStatsList[surveyStats].srq_id]) {
            QuestionCountObj[surveyStatsList[surveyStats].srq_id] += surveyStatsList[surveyStats].srq_answer_count;
        } else {
            QuestionCountObj[surveyStatsList[surveyStats].srq_id] = surveyStatsList[surveyStats].srq_answer_count;
        }
    }
    questionAnswerCount.push(QuestionCountObj);
    var answer_percentage  = 0;
    const SurveyStatResult = [];
    for (const surveyStats in surveyStatsList) {
       answer_percentage = parseFloat(surveyStatsList[surveyStats].srq_answer_count*100/questionAnswerCount[0][surveyStatsList[surveyStats].srq_id]);
    //    res.status(200).send({
    //     survey: surveyStatsList[surveyStats].survey.brand.cr_co_name
    // });
    // return;
    // console.log("survey======="+surveyStatsList[surveyStats].survey.sr_title);
    // console.log("cr_co_name======="+surveyStatsList[surveyStats].survey.brand.cr_co_name);
    // var surveyName = surveyStatsList[surveyStats].survey.sr_title;
    // var brandName = surveyStatsList[surveyStats].survey.brand.cr_co_name;
       SurveyStatResult.push({
            //"Survey Name": surveyName,
            //"Brand Name": brandName,
            "Survey": surveyStatsList[surveyStats].survey,
            "Survey Id": surveyStatsList[surveyStats].sr_id,
            "Survey Question id": surveyStatsList[surveyStats].srq_id,
            "Survey Answer": surveyStatsList[surveyStats].srq_answer,
            "Answer Percentage": answer_percentage.toFixed(2)
          });
    }
    
    res.status(200).send({
        data: SurveyStatResult,
        totalRecords: total
    });
};