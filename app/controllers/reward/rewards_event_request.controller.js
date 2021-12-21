const db = require("../../models");
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const rewardEventRequest = db.rewards_event_request;

/**
 * Function to create Reward Request Id
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.createRewardRequestId = async (req, res) => {
  const body = req.body;
  if (!body["Rewards Event Id"]) {
    res.status(400).send({
      msg:
        "Rewards Event Id is required"
    });
    return;
  }
  if (!body["Rewards Event Type"]) {
    res.status(400).send({
      msg:
        "Rewards Event Type is required"
    });
    return;
  }
  var uid = req.header(process.env.UKEY_HEADER || "x-api-key");
  const rewardEventRequestDetail = await rewardEventRequest.findOne({
    where: {
      rewards_event_id: body["Rewards Event Id"],
      user_id: uid,
      status: 1
    }
  });
  if (rewardEventRequestDetail) {
    res.status(201).send({
      rewardsTaskRequestId: rewardEventRequestDetail.rewards_event_request_id
    });
    return;
  }
  const data = {
    "rewards_event_request_id": body["Rewards Event Id"]+"_"+uid+"_"+new Date().getTime(),
    "user_id": uid,
    "rewards_event_id": body["Rewards Event Id"],
    "rewards_event_type": body["Rewards Event Type"],
    "status": 1
  }
  rewardEventRequest.create(data)
    .then(data => {
      audit_log.saveAuditLog(uid, 'add', 'rewards_event_request', data.rewards_event_request_id, data.dataValues);
      res.status(201).send({
        msg: "Reward Request Id Created Successfully",
        rewardsTaskRequestId: data.rewards_event_request_id
      });
    })
    .catch(err => {
      logger.log("error", "Some error occurred while creating the reward request id=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the reward request id."
      });
    });
}
