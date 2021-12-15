const db = require("../../models");
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const rewardRequest = db.rewards_request;
const rewardEventRequest = db.rewards_event_request;

/**
 * Function to create Reward Request Id
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.createRewardRequest = async (req, res) => {
  const body = req.body;
  if (!body["Rewards Event Request Id"]) {
    res.status(400).send({
      msg:
        "Rewards Event Request Id is required"
    });
    return;
  }
  if (!body["Rewards Event Id"]) {
    res.status(400).send({
      msg:
        "Rewards Event Id is required"
    });
    return;
  }
  var event_id = body["Rewards Event Id"];
  var uid = req.header(process.env.UKEY_HEADER || "x-api-key");
  const rewardEventRequestDetail = await rewardEventRequest.findOne({
    where: {
      rewards_event_request_id: body["Rewards Event Request Id"],
      rewards_event_id: event_id,
      user_id: uid,
      status: 1
    }
  });
  if (!rewardEventRequestDetail) {
    res.status(500).send({
      message: "Reward Request is invalid for this user."
    });
    return
  }
  const data = {
    "rewards_id": body["Rewards Id"] ? body["Rewards Id"] : "0",
    "rewards_timestamp": body["Rewards Timestamp"] ? body["Rewards Timestamp"] : new Date().getTime(),
    "rewards_user_id": uid,
    "rewards_event_owner_id": body["Rewards Event Owner Id"] ? body["Rewards Event Owner Id"] : "0",
    "rewards_request_token": body["Rewards Request Token"] ? body["Rewards Request Token"] : 0,
    "rewards_request_stars": body["Rewards Request Stars"] ? body["Rewards Request Stars"] : 0,
    "rewards_request_energy": body["Rewards Request Energy"] ? body["Rewards Request Energy"] : 0,
    "rewards_request_coins": body["Rewards Request Coins"] ? body["Rewards Request Coins"] : 0,
    "rewards_request_booster": body["Rewards Request Booster"] ? body["Rewards Request Booster"] : 0,
    "rewards_request_card": body["Rewards Request Card"] ? body["Rewards Request Card"] : 0,
    "rewards_event_id": event_id,
    "rewards_event_type": rewardEventRequestDetail.rewards_event_type,
    "rewards_event_request_id": body["Rewards Event Request Id"]
  }
  rewardRequest.create(data)
    .then(data => {
      audit_log.saveAuditLog(uid, 'add', 'rewards_request', data.rewards_request_id, data.dataValues);
      res.status(201).send({
        RewardsRequestId: data.rewards_request_id,
        message: "Reward Request Created Successfully"
      });
    })
    .catch(err => {
      logger.log("error", "Some error occurred while creating the reward request=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the reward request."
      });
    });
}

/**
 * Function to get Reward Requests
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.rewardRequestlisting = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy || 'rewards_request_id'
  const sortOrder = req.query.sortOrder || 'DESC'

  var options = {
    include: [
      {
        model: db.user_profile,
        attributes: [["u_display_name", "rewards_award_username"]],
        required: false,
        where: {
          is_autotakedown: 0
        }
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
    var sortValue = req.query.sortVal;
    options.where = sortValue ? {
      [sortBy]: `${sortValue}`
    } : null;
  }
  if (req.query.rewardsRequestId) {
    options['where'] = {
      rewards_request_id: req.query.rewardsRequestId
    }
  }
  var total = await rewardRequest.count({
    where: options['where']
  });
  const rewards_request_list = await rewardRequest.findAll(options);
  res.status(200).send({
    data: rewards_request_list,
    totalRecords: total
  });
}
