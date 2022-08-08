const db = require("../models");
const watchAdsTaskSubmit = db.watch_ads_task_submit;
const User_profile = db.user_profile;
const audit_log = db.audit_log;
const logger = require("../middleware/logger");
const { validationResult } = require("express-validator");
let userKey = process.env.UKEY_HEADER;
/**
 * Function to add new Watch Ads Task Submit
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createWatchAdsTaskSubmit = async (req, res) => {
  const body = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array(),
    });
    return;
  }
  var userid = req.header(userKey || "x-api-key");
  const videoAdsSubmit = {
    u_id: body.hasOwnProperty("User Id") ? body["User Id"] : userid,
    watch_ads_task_id: body.hasOwnProperty("Watch Ads Task Id")
      ? body["Watch Ads Task Id"]
      : 0,
    submit_watch_timestamp: body.hasOwnProperty("Watch Timestamp")
      ? body["Watch Timestamp"]
      : "",
    submit_watch_completion: body.hasOwnProperty("Watch Completion")
      ? body["Watch Completion"]
      : 0,
    submit_timestamp: body.hasOwnProperty("Submit Timestamp")
      ? body["Submit Timestamp"]
      : "",
    submit_reward_ack: body.hasOwnProperty("Reward Ack")
      ? body["Reward Ack"]
      : 0,
  };
  watchAdsTaskSubmit
    .create(videoAdsSubmit)
    .then((data) => {
      audit_log.saveAuditLog(
        req.header(userKey || "x-api-key"),
        "add",
        "todayTimeStamp",
        data.watch_ads_task_submit_id,
        data.dataValues
      );
      res.status(201).send({
        msg: "Watch Ads Task Submit Created Successfully",
        watchAdsTaskSubmitId: data.watch_ads_task_submit_id,
      });
    })
    .catch((err) => {
      logger.log(
        "error",
        "Some error occurred while creating the Watch Ads Task Submit=" + err
      );
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Watch Ads Task Submit.",
      });
    });
};

/**
 * Function to get all Watch Ads Task Submit
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.watchAdsTaskSubmitListing = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy || "watch_ads_task_submit_id";
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
  var total = await watchAdsTaskSubmit.count({
    where: options["where"],
  });
  const videoAdsSubmit_list = await watchAdsTaskSubmit.findAll(options);
  res.status(200).send({
    data: videoAdsSubmit_list,
    totalRecords: total,
  });
};
/**
 * Function to get single Watch Ads Task Submit
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.watchAdsTaskSubmitDetails = async (req, res) => {
  const watchAdsTaskSubmitId = req.params.watchAdsTaskSubmitId;
  var options = {
    where: {
      watch_ads_task_submit_id: watchAdsTaskSubmitId,
    },
  };
  const videoAdsSubmit = await watchAdsTaskSubmit.findOne(options);
  if (!videoAdsSubmit) {
    res.status(500).send({
      message: "Watch Ads Task Submit not found",
    });
    return;
  }
  res.status(200).send({
    data: videoAdsSubmit,
  });
};
/**
 * Function to update single Watch Ads Task Submit
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updatewatchAdsTaskSubmit = async (req, res) => {
  try {
    const id = req.params.watchAdsTaskSubmitId;
    var uid = req.header(process.env.UKEY_HEADER || "x-api-key");
    var watchAdsTaskSubmitDetails = await watchAdsTaskSubmit.findOne({
      where: {
        watch_ads_task_submit_id: id,
      },
    });

    if (!watchAdsTaskSubmitDetails) {
      res.status(500).send({
        message: "Survey tracking record not found.",
      });
      return;
    }

    if (watchAdsTaskSubmitDetails.submit_watch_completion === 1) {
      res.status(500).send({
        message: "The user is not permitted to complete the same video again.",
      });
      return;
    }

    let [num, [result]] = await watchAdsTaskSubmit.update(req.body, {
      returning: true,
      where: {
        watch_ads_task_submit_id: id,
      },
    });
    console.log("Watch Ads Task Submit Details: ", result);

    if (num == 1) {
      audit_log.saveAuditLog(
        req.header(userKey || "x-api-key"),
        "update",
        "videoAdsSubmit",
        id,
        result.dataValues,
        watchAdsTaskSubmitDetails
      );
      await common.manageUserAccount(
        uid,
        0,
        watchAdsTaskSubmitDetails.submit_reward_ack,
        "credit"
      );
      console.log("Successfully updated User account Total stars");
      let userProfile = await User_profile.findOne({
        attributes: ["u_stars"],
        where: { u_id: uid },
      });
      console.log("Existing user stars ", userProfile.u_stars);
      const profileData = {
        u_stars: userProfile.u_stars
          ? parseInt(userProfile.u_stars) +
            parseInt(watchAdsTaskSubmitDetails.submit_reward_ack)
          : watchAdsTaskSubmitDetails.submit_reward_ack,
      };
      await User_profile.update(profileData, {
        where: {
          u_id: uid,
        },
      });
      return res.status(200).send({
        message: "Watch Ads Task Submit updated successfully.",
      });
    } else {
      res.status(400).send({
        message: `Cannot update Watch Ads Task Submit with id=${id}. Maybe Watch Ads Task Submit was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    logger.log(
      "error",
      error.message + ":Error updating Watch Ads Task Submit with id=" + id
    );
    res.status(500).send({
      message: "Error updating Watch Ads Task Submit with id=" + id,
      error: error.message,
    });
  }
};

/**
 * Function to delete Watch Ads Task Submit
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deletewatchAdsTaskSubmit = async (req, res) => {
  const videoAdsDetails = await watchAdsTaskSubmit.findOne({
    where: {
      watch_ads_task_submit_id: req.params.watchAdsTaskSubmitId,
    },
  });
  if (!videoAdsDetails) {
    res.status(500).send({
      message:
        "Could not delete Watch Ads Task Submit with id=" +
        req.params.watchAdsTaskSubmitId,
    });
    return;
  }
  watchAdsTaskSubmit
    .destroy({
      where: {
        watch_ads_task_submit_id: req.params.watchAdsTaskSubmitId,
      },
    })
    .then((num) => {
      res.status(200).send({
        message: "Watch Ads Task Submit deleted successfully!",
      });
      return;
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Could not delete Watch Ads Task Submit with id=" +
          req.params.watchAdsTaskSubmitId,
      });
      return;
    });
};
