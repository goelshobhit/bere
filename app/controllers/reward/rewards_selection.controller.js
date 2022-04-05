const db = require("../../models");
const logger = require("../../middleware/logger");
const users = db.users;
const rewardRandomWinner = db.reward_random_winner;
const Op = db.Sequelize.Op;
const reward = require("../../reward");
const RewardCenterDist = db.reward_center_dist;

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
 * Function to select Random User to Give Reward
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
  if (!body["Rewards Event Type"]) {
    res.status(400).send({
      msg:
        "Rewards Event Type is required."
    });
    return;
  }
  if (!body["Rewards Event Id"]) {
    res.status(400).send({
      msg:
        "Rewards Event Id is required."
    });
    return;
  }
  if (!body["Rewards Center Id"]) {
    res.status(400).send({
      msg:
        "Rewards Center Id is required."
    });
    return;
  }
  /* get records from reward center dist table */
  var rewardCenterDists = await RewardCenterDist.findAll({
    include: [
      {
        model: db.reward_center,
        attributes: [["reward_center_name", "reward_name"]]
      }
    ],
    where: {
      reward_center_id: body["Rewards Center Id"],
      reward_center_dist_status : 1
    }
  });
  if (!rewardCenterDists) {
    res.status(500).send({
      msg: "Invalid Reward Center Id."
    });
    return;
  }
  /* get segment[reward center dist record] for random frequency number. */
  var distFreq = 0;
  var minNumber = 0;
  var maxNumber = 0;

  let minMaxValues = {};
  let rewardCenterDistData = {};
  for (const rewardCenterDist in rewardCenterDists) {
    if (rewardCenterDist == 0) {
      minNumber = 0;
      maxNumber = rewardCenterDists[rewardCenterDist].reward_center_dist_one_freq;
    } else {
      minNumber = maxNumber + 0.01;
      maxNumber += rewardCenterDists[rewardCenterDist].reward_center_dist_one_freq;;
    }
    minMaxValues[rewardCenterDists[rewardCenterDist].reward_center_dist_id] = minNumber + '_' + maxNumber;
    rewardCenterDistData[rewardCenterDists[rewardCenterDist].reward_center_dist_id] = rewardCenterDists[rewardCenterDist];
    distFreq += rewardCenterDists[rewardCenterDist].reward_center_dist_one_freq;
  }

  var min = 0;
  var max = distFreq;
  var randomNubmer = (Math.random() * (max - min) + min).toFixed(2);
  var matchedId = 0;
  for (const minMaxValue in minMaxValues) {
    const minMaxData = minMaxValues[minMaxValue].split("_");
    if (parseFloat(minMaxData[0]) <= parseFloat(randomNubmer) && parseFloat(minMaxData[1]) >= parseFloat(randomNubmer)) {
      matchedId = minMaxValue;
    }
  }
  if (matchedId && rewardCenterDistData[matchedId]) {
    const data = {
      "random_winner_usrid": uid,
      "random_winner_selected": new Date().getTime(),
      "random_winner_reward_id": body["Rewards Center Id"] ? body["Rewards Center Id"] : 0,
      "random_winner_reward_name": rewardCenterDists[0].dataValues.reward_center.dataValues.reward_name,
      "random_winner_event_type": body["Rewards Event Type"] ? body["Rewards Event Type"] : 0,
      "random_winner_event_id": body["Rewards Event Id"] ? body["Rewards Event Id"] : "0",
      "random_winner_admin_id": body["Rewards Admin Id"] ? body["Rewards Admin Id"] : '0',
      "randon_winner_ack": 0
    }
    var randomWinnerId = 0;
    rewardRandomWinner.create(data).then(randomRewarddata => {
      randomWinnerId = randomRewarddata.random_winner_id;
    }).catch(err => {
      logger.log("error", "Some error occurred while give random reward =" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while give random reward."
      });
      return;
    });
    var rewardGivendetail = {
      "budgetPerUser": rewardCenterDistData[matchedId].reward_center_dist_one_coins,
      "heartPerUser": rewardCenterDistData[matchedId].reward_center_dist_one_stars,
      "tokenPerUser": rewardCenterDistData[matchedId].reward_center_dist_one_total_token,
      "energyPerUser": 0,
      "boosterPerUser": rewardCenterDistData[matchedId].reward_center_dist_one_booster,
      "cardPerUser": 0,
      "uid": uid,
      "rewardName": rewardCenterDistData[matchedId].dataValues.reward_center.dataValues.reward_name,
      "reward_request_id": 0,
      "event_id": body["Rewards Event Id"],
      "rewards_event_type": body["Rewards Event Type"],
      "reward_center_id": body["Rewards Center Id"]
    };
    const givenResponse = await reward.giveRewardtoUser(rewardGivendetail);
    if (givenResponse && givenResponse.error_message) {
      res.status(500).send({
        message: givenResponse.error_message
      });
      return;
    } else if (givenResponse && givenResponse.rewards_award_id) {
      rewardRandomWinner.update({ "randon_winner_ack": 1 }, {
        where: {
          random_winner_id: randomWinnerId
        }
      }).then(num => {
        if (num == 1) {
          res.status(201).send({
            message: "Random Reward Given Successfully."
          });
          return;
        } else {
          res.status(400).send({
            message: "Error occurred while giving Random Reward To User"
          });
          return;
        }
      }).catch(err => {
        logger.log("error", err + ": Error occurred while updating the u_heartbeat_timestamp for user:" + uid);
      });
      res.status(201).send({
        msg: "Random Reward Given Successfully",
        rewardsAwardId: givenResponse.rewards_award_id
      });
      return;
    }
  } else {
    res.status(500).send({
      msg: "Random Reward Not Found."
    });
    return;
  }


}

/**
 * Function to get Reward Given listing
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.rewardRandomUserslisting = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy || 'random_winner_id'
  const sortOrder = req.query.sortOrder || 'DESC'

  var options = {
    include: [
      {
        model: db.user_profile,
        attributes: [["u_display_name", "rewarded_username"]],
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
  if (req.query.randomWinnerId) {
    options['where'] = {
      random_winner_id: req.query.randomWinnerId
    }
  }
  var total = await rewardRandomWinner.count({
    where: options['where']
  });
  const rewardsRandomUserList = await rewardRandomWinner.findAll(options);
  res.status(200).send({
    data: rewardsRandomUserList,
    totalRecords: total
  });
}
