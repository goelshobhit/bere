const db = require("../models");
const watchAdTask = db.watch_ads_task;
const audit_log = db.audit_log;
const common = require("../common");
const logger = require("../middleware/logger");
const { validationResult } = require("express-validator");
/**
 * Function to add new Watch Ads Task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createWatchAdsTask = async (req, res) => {
  const body = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array(),
    });
    return;
  }
  const watchAdsTask = {
    brand_id: body.hasOwnProperty("Brand Id") ? body["Brand Id"] : 0,
    task_name: body.hasOwnProperty("Task Name") ? body["Task Name"] : 0,
    task_url: body.hasOwnProperty("Task Url") ? body["Task Url"] : "",
    task_timestamp: body.hasOwnProperty("Task Timestamp")
      ? body["Task Timestamp"]
      : "",
    task_lenght_secs: body.hasOwnProperty("Task Lenght Secs")
      ? body["Task Lenght Secs"]
      : 0,
    task_status: body.hasOwnProperty("Task Status") ? body["Task Status"] : 0,
    task_public: body.hasOwnProperty("Task Public") ? body["Task Public"] : 0,
    brand_tier: body.hasOwnProperty("Brand Tier") ? body["Brand Tier"] : 0,
    campaign_type: body.hasOwnProperty("Campaign Type")
      ? body["Campaign Type"]
      : 0,
    budget: body.hasOwnProperty("Budget") ? body["Budget"] : 0,
    budget_left: body.hasOwnProperty("Budget Left") ? body["Budget Left"] : 0,
    tokens_given: body.hasOwnProperty("Tokens Given")
      ? body["Tokens Given"]
      : 0,
    stars_given: body.hasOwnProperty("Stars Given") ? body["Stars Given"] : 0,
    tokens_given_value: body.hasOwnProperty("Tokens Given Value")
      ? body["Tokens Given Value"]
      : 0,
    stars_given_value: body.hasOwnProperty("Stars Given Value")
      ? body["Stars Given Value"]
      : 0,
    start_date: body.hasOwnProperty("Start Date")
      ? body["Start Date"]
      : new Date(),
    end_date: body.hasOwnProperty("End Date")
      ? body["End Date"]
      : new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
    video_thumbnail: body.hasOwnProperty("Video Thumbnail")
      ? body["Video Thumbnail"]
      : "",
    audience: body.hasOwnProperty("Audience") ? body["Audience"] : 0,
  };
  watchAdTask
    .create(watchAdsTask)
    .then((data) => {
      audit_log.saveAuditLog(
        req.header(process.env.UKEY_HEADER || "x-api-key"),
        "add",
        "todayTimeStamp",
        data.watch_ads_task_id,
        data.dataValues
      );
      common.jsonTask(data.watch_ads_task_id, "Watch Ad", "add");
      res.status(201).send({
        msg: "Watch Ads Task Created Successfully",
        watchAdsTaskId: data.watch_ads_task_id,
      });
    })
    .catch((err) => {
      logger.log(
        "error",
        "Some error occurred while creating the Watch Ads Task=" + err
      );
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Watch Ads Task.",
      });
    });
};

/**
 * Function to get all Watch Ads Task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.WatchAdsTaskListing = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy || "watch_ads_task_id";
  const sortOrder = req.query.sortOrder || "DESC";

  var options = {
    limit: pageSize,
    offset: skipCount,
    order: [[sortBy, sortOrder]],
    where: {},
  };
  if (req.query.sortVal) {
    var sortValue = req.query.sortVal;
    options.where = sortValue
      ? {
          [sortBy]: `${sortValue}`,
        }
      : null;
  }
  var total = await watchAdTask.count({
    where: options["where"],
  });
  const videoAds_list = await watchAdTask.findAll(options);
  res.status(200).send({
    data: videoAds_list,
    totalRecords: total,
  });
};
/**
 * Function to get single Watch Ads Task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.watchAdsTaskDetails = async (req, res) => {
  const watchAdsTaskId = req.params.watchAdsTaskId;
  var options = {
    include: [
      {
        model: db.brands,
        attributes: [
          ["cr_co_id", "brand_id"],
          ["cr_co_name", "brand_name"],
          ["cr_co_logo_path", "brand_logo"],
          "cr_co_total_token",
          "cr_co_token_spent",
        ],
      },
    ],
    where: {
      watch_ads_task_id: watchAdsTaskId,
    },
  };
  const videoAds = await watchAdTask.findOne(options);
  if (!videoAds) {
    res.status(500).send({
      message: "Watch Ads Task not found",
    });
    return;
  }
  res.status(200).send({
    data: videoAds,
  });
};
/**
 * Function to get single Watch Ads Task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.watchAdsTaskDetailsUsingCrCoId = async (req, res) => {
  const crCoId = req.params.crCoId;
  var options = {
    where: {
      brand_id: crCoId,
    },
  };
  const videoAds = await watchAdTask.findOne(options);
  if (!videoAds) {
    res.status(500).send({
      message: "Watch Ads Task not found",
    });
    return;
  }
  res.status(200).send({
    data: videoAds,
  });
};
/**
 * Function to update single Watch Ads Task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updatewatchAdsTask = async (req, res) => {
  const id = req.params.watchAdsTaskId;
  var watchAdTaskDetails = await watchAdTask.findOne({
    where: {
      watch_ads_task_id: id,
    },
  });
  watchAdTask
    .update(req.body, {
      returning: true,
      where: {
        watch_ads_task_id: id,
      },
    })
    .then(function ([num, [result]]) {
      if (num == 1) {
        audit_log.saveAuditLog(
          req.header(process.env.UKEY_HEADER || "x-api-key"),
          "update",
          "videoAds",
          id,
          result.dataValues,
          watchAdTaskDetails
        );
        res.status(200).send({
          message: "Watch Ads Task updated successfully.",
        });
      } else {
        res.status(400).send({
          message: `Cannot update Watch Ads Task with id=${id}. Maybe Watch Ads Task was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      logger.log("error", err + ":Error updating Watch Ads Task with id=" + id);
      console.log(err);
      res.status(500).send({
        message: "Error updating Watch Ads Task with id=" + id,
      });
    });
};

/**
 * Function to delete Watch Ads Task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deletewatchAdsTask = async (req, res) => {
  const videoAdsDetails = await watchAdTask.findOne({
    where: {
      watch_ads_task_id: req.params.watchAdsTaskId,
    },
  });
  if (!videoAdsDetails) {
    res.status(500).send({
      message:
        "Could not delete Watch Ads Task with id=" + req.params.watchAdsTaskId,
    });
    return;
  }
  watchAdTask
    .destroy({
      where: {
        watch_ads_task_id: req.params.watchAdsTaskId,
      },
    })
    .then((num) => {
      res.status(200).send({
        message: "Watch Ads Task deleted successfully!",
      });
      return;
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Could not delete Watch Ads Task with id=" +
          req.params.watchAdsTaskId,
      });
      return;
    });
};
