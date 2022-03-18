const db = require("../models");
const Survey = db.survey;
const Brand = db.brands;
const SurveyQuestions = db.survey_questions;
const surveyQuestionAnswers = db.survey_question_answers;
const SurveySubmissions = db.survey_submissions;
const SurveyStats = db.survey_stats;
const SurveyUserComplete = db.survey_user_complete;
const audit_log = db.audit_log;
const common = require("../common");
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
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
        "sr_enddate_time": body.hasOwnProperty("End Date") ? body["End Date"] : new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
        "sr_status": body.hasOwnProperty("Survey Status") ? body["Survey Status"] : 1,
        "sr_usr_restriction": body.hasOwnProperty("User Restriction") ? body["User Restriction"] : 0
    }
    Survey.create(SurveyData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'Survey', data.sr_id, data.dataValues);
            common.jsonTask(data.sr_id, 'Survey', 'add');

            var surveyRequestQuestions = body.hasOwnProperty("Survey Questions") ? body["Survey Questions"] : '';
            /* check survey Valid or not. */
            if (surveyRequestQuestions.length) {
                for (const surveyRequestQuestion in surveyRequestQuestions) {
                    var question_status = 1;
                    if (surveyRequestQuestions[surveyRequestQuestion]['Question Status'] != undefined) {
                        question_status = surveyRequestQuestions[surveyRequestQuestion]['Question Status'];
                    }
                    SurveyQuestions.create({
                        "sr_id": data.sr_id,
                        "question": surveyRequestQuestions[surveyRequestQuestion]['Survey Question'],
                        "status": question_status
                    }).then(question_data => {
                        audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'survey_questions', question_data.srq_id, question_data.dataValues);
                        const questionAnswers = surveyRequestQuestions[surveyRequestQuestion]['Question Answers'];
                        if (questionAnswers.length) {
                            for (const questionAnswer in questionAnswers) {
                                surveyQuestionAnswers.create({
                                    "sr_id": data.sr_id,
                                    "srq_id": question_data.srq_id,
                                    "answer": questionAnswers[questionAnswer]['Survey Answer']
                                });
                            }
                        }

                    })
                        .catch(err => {
                            logger.log("error", "Some error occurred while creating the Survey Question=" + err);
                            res.status(500).send({
                                message:
                                    err.message || "Some error occurred while creating the Survey Question."
                            });
                        });
                }
            }
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
    options['include'] = [
        {
            model: SurveyQuestions,
            required: false,
            attributes: [['srq_id', 'question_id'], 'question', 'status'],
            include: [{
                model: surveyQuestionAnswers,
                required: false,
                attributes: [['srq_answer_id', 'answer_id'], 'answer'],
            }
            ]
        }
    ]
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
    options['include'] = [
        {
            model: SurveyQuestions,
            required: false,
            attributes: [['srq_id', 'question_id'], 'question', 'status'],
            include: [{
                model: surveyQuestionAnswers,
                required: false,
                attributes: [['srq_answer_id', 'answer_id'], 'answer'],
            }
            ]
        }
    ]
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    var requested_body = JSON.parse(JSON.stringify(req.body));
    if (requested_body.hasOwnProperty('survey_questions')) {
        delete requested_body['survey_questions'];
    }
    const id = req.params.surveyID;
    var SurveyDetails = await Survey.findOne({
        where: {
            sr_id: id
        }
    });
    Survey.update(requested_body, {
        returning: true,
        where: {
            sr_id: id
        }
    }).then(function ([num, [result]]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'update', 'survey', id, result.dataValues, SurveyDetails);
            common.jsonTask(id, 'Survey', 'update');
            var surveyRequestQuestions = req.body.hasOwnProperty("survey_questions") ? req.body["survey_questions"] : '';
            /* check survey Valid or not. */
            if (surveyRequestQuestions.length) {
                for (const surveyRequestQuestion in surveyRequestQuestions) {
                    var question_status = 1;
                    if (surveyRequestQuestions[surveyRequestQuestion]['status'] != undefined) {
                        question_status = surveyRequestQuestions[surveyRequestQuestion]['status'];
                    }
                    if (surveyRequestQuestions[surveyRequestQuestion]['question_id'] != undefined) {
                        var requested_question = JSON.parse(JSON.stringify(surveyRequestQuestions[surveyRequestQuestion]));
                        if (requested_question.hasOwnProperty('survey_question_answers')) {
                            delete requested_question['survey_question_answers'];
                        }
                        var requested_question_id = surveyRequestQuestions[surveyRequestQuestion]['question_id'];
                        SurveyQuestions.update(requested_question, {
                            returning: true,
                            where: {
                                srq_id: requested_question_id
                            }
                        }).then(function ([question_num, [question_result]]) {
                            if (question_num == 1) {
                                audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'survey_questions', question_result.dataValues.srq_id, question_result.dataValues);
                                const questionAnswers = surveyRequestQuestions[surveyRequestQuestion]['survey_question_answers'];
                                if (questionAnswers != undefined && questionAnswers.length) {
                                    for (const questionAnswer in questionAnswers) {
                                        if (questionAnswers[questionAnswer]['answer_id'] != undefined) {
                                            var requested_question_id_in = surveyRequestQuestions[surveyRequestQuestion]['question_id'];
                                            var requested_answer_id = questionAnswers[questionAnswer]['answer_id'];
                                            surveyQuestionAnswers.update(questionAnswers[questionAnswer], {
                                                returning: true,
                                                where: {
                                                    srq_answer_id: requested_answer_id,
                                                    srq_id: requested_question_id_in
                                                }
                                            }).then(function ([ans_num, [ans_result]]) {
                                                if (ans_num == 1) {
                                                    audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'survey_questions', ans_result.dataValues.srq_answer_id, ans_result.dataValues);
                                                }
                                            })
                                                .catch(err => {
                                                    logger.log("error", err + ":Error updating Survey Question Answer with id=" + requested_answer_id);
                                                    return res.status(500).send({
                                                        message: "Error updating Survey Question Answer with id=" + requested_answer_id
                                                    });
                                                });
                                        } else {
                                            surveyQuestionAnswers.create({
                                                "sr_id": id,
                                                "srq_id": requested_question_id,
                                                "answer": questionAnswers[questionAnswer]['answer']
                                            });
                                        }
                                    }
                                }

                            } else {
                                return res.status(400).send({
                                    message: `Cannot update Survey Question with id=${requested_question_id}. Maybe Survey Question was not found or req.body is empty!`
                                });
                            }

                        }) .catch(err => {
                                logger.log("error", err + ":Error updating Survey Question with id=" + requested_question_id);
                                console.log(err)
                                return res.status(500).send({
                                    message: "Error updating Survey Question with id=" + requested_question_id
                                });
                            });
                    } else {
                        SurveyQuestions.create({
                            "sr_id": id,
                            "question": surveyRequestQuestions[surveyRequestQuestion]['question'],
                            "status": question_status
                        }).then(question_data => {
                            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'survey_questions', question_data.srq_id, question_data.dataValues);
                            const questionAnswers = surveyRequestQuestions[surveyRequestQuestion]['survey_question_answers'];
                            if (questionAnswers != undefined && questionAnswers.length) {
                                for (const questionAnswer in questionAnswers) {
                                    surveyQuestionAnswers.create({
                                        "sr_id": id,
                                        "srq_id": question_data.srq_id,
                                        "answer": questionAnswers[questionAnswer]['answer']
                                    }).then(question_create_data => {
                                        audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'survey_questions', question_create_data.srq_id, question_create_data.dataValues);
                                    }).catch(err => {
                                        logger.log("error", "Some error occurred while creating the Survey Questions=" + err);
                                        return res.status(500).send({
                                            message:
                                                err.message || "Some error occurred while creating the Survey Questions."
                                        });
                                    });

                                }
                            }

                        })
                            .catch(err => {
                                logger.log("error", "Some error occurred while creating the Survey Question=" + err);
                                return res.status(500).send({
                                    message:
                                        err.message || "Some error occurred while creating the Survey Question."
                                });
                            });
                    }

                }
            }
            return res.status(200).send({
                message: "Survey updated successfully."
            });
        } else {
            return res.status(400).send({
                message: `Cannot update Survey with id=${id}. Maybe Survey was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err + ":Error updating Survey with id=" + id);
        console.log(err)
        return res.status(500).send({
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const body = req.body;
    /* check survey Valid or not. */
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
 * Function to get all survey questions and answers
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
    options['include'] = [
        {
            model: Survey,
            required: false,
            attributes: ['sr_title'],
            where: {
                sr_status: 1
            }
        },
        {
            model: surveyQuestionAnswers,
            required: false
        }
    ]
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
 * Function to create survey answer
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createSurveyQuestionAnswer = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const body = req.body;
    /* check survey Valid or not. */
    var surveyOptions = {
        where: {
            sr_id: body["Survey ID"],
            srq_id: body["Survey Question Id"]
        }
    };
    const surveyQuestionAnswer = await surveyQuestionAnswers.findOne(surveyOptions);
    if (surveyQuestionAnswer) {
        res.status(422).send({
            message: "Survey Answers Already Added For This Question."
        });
        return;
    }

    var questionAnswerData = [];
    var questionAnswers = body["Question Answers"];
    /* check survey Valid or not. */
    for (const questionAnswer in questionAnswers) {
        questionAnswerData.push({
            "sr_id": req.body["Survey ID"],
            "srq_id": req.body["Survey Question Id"],
            "answer": questionAnswers[questionAnswer]
        });
    }
    if (questionAnswerData.length) {
        surveyQuestionAnswers.bulkCreate(questionAnswerData).catch(err => {
            logger.log("error", "Some error occurred while creating the Search Objects=" + err);
        });
        res.status(201).send({
            msg: "Survey Answers added Successfully"
        });
    } else {
        res.status(400).send({
            msg:
                "Survey Answers must be Valid Array."
        });
        return;
    }

}

/**
 * Function to submit survey
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.submitSurvey = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const body = req.body;
    if (!body.hasOwnProperty("Question ID") || !body["Question ID"]) {
        res.status(500).send({
            message: "Question ID is required."
        });
        return;
    }
    if (!body.hasOwnProperty("Survey Answer Ids") || !body["Survey Answer Ids"]) {
        res.status(500).send({
            message: "Survey Answer Ids are required."
        });
        return;
    }
    var uid = req.header(process.env.UKEY_HEADER || "x-api-key");

    var surveyAnswerIds = body["Survey Answer Ids"];
    const SurveySubmissionData = {
        "srs_sr_id": body["Survey ID"],
        "srs_uid": uid,
        "srs_srq_id": body["Question ID"],
        "srs_srq_answer_id": surveyAnswerIds,
        "srs_rewards_star": body.hasOwnProperty("Rewards Star") ? body["Rewards Star"] : "",
        "srs_rewards_collection_date": body.hasOwnProperty("Rewards Collection Date") ? body["Rewards Collection Date"] : ""
    }
    var SubmissionOptions = {
        where: {
            srs_srq_id: body["Question ID"],
            srs_sr_id: body["Survey ID"],
            srs_uid: uid
        }
    };
    const SurveySubmissionsResult = await SurveySubmissions.findOne(SubmissionOptions);
    if (SurveySubmissionsResult) {
        res.status(500).send({
            message: "The user is not permitted to answer the same Survey Question Again."
        });
        return;
    }
    if (!surveyAnswerIds.length) {
        res.status(400).send({
            message: "Survey Answer Ids must be Valid Array."
        });
        return;
    }
    const surveyAnswerExists = {};
    for (const surveyAnswerId in surveyAnswerIds) {
        var statOptions = {
            where: {
                srq_answer_id: surveyAnswerIds[surveyAnswerId],
                srq_id: body["Question ID"]
            }
        };
        surveyAnswerExists[surveyAnswerIds[surveyAnswerId]] = await SurveyStats.findOne(statOptions);
    }

    SurveySubmissions.create(SurveySubmissionData)
        .then(data => {
            audit_log.saveAuditLog(uid, 'add', 'Survey', data.srs_id, data.dataValues);
            /* insert or update surveyStat table for answer count */
            for (const surveyAnswerId in surveyAnswerIds) {
                var survey_answer_id = surveyAnswerIds[surveyAnswerId];
                if (typeof surveyAnswerExists[survey_answer_id] !== 'undefined' && surveyAnswerExists[survey_answer_id]) {
                    const total_answer_count = parseInt(surveyAnswerExists[survey_answer_id].srq_answer_count) + 1;
                    SurveyStats.update({
                        "srq_answer_count": total_answer_count
                    }, {
                        where: {
                            st_id: surveyAnswerExists[survey_answer_id].st_id
                        }
                    });
                } else {
                    const SurveyStatData = {
                        "sr_id": body["Survey ID"],
                        "srq_id": body["Question ID"],
                        "srq_answer_id": survey_answer_id,
                        "srq_answer_count": 1
                    }
                    SurveyStats.create(SurveyStatData).catch(err => {
                        logger.log("error", "Some error occurred while inserting data in surveyStat=" + err);
                    });
                }
            }

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
            required: false,
            attributes: ['sr_title', 'sr_color'],
            where: {
                sr_status: 1
            },
            include: [{
                model: Brand,
                required: false,
                where: {
                    cr_co_status: 1
                },
                attributes: ['cr_co_name'],
            }
            ]
        },
        {
            model: surveyQuestionAnswers,
            required: false,
            attributes: ['answer'],
            include: [{
                model: SurveyQuestions,
                required: false,
                attributes: ['question'],
            }
            ]
        }
    ]
    if (req.query.surveyID) {
        options['where'] = {
            sr_id: req.query.surveyID
        }
    }
    if (req.query.surveyQuestionId) {
        options['where']['srq_id'] = req.query.surveyQuestionId;
    }
    if (req.query.surveyAnswerId) {
        options['where']['srq_answer_id'] = req.query.surveyAnswerId;
    }
    var total = await SurveyStats.count({
        where: options['where']
    });
    const surveyStatsList = await SurveyStats.findAll(options);
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
    var answer_percentage = 0;
    const SurveyStatResult = [];
    for (const surveyStats in surveyStatsList) {
        answer_percentage = parseFloat(surveyStatsList[surveyStats].srq_answer_count * 100 / questionAnswerCount[0][surveyStatsList[surveyStats].srq_id]);
        var questionAnswer = '';
        if (surveyStatsList[surveyStats].survey_question_answer && surveyStatsList[surveyStats].survey_question_answer.answer) {
            questionAnswer = surveyStatsList[surveyStats].survey_question_answer.answer;
        }
        SurveyStatResult.push({
            "Survey": surveyStatsList[surveyStats].survey,
            "Survey Id": surveyStatsList[surveyStats].sr_id,
            "Survey Question Id": surveyStatsList[surveyStats].srq_id,
            "Survey Answer Id": surveyStatsList[surveyStats].srq_answer_id,
            "Survey Answer": questionAnswer,
            "Answer Percentage": answer_percentage.toFixed(2),
            "Survey Question": surveyStatsList[surveyStats].survey_question_answer.survey_question.question,
        });
    }

    res.status(200).send({
        data: SurveyStatResult,
        totalRecords: total
    });
};

/**
 * Function to track survey for user
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.surveyTracking = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const body = req.body;
    /* check survey Valid or not. */
    var surveyOptions = {
        where: {
            sr_id: body["Survey ID"],
            sr_status: 1
        }
    };
    const survey = await Survey.findOne(surveyOptions);
    if (!survey) {
        res.status(500).send({
            message: "Survey not found or inactive."
        });
        return;
    }
    var uid = req.header(process.env.UKEY_HEADER || "x-api-key");
    const SurveyTrackingData = {
        "sr_id": body["Survey ID"],
        "sr_uid": uid,
        "sr_completed": 0,
        "sr_usr_restriction": survey.sr_usr_restriction
    }
    var options = {
        where: {
            sr_uid: uid,
            sr_id: body["Survey ID"]
        }
    };
    const userSurvey = await SurveyUserComplete.findOne(options);
    if (userSurvey && userSurvey.sr_completed == 1) {
        res.status(500).send({
            message: "The user is not permitted to complete the same survey Again."
        });
        return;
    } else if (userSurvey && userSurvey.sr_completed == 0) {
        res.status(500).send({
            message: "Already submitted survey tracking request for this survey."
        });
        return;
    }
    SurveyUserComplete.create(SurveyTrackingData).then(data => {
        audit_log.saveAuditLog(uid, 'tracking', 'Survey tracking', data.su_id, data.dataValues);
        res.status(201).send({
            msg: "Survey Tracking Record Added Successfully",
            SurveyTrackingID: data.su_id
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while inserting data in survey tracking table=" + err);
    });
}

/**
 * Function to update track survey for user
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateSurveyTracking = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const body = req.body;
    var uid = req.header(process.env.UKEY_HEADER || "x-api-key");
    var surveyTrackingOptions = {
        where: {
            sr_uid: uid,
            sr_id: body["Survey ID"]
        }
    };
    const SurveyUserCompleteData = await SurveyUserComplete.findOne(surveyTrackingOptions);
    if (!SurveyUserCompleteData) {
        res.status(500).send({
            message: "Survey tracking record not found."
        });
        return;
    }

    if (SurveyUserCompleteData.sr_completed == 1) {
        res.status(500).send({
            message: "The user is not permitted to complete the same survey Again."
        });
        return;
    }
    var surveyCompletionDate = null;
    if (body.hasOwnProperty("Survey Completed") && body["Survey Completed"] == 1) {
        surveyCompletionDate = new Date();
    }
    const SurveyTrackingData = {
        "sr_completed": body.hasOwnProperty("Survey Completed") ? body["Survey Completed"] : 1,
        "sr_completion_date": surveyCompletionDate,
    }
    SurveyUserComplete.update(SurveyTrackingData, {
        returning: true,
        where: {
            sr_id: body["Survey ID"],
            sr_uid: uid
        }
    }).then(data => {
        audit_log.saveAuditLog(uid, 'tracking', 'Survey tracking', data.su_id, data.dataValues);
        res.status(201).send({
            msg: "Survey Tracking Record updated Successfully"
        });
    }).catch(err => {
        logger.log("error", "Some error occurred while update data in survey tracking table=" + err);
    });
}

/**
 * Function to delete Survey Question
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteSurveyQuestion = async (req, res) => {
    const surveyQuestionDetails = await SurveyQuestions.findOne({
        where: {
            srq_id: req.params.surveyQuestionId
        }
    });
    if (!surveyQuestionDetails) {
        res.status(500).send({
            message: "Survey Question not Found with id=" + req.params.surveyQuestionId
        });
        return;
    }
    surveyQuestionAnswers.destroy({
        where: {
            srq_id: req.params.surveyQuestionId
        }
    })
    SurveyQuestions.destroy({
        where: {
            srq_id: req.params.surveyQuestionId
        }
    })
        .then(num => {
            res.status(200).send({
                message: "Survey Question deleted successfully!"
            });
            return;
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Survey Question with id=" + req.params.surveyQuestionId
            });
            return;
        });
}

/**
 * Function to delete Survey Submit Record
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteSurveySubmission = async (req, res) => {
    const surveySubmissionDetails = await SurveySubmissions.findOne({
        where: {
            srs_id: req.params.surveySubmissionId
        }
    });
    if (!surveySubmissionDetails) {
        res.status(500).send({
            message: "Survey Submit Record not Found with id=" + req.params.surveySubmissionId
        });
        return;
    }
    const surveyStatsDetails = await SurveyStats.findAll({
        where: {
            sr_id: surveySubmissionDetails.srs_sr_id,
            srq_id: surveySubmissionDetails.srs_srq_id,
            srq_answer_id: surveySubmissionDetails.srs_srq_answer_id
        }
    });
    SurveySubmissions.destroy({
        where: {
            srs_id: req.params.surveySubmissionId
        }
    })
        .then(num => {
            if (surveyStatsDetails.length) {
                for (const surveyStatsDetail in surveyStatsDetails) {
                    const total_answer_count = parseInt(surveyStatsDetails[surveyStatsDetail].srq_answer_count) - 1;
                    if (total_answer_count > 0) {
                        SurveyStats.update({
                            "srq_answer_count": total_answer_count
                        }, {
                            where: {
                                st_id: surveyStatsDetails[surveyStatsDetail].st_id
                            }
                        });
                    } else {
                        SurveyStats.destroy({
                            where: {
                                st_id: surveyStatsDetails[surveyStatsDetail].st_id
                            }
                        });
                    }
                }
            }
            res.status(200).send({
                message: "Survey Submit Record deleted successfully!"
            });
            return;
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Survey Submit Record with id=" + req.params.surveySubmissionId
            });
            return;
        });
}