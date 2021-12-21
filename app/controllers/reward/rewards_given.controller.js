const db = 
require("../../models");
const audit_log = db.audit_log
const logger = require("../../middleware/logger");
const rewardGiven = db.rewards_given;
const Tasks = db.tasks
const Brand = db.brands;
const ledgerTransactions = db.ledger_transactions;
const budgetHistory = db.budget_history;
const User_profile = db.user_profile;
const Contest = db.contest_task;
const rewardBalance = db.rewards_balance;
const rewardCredit = db.rewards_credit;
const common = require("../../common");
const rewardRequest = db.rewards_request;

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


  var uid = body["Rewards Award UserId"];

  var budgetPerUser = body["Rewards Award Coins"] ? body["Rewards Award Coins"] : (rewardRequestDetail.rewards_request_coins ? rewardRequestDetail.rewards_request_coins : 0);
  var heartPerUser = body["Rewards Award Stars"] ? body["Rewards Award Stars"] : (rewardRequestDetail.rewards_request_stars ? rewardRequestDetail.rewards_request_stars : 0);
  var tokenPerUser = body["Rewards Award Token"] ? body["Rewards Award Token"] : (rewardRequestDetail.rewards_request_token ? rewardRequestDetail.rewards_request_token : 0);
  var energyPerUser = body["Rewards Award Energy"] ? body["Rewards Award Energy"] : (rewardRequestDetail.rewards_request_energy ? rewardRequestDetail.rewards_request_energy : 0);
  var boosterPerUser = body["Rewards Award Booster"] ? body["Rewards Award Booster"] : (rewardRequestDetail.rewards_request_booster ? rewardRequestDetail.rewards_request_booster : 0);
  var cardPerUser = body["Rewards Award Card"] ? body["Rewards Award Card"] : (rewardRequestDetail.rewards_request_card ? rewardRequestDetail.rewards_request_card : 0);
  let TaskDetails = {};
  let tj_type = '';
  if (rewards_event_type == 'Task') {
    tj_type = 'Single';
    TaskDetails = await Tasks.findOne({
      include: [{
        model: db.campaigns,
        attributes: ["cr_co_id"]
      }],
      where: {
        ta_task_id: event_id
      },
      attributes: ["ta_name", "ta_total_available", "ta_token_budget", "ta_budget_per_user", "ta_hearts_per_user", "ta_remaining_budget", "ta_task_id"]
    });
  } else if (rewards_event_type == 'Contest') {
    tj_type = 'Contest';
    TaskDetails = await Contest.findOne({
      include: [{
        model: db.campaigns,
        attributes: ["cr_co_id"]
      }],
      where: {
        ct_id: event_id
      },
      attributes: [
        ["ct_name", "ta_name"], ["ct_total_available", "ta_total_available"], ["ct_token_budget", "ta_token_budget"], ["ct_budget_per_user", "ta_budget_per_user"], ["ct_hearts_per_user", "ta_hearts_per_user"], ["ct_id", "ta_task_id"]
      ]
    });
  }
  if (!TaskDetails || !TaskDetails.campaign || !TaskDetails.campaign.cr_co_id) {
    res.status(400).send({
      msg: "Invalid campaign or Task."
    });
    return;
  }
  const BrandDetails = await Brand.findOne({
    where: {
      cr_co_id: TaskDetails.campaign.cr_co_id
    },
    attributes: ["cr_co_alias", "cr_co_name", "cr_co_logo_path", "cr_co_id"]
  });
  const rewardBalanceDetail = await rewardBalance.findOne({
    where: {
      rewards_balance_taskid: event_id,
      rewards_balance_type: rewards_event_type
    },
    order: [
      ['rewards_balance_id', 'DESC']
    ]
  });
  var userProfile = await User_profile.findOne({ attributes: ['u_hearts', 'u_budget'], where: { u_id: uid } });

  const data = {
    "rewards_request_id": body["Rewards Request Id"] ? body["Rewards Request Id"] : 0,
    "rewards_award_event_id": event_id,
    "rewards_award_event_type": rewards_event_type,
    "rewards_award_user_id": body["Rewards Award UserId"] ? body["Rewards Award UserId"] : "0",
    "rewards_award_name": body["Rewards Award Name"] ? body["Rewards Award Name"] : '',
    "rewards_award_token": tokenPerUser,
    "rewards_award_stars": heartPerUser,
    "rewards_award_energy": energyPerUser,
    "rewards_award_coins": budgetPerUser,
    "rewards_award_booster": boosterPerUser,
    "rewards_award_card": cardPerUser
  }
  rewardGiven.create(data)
    .then(rewardGivenData => {
      audit_log.saveAuditLog(uid, 'add', 'rewards_given', rewardGivenData.rewards_award_id, rewardGivenData.dataValues);
      var brandView = {
        id: BrandDetails.cr_co_id,
        name: BrandDetails.cr_co_name,
        logo: BrandDetails.cr_co_logo_path
      };
      const profileData = {
        u_hearts: userProfile.u_hearts ? parseInt(userProfile.u_hearts) + parseInt(heartPerUser) : heartPerUser,
        u_budget: userProfile.u_budget ? parseInt(userProfile.u_budget) + parseInt(budgetPerUser) : budgetPerUser
      };
      User_profile.update(profileData, {
        where: {
          u_id: uid
        }
      }).catch(err => {
        logger.log("error", err + ": Error occurred while updating the u_hearts for user:" + uid);
      });
      var rewardsAwardCoinsBal = 0;
      var rewardsAwardStarBal = 0;
      var rewardsAwardTokenBal = 0;
      if (!rewardBalanceDetail) {
        rewardsAwardCoinsBal = parseInt(TaskDetails.dataValues.ta_total_available) - parseInt(budgetPerUser);
        rewardsAwardStarBal = parseInt(TaskDetails.dataValues.ta_total_available) - parseInt(heartPerUser);
        rewardsAwardTokenBal = parseInt(TaskDetails.dataValues.ta_total_available) - parseInt(tokenPerUser);
      } else {
        rewardsAwardCoinsBal = parseInt(rewardBalanceDetail.rewards_award_coins_bal) - parseInt(budgetPerUser);
        rewardsAwardStarBal = parseInt(rewardBalanceDetail.rewards_award_stars_bal) - parseInt(heartPerUser);
        rewardsAwardTokenBal = parseInt(rewardBalanceDetail.rewards_award_token_bal) - parseInt(tokenPerUser);
      }

      budgetHistory.create({
        u_id: uid,
        ta_task_id: event_id,
        bud_budget: budgetPerUser,
        bud_heart: heartPerUser,
        bud_available: rewardsAwardCoinsBal
      }).catch(err => {
        logger.log("error", err + ": Error occurred while creating the budgetHistory for user:" + uid);
      });

      rewardBalance.create({
        rewards_balance_owner_id: 0,
        rewards_balance_taskid: event_id,
        rewards_balance_type: rewards_event_type,
        rewards_balance_task_name: TaskDetails.dataValues.ta_name,
        rewards_balance: 0,
        rewards_award_token_bal: rewardsAwardTokenBal,
        rewards_award_stars_bal: rewardsAwardStarBal,
        rewards_award_coins_bal: rewardsAwardCoinsBal
      }).catch(err => {
        logger.log("error", err + ": Error occurred while creating the rewardBalance for Task:" + event_id);
      });

      let trData = {
        trx_user_id: uid,
        trx_unique_id: event_id + "-" + uid + "-" + new Date().getTime(),
        trx_type: 1,
        trx_coins: budgetPerUser,
        trx_stars: heartPerUser,
        trx_date_timestamp: new Date().getTime(),
        trx_source: {
          "brand_details": brandView,
          "task_details": TaskDetails.dataValues,
          "task_type": tj_type
        },
        trx_approval_status: 0,
        trx_description: TaskDetails.dataValues.ta_name
      };
      console.log(trData)
      ledgerTransactions.create(trData).then(transData => {
        rewardCredit.create({
          Rewards_credit_user_id: uid,
          Rewards_credit_event_id: event_id,
          rewards_credit_approve_id: 1,
          rewards_credit_approve_timestamp: new Date().getTime(),
          rewards_credit_transaction_id: transData.trx_id,
          rewards_credit_transaction_ack: 1
        }).catch(err => {
          logger.log("error", err + ": Error occurred while inserting in rewardCredit:" + event_id);
        });
      }).catch(err => {
        logger.log("error", err + ": Error occurred while ledgerTransactions for :" + uid);
      });
      common.manageUserAccount(uid, budgetPerUser, heartPerUser, 'credit');
      res.status(201).send({
        msg: "Reward Given Successfully",
        rewardsAwardId: rewardGivenData.rewards_award_id
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

