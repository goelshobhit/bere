const db = require("../../models");
const rewardGiven = db.rewards_given;
const rewardRequest = db.rewards_request;
const reward = require("../../reward");

/**
 * Function to give reward to user.
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.giveReward = async (req, res) => {
  const body = req.body;
  if (!body["Rewards Request Id"] && (!body["Rewards Award Event Id"] || !body["Rewards Award Event Type"])) {
    res.status(400).send({
      msg:
        "Either Rewards Request Id is required or Rewards Award Event Id and Rewards Award Event Type is required."
    });
    return;
  }
  if (!body["Rewards Award UserId"]) {
    res.status(400).send({
      msg:
        "Rewards Award UserId is required"
    });
    return;
  }
  var event_id = 0;
  var rewards_event_type = '';
  let rewardRequestDetail = {};
  if (body["Rewards Request Id"]) {
    rewardRequestDetail = await rewardRequest.findOne({
      where: {
        rewards_request_id: body["Rewards Request Id"]
      }
    });
    if (!rewardRequestDetail) {
      res.status(400).send({
        msg: "Invalid Rewards Request Id."
      });
      return;
    }
    event_id = rewardRequestDetail.rewards_event_id;
    rewards_event_type = rewardRequestDetail.rewards_event_type;
  } else {
    event_id = body["Rewards Award Event Id"];
    rewards_event_type = body["Rewards Award Event Type"];
  }

  var rewardName = body["Rewards Award Name"] ? body["Rewards Award Name"] : '';
  var uid = body["Rewards Award UserId"];
  var reward_request_id = body["Rewards Request Id"] ? body["Rewards Request Id"] : 0;

  var budgetPerUser = body["Rewards Award Coins"] ? body["Rewards Award Coins"] : (rewardRequestDetail.rewards_request_coins ? rewardRequestDetail.rewards_request_coins : 0);
  var heartPerUser = body["Rewards Award Stars"] ? body["Rewards Award Stars"] : (rewardRequestDetail.rewards_request_stars ? rewardRequestDetail.rewards_request_stars : 0);
  var tokenPerUser = body["Rewards Award Token"] ? body["Rewards Award Token"] : (rewardRequestDetail.rewards_request_token ? rewardRequestDetail.rewards_request_token : 0);
  var energyPerUser = body["Rewards Award Energy"] ? body["Rewards Award Energy"] : (rewardRequestDetail.rewards_request_energy ? rewardRequestDetail.rewards_request_energy : 0);
  var boosterPerUser = body["Rewards Award Booster"] ? body["Rewards Award Booster"] : (rewardRequestDetail.rewards_request_booster ? rewardRequestDetail.rewards_request_booster : 0);
  var cardPerUser = body["Rewards Award Card"] ? body["Rewards Award Card"] : (rewardRequestDetail.rewards_request_card ? rewardRequestDetail.rewards_request_card : 0);
  var rewardGivendetail = {
    "budgetPerUser": budgetPerUser,
    "heartPerUser": heartPerUser,
    "tokenPerUser": tokenPerUser,
    "energyPerUser": energyPerUser,
    "boosterPerUser": boosterPerUser,
    "cardPerUser": cardPerUser,
    "uid": uid,
    "rewardName": rewardName,
    "reward_request_id": reward_request_id,
    "event_id": event_id,
    "rewards_event_type": rewards_event_type,
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
  }  else {
    res.status(500).send({
      message: "Some error occurred while give the reward."
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
exports.rewardGivenlisting = async (req, res) => {
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
  if (req.query.rewardsAwardId) {
    options['where'] = {
      rewards_award_id: req.query.rewardsAwardId
    }
  }
  var total = await rewardGiven.count({
    where: options['where']
  });
  const rewards_request_list = await rewardGiven.findAll(options);
  res.status(200).send({
    data: rewards_request_list,
    totalRecords: total
  });
}

