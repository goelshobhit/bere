const db = require("../../models");
const contentReport = db.content_report;
const contentReportCategory = db.content_report_category;
const contentReportUser = db.content_report_user;
const contentReportModerate = db.content_report_moderate;
const logger = require("../../middleware/logger");
const Op = db.Sequelize.Op;
const common = require("../../common");
const audit_log = db.audit_log

/**
 * Function to submit content report
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.submitContentReport = async (req, res) => {
  const body = req.body;
  if (!body["Content Report Cat Id"]) {
    res.status(500).send({
      msg:
        "Content Report Cat Id is required"
    });
    return;
  }
  if (!body["Content Report Name"]) {
    res.status(500).send({
      msg:
        "Content Report Name is required"
    });
    return;
  }

  if (!body["Content Report Type"] || !body["Content Report Type Id"]) {
    res.status(500).send({
      msg:
        "Content Report Type or Content Report Type Id is required"
    });
    return;
  }
  var userId = req.header(process.env.UKEY_HEADER || "x-api-key");
  var options = {
    where: {
      content_report_cat_id: body["Content Report Cat Id"]
    }
  };
  const contentReportCategorydetail = await contentReportCategory.findOne(options);
  if (!contentReportCategorydetail) {
    res.status(500).send({
      message: "Content Report Category not Found."
    });
    return;
  }

  const data = {
    "content_report_cat_id": body["Content Report Cat Id"],
    "content_report_name": body["Content Report Name"],
    "content_report_task_id": body["Content Report Type"],
    "content_id": body["Content Id"],
    "content_type": body["Content Type"],
    "content_report_type": body.hasOwnProperty("Content Report Type") ? body["Content Report Type"] : "",
    "content_report_type_id": body.hasOwnProperty("Content Report Type Id") ? req.body["Content Report Type Id"] : "",
    "content_report_owner_id": body.hasOwnProperty("Content Report Owner Id") ? req.body["Content Report Owner Id"] : "",
    "content_report_page_id": body.hasOwnProperty("Content Report Page Id") ? req.body["Content Report Page Id"] : "",
    "content_report_reporter_id": body.hasOwnProperty("Content Report Reporter Id") ? req.body["Content Report Reporter Id"] : userId,
    "content_report_timestamp": body.hasOwnProperty("Content Report Timestamp") ? req.body["Content Report Timestamp"] : new Date().getTime(),
    "content_report_reason": body.hasOwnProperty("Content Report Reason") ? req.body["Content Report Reason"] : "",
    "content_report_autotakedown": contentReportCategorydetail.content_report_cat_autotakedown
  }
  contentReport.create(data)
    .then(data => {
      audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'content_report', data.content_report_id, data.dataValues);
      let update_autotakedown = {};
      update_autotakedown["is_autotakedown"] = 1;

      if (contentReportCategorydetail.content_report_cat_autotakedown == 1) {
        updateContentReportAutoTakeDown(body["Content Report Type"], body["Content Report Type Id"], update_autotakedown);
      } else if (contentReportCategorydetail.content_report_cat_autotakedown == 0 && contentReportCategorydetail.content_report_cat_usr_hide == 1) {
        const contentUserData = {
          "content_report_uid": body.hasOwnProperty("Content Report Reporter Id") ? req.body["Content Report Reporter Id"] : userId,
          "content_report_cat_id": body["Content Report Cat Id"],
          "content_report_id": data.content_report_id,
          "content_report_type": body.hasOwnProperty("Content Report Type") ? req.body["Content Report Type"] : "",
          "content_report_type_id": body.hasOwnProperty("Content Report Type Id") ? req.body["Content Report Type Id"] : "",
          "cru_status": "1"
        }
        contentReportUser.create(contentUserData)
          .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'content_report_user', data.content_report_user_id, data.dataValues);
          })
          .catch(err => {
            logger.log("error", "Some error occurred while inserting data in content report user=" + err);
          });
      }
      res.status(201).send({
        msg: "Content Report Submitted Successfully",
        content_report_id: data.content_report_id
      });
    })
    .catch(err => {
      logger.log("error", "Some error occurred while submitting the content report=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while submitting the content report."
      });
    });
}

/**
 * Function to update autotakedown column 
 * @param  {string}  contentReportType
 * @param  {string}  contentReportTypeId
 * @param  {interger}  update_autotakedown
 * @return {void}
 */
function updateContentReportAutoTakeDown(contentReportType, contentReportTypeId, update_autotakedown) {
  var contentreportTypes = common.contentReportTypes();
  for (const contentReportDataIndex in contentreportTypes) {
    for (const contentReportData in contentreportTypes[contentReportDataIndex]) {
      let whereData = {};
      whereData[contentreportTypes[contentReportDataIndex][contentReportData]['id']] = contentReportTypeId;
      const dbName = contentreportTypes[contentReportDataIndex][contentReportData]['db'];
      var contentReportNewType = contentReportType.replace(/ /g, "_");
      if (contentReportNewType == contentReportDataIndex) {
        dbName.update(update_autotakedown, {
          where: whereData
        });
      }
    }
    
  }
}

/**
 * Function to get all content reports
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.contentReportListing = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 100);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy || 'content_report_id'
  const sortOrder = req.query.sortOrder || 'DESC';

  var options = {
    include: [
      {
        model: contentReportModerate,
        required: false
      },
      {
        model: db.page_location,
        attributes: ['page_id', 'page_name'],
        required: false
      }
    ],
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
        content_report_name: {
          [Op.iLike]: `%${sortValue}%`
        }
      }
      ]
    } : null;
  }
  if (req.query.contentReportCatID) {
    options['where'] = {
      content_report_cat_id: req.query.contentReportCatID
    }
  }
  if (req.query.contentReportCatName) {
    options['where']['content_report_cat_name'] = {
      [Op.iLike]: `%${req.query.contentReportCatName}%`
    };
  }
  var total = await contentReport.count({
    where: options['where']
  });
  const contentreport_list = await contentReport.findAll(options);
  let userIds = [];
  let brandIds = [];
  let campaignIds = [];
  let taskIds = [];
  let contestIds = [];
  let userTaskPostIds = [];
  let commentIds = [];
  let postReportIds = [];
  if (contentreport_list.length) {
    for (const contentreport_data in contentreport_list) {
      if (contentreport_list[contentreport_data].content_report_type == 'User') {
        userIds.push(contentreport_list[contentreport_data].content_report_type_id);
      }
      if (contentreport_list[contentreport_data].content_report_type == 'Brand') {
        brandIds.push(contentreport_list[contentreport_data].content_report_type_id);
      }
      if (contentreport_list[contentreport_data].content_report_type == 'Campaign') {
        campaignIds.push(contentreport_list[contentreport_data].content_report_type_id);
      }
      if (contentreport_list[contentreport_data].content_report_type == 'Task') {
        taskIds.push(contentreport_list[contentreport_data].content_report_type_id);
      }
      if (contentreport_list[contentreport_data].content_report_type == 'Contest') {
        contestIds.push(contentreport_list[contentreport_data].content_report_type_id);
      }
      if (contentreport_list[contentreport_data].content_report_type == 'User Task Post') {
        userTaskPostIds.push(contentreport_list[contentreport_data].content_report_type_id);
      }
      if (contentreport_list[contentreport_data].content_report_type == 'Comment') {
        commentIds.push(contentreport_list[contentreport_data].content_report_type_id);
      }
      if (contentreport_list[contentreport_data].content_report_type == 'Post Report') {
        postReportIds.push(contentreport_list[contentreport_data].content_report_type_id);
      }
    }
  }
  var contentData = {};
  if (userIds.length) {
    var userOptions = {
      attributes: ['u_id', 'u_email', 'u_login'],
      where: { u_id: userIds }
    }
    const userList = await db.users.findAll(userOptions);
    for (const userDetail in userList) {
      contentData['user_' + userList[userDetail].u_id] = userList[userDetail];
    }
  }
  if (brandIds.length) {
    var brandOptions = {
      attributes: ['cr_co_id', 'cr_co_name'],
      where: { cr_co_id: brandIds }
    }
    const brandList = await db.brands.findAll(brandOptions);
    for (const brandDetail in brandList) {
      contentData['brand_' + brandList[brandDetail].cr_co_id] = brandList[brandDetail];
    }
  }
  if (commentIds.length) {
    var commentOptions = {
      attributes: ['pc_post_id', 'pc_comments'],
      where: { pc_post_id: commentIds }
    }
    const commentList = await db.post_comment.findAll(commentOptions);
    for (const commentDetail in commentList) {
      contentData['comment_' + commentList[commentDetail].pc_post_id] = commentList[commentDetail];
    }
  }
  if (postReportIds.length) {
    var postReportOptions = {
      attributes: ['pr_id', 'pr_report'],
      where: { pr_id: postReportIds }
    }
    const postReportList = await db.post_report.findAll(postReportOptions);
    for (const postReportDetail in postReportList) {
      contentData['postreport_' + postReportList[postReportDetail].pr_id] = postReportList[postReportDetail];
    }
  }
  if (contestIds.length) {
    var contestOptions = {
      attributes: ['ct_id', 'ct_name'],
      where: { ct_id: contestIds }
    }
    const contestList = await db.contest_task.findAll(contestOptions);
    for (const contestDetail in contestList) {
      contentData['contest_' + contestList[contestDetail].ct_id] = contestList[contestDetail];
    }
  }
  if (userTaskPostIds.length) {
    var userTaskPostOptions = {
      attributes: ['ucpl_id', 'ucpl_content_data'],
      where: { ucpl_id: userTaskPostIds }
    }
    const userTaskPostList = await db.user_content_post.findAll(userTaskPostOptions);
    for (const userTaskPostDetail in userTaskPostList) {
      contentData['usertaskpost_' + userTaskPostList[userTaskPostDetail].ucpl_id] = userTaskPostList[userTaskPostDetail];
    }
  }
  if (taskIds.length) {
    var taskOptions = {
      attributes: ['ta_task_id', 'ta_name'],
      where: { ta_task_id: taskIds }
    }
    const taskList = await db.tasks.findAll(taskOptions);
    for (const taskDetail in taskList) {
      contentData['task_' + taskList[taskDetail].ta_task_id] = taskList[taskDetail];
    }
  }

  if (campaignIds.length) {
    var campaignOptions = {
      attributes: ['cp_campaign_id', 'cp_campaign_name'],
      where: { cp_campaign_id: campaignIds }
    }
    const campaignList = await db.campaigns.findAll(campaignOptions);
    for (const campaigndetail in campaignList) {
      contentData['campaign_' + campaignList[campaigndetail].cp_campaign_id] = campaignList[campaigndetail];
    }
  }
  //let content_report_data = [];
  for (const contentreport_data in contentreport_list) {
    /* const Content_data = {
      "content_report_id": contentreport_list[contentreport_data].content_report_id,
      "content_report_cat_id": contentreport_list[contentreport_data].content_report_cat_id,
      "content_report_name": contentreport_list[contentreport_data].content_report_name,
      "content_report_type": contentreport_list[contentreport_data].content_report_type,
      "content_report_type_id": contentreport_list[contentreport_data].content_report_type_id,
      "content_report_owner_id": contentreport_list[contentreport_data].content_report_owner_id,
      "content_report_default_autotakedown": contentreport_list[contentreport_data].content_report_autotakedown
    };
    if (contentreport_list[contentreport_data].content_report_moderate != undefined) {
      Content_data['content_report_moderate_detail'] = contentreport_list[contentreport_data].content_report_moderate;
    } */
    const contentReportType = ['Brand', 'Campaign', 'User', 'Task', 'User Task Post', 'Contest', 'Post Report', 'Comment'];
    var contentType = '';
    contentReportType.forEach(element => {
      contentType = element.replace(/\s/g, '').toLowerCase();
      if (contentData[contentType + '_' + contentreport_list[contentreport_data].content_report_type_id] != undefined) {
        contentreport_list[contentreport_data].dataValues.content_detail =  contentData[contentType + '_' + contentreport_list[contentreport_data].content_report_type_id];
      }

    });
    //content_report_data.push(Content_data);
  }
  res.status(200).send({
    data: contentreport_list,
    totalRecords: total
  });
};


/**
* Function to take action for content report
* @param  {object}  req expressJs request object
* @param  {object}  res expressJs response object
* @return {Promise}
*/
exports.contentReportAction = async (req, res) => {
  const body = req.body;
  if (!body["Content Report Id"]) {
    res.status(400).send({
      msg:
        "Content Report Id is required"
    });
    return;
  }
  if (!body["Content Report Autotakedown"] && !body["Content Report Hide From User"]) {
    res.status(400).send({
      msg:
        "Content Report Autotakedown or Content Report Hide From User is required"
    });
    return;
  }
  var options = {
    where: {
      content_report_id: body["Content Report Id"]
    }
  };
  const contentReportdetail = await contentReport.findOne(options);
  if (!contentReportdetail) {
    res.status(500).send({
      message: "Content Report not Found."
    });
    return;
  }
  var contentUserModerateoptions = {
    where: {
      content_report_id: contentReportdetail.content_report_id
    }
  };
  const contentReportModeratedetail = await contentReportModerate.findOne(contentUserModerateoptions);
  const data = {
    "content_report_id": body["Content Report Id"],
    "content_report_autotakedown": body.hasOwnProperty("Content Report Autotakedown") ? body["Content Report Autotakedown"] : null,
    "content_report_hide_from_user": body.hasOwnProperty("Content Report Hide From User") ? body["Content Report Hide From User"] : null,
    "crm_desc": body.hasOwnProperty("Content Report Desc") ? body["Content Report Desc"] : ""
  }
  if (!contentReportModeratedetail) {
    contentReportModerate.create(data)
      .then(data => {
        audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'content_report_moderate', data.crm_id, data.dataValues);
      })
      .catch(err => {
        logger.log("error", "Some error occurred while taking action for content report=" + err);
        res.status(500).send({
          message:
            err.message || "Some error occurred while taking action for content report."
        });
      });
  } else {
    if (!body["Content Report Autotakedown"]) {
      data['content_report_autotakedown'] = contentReportModeratedetail.content_report_autotakedown;
    }
    if (!body["Content Report Hide From User"]) {
      data['content_report_hide_from_user'] = contentReportModeratedetail.content_report_hide_from_user;
    }
    contentReportModerate.update(data, {
      where: {
        content_report_id: contentReportModeratedetail.content_report_id
      }
    });
  }
  let update_autotakedown = {};
  if (body.hasOwnProperty("Content Report Autotakedown") && body["Content Report Autotakedown"] == 1) {
    update_autotakedown["is_autotakedown"] = 1;
  } else if (body.hasOwnProperty("Content Report Autotakedown") && body["Content Report Autotakedown"] == 0) {
    update_autotakedown["is_autotakedown"] = 0;
  }
  if (update_autotakedown["is_autotakedown"] != undefined) {
    updateContentReportAutoTakeDown(contentReportdetail.content_report_type, contentReportdetail.content_report_type_id, update_autotakedown);
  }

  var contentUseroptions = {
    where: {
      content_report_id: contentReportdetail.content_report_id,
      cru_status: 1,
    }
  };
  const contentReportUserdetail = await contentReportUser.findOne(contentUseroptions);

  if (body.hasOwnProperty("Content Report Hide From User") && body["Content Report Hide From User"] == "0" && contentReportUserdetail != null && contentReportUserdetail.content_report_user_id != undefined) {
    contentReportUser.update({ cru_status: "0" }, {
      where: {
        content_report_id: contentReportdetail.content_report_id
      }
    });
  }
  if ((!body.hasOwnProperty("Content Report Autotakedown") || body["Content Report Autotakedown"] == 0) && body["Content Report Hide From User"] == 1) {
    const contentUserData = {
      "content_report_uid": contentReportdetail.content_report_reporter_id,
      "content_report_cat_id": contentReportdetail.content_report_cat_id,
      "content_report_id": contentReportdetail.content_report_id,
      "content_report_type": contentReportdetail.content_report_type,
      "content_report_type_id": contentReportdetail.content_report_type_id,
      "cru_status": "1"
    }
    if (!contentReportUserdetail) {
      contentReportUser.create(contentUserData)
        .then(reportData => {
          audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'content_report_user', reportData.content_report_user_id, reportData.dataValues);
        })
        .catch(err => {
          logger.log("error", "Some error occurred while inserting data in content report user=" + err);
        });
    } else {
      contentReportUser.update(contentUserData, {
        where: {
          content_report_id: contentReportdetail.content_report_id
        }
      });
    }
  }
  res.status(200).send({
    message: "Content Report Action updated successfully."
  });
  return;
}