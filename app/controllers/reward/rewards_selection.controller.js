const db = require("../../models");
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const rewardRequest = db.rewards_request;
const users = db.users;
const rewardEventRequest = db.rewards_event_request;
const Op = db.Sequelize.Op;
const reward = require("../../reward");

/**
 * Function to create update online status for user.
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.updateOnlineUser = async (req, res) => {
  var uid = req.header(process.env.UKEY_HEADER || "x-api-key");
  users.update({ "u_heartbeat_timestamp": new Date().getTime() }, {
    where: {
      u_id: uid
    }
  }).then(num => {
    if (num == 1) {
      res.status(200).send({
        message: "User Online Status Updated Successfully."
      });
    } else {
      res.status(400).send({
        message: `Cannot update User Online Status with id=${uid}.`
      });
    }
  }).catch(err => {
    logger.log("error", err + ": Error occurred while updating the u_heartbeat_timestamp for user:" + uid);
  });
}

/**
 * Function to select User to Give Reward
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.rewardUserSelection = async (req, res) => {
  const body = req.body;
  var MS_PER_MINUTE = 60000;
  var minutes = 10 * MS_PER_MINUTE;
  var validOnlineDateTime = new Date().getTime() - minutes;

  var usersOnlineData = await users.findAll({
    where: {
      u_heartbeat_timestamp: {
        [Op.gte]: `${validOnlineDateTime}`
      }
    },
    attributes: ["u_id"]
  });
  if (!usersOnlineData || !usersOnlineData.length) {
    res.status(400).send({
      msg:
        "Not Found any Record to give Award."
    });
    return;
  }
  const userIds = [];
  for (const usersOnlineDetail in usersOnlineData) {
    userIds.push(usersOnlineData[usersOnlineDetail].u_id);
  }
  var uid = userIds[Math.floor(Math.random() * userIds.length)];
  if (!body["Rewards Award Event Type"]) {
    res.status(400).send({
      msg:
        "Rewards Award Event Type is required"
    });
    return;
  }
  if (!body["Rewards Award Event Name"]) {
    res.status(400).send({
      msg:
        "Rewards Award Event Name is required"
    });
    return;
  }
  if (!body["Rewards Award Event Id"]) {
    res.status(400).send({
      msg:
        "Rewards Award Event Id is required"
    });
    return;
  }
  var rewardGivendetail = {
    "budgetPerUser": body["Rewards Award Coins"] ? body["Rewards Award Coins"] : 0,
    "heartPerUser": body["Rewards Award Stars"] ? body["Rewards Award Stars"] : 0,
    "tokenPerUser": body["Rewards Award Token"] ? body["Rewards Award Token"] : 0,
    "energyPerUser": body["Rewards Award Energy"] ? body["Rewards Award Energy"] : 0,
    "boosterPerUser": body["Rewards Award Booster"] ? body["Rewards Award Booster"] : 0,
    "cardPerUser": body["Rewards Award Card"] ? body["Rewards Award Card"] : 0,
    "uid": uid,
    // "rewardName": rewardName ? rewardName : '' ,
    "rewardName": '',
    "reward_request_id": 0,
    "event_id": body["Rewards Award Event Id"],
    "rewards_event_type": body["Rewards Award Event Type"],
  };
  const givenResponse = await reward.giveRewardtoUser(rewardGivendetail);
  if (givenResponse && givenResponse.error_message) {
    res.status(500).send({
      message: givenResponse.error_message
    });
    return;
  } else if (givenResponse && givenResponse.rewards_award_id) {
    res.status(201).send({
      msg: "Reward Given Successfully",
      rewardsAwardId: givenResponse.rewards_award_id
    });
    return;
  }
  const data = {
    "Random_winner_usrid": uid,
    "Random_winner_event_name": body["Rewards Award Event Name"] ? body["Rewards Award Event Name"] : 0,
    "Random_winner_selected": new Date().getTime(),
    "Random_winner_event_id": body["Rewards Award Event Id"] ? body["Rewards Award Event Id"] : "0",
    "Random_winner_admin_id": body["Rewards Admin Id"] ? body["Rewards Admin Id"] : '0',
    "Randon_winner_ack": 1
  }
  // rewardRequest.create(data)
  //   .then(data => {
  //     audit_log.saveAuditLog(uid, 'add', 'rewards_request', data.rewards_request_id, data.dataValues);
  //     res.status(201).send({
  //       RewardsRequestId: data.rewards_request_id,
  //       message: "Reward Request Created Successfully"
  //     });
  //   })
  //   .catch(err => {
  //     logger.log("error", "Some error occurred while creating the reward request=" + err);
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while creating the reward request."
  //     });
  //   });
}
