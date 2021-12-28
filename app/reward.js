require("dotenv").config({
  path: __dirname + "/../../.env"
});


const db = require("./models");
const audit_log = db.audit_log
const Op = db.Sequelize.Op;
const logger = require("./middleware/logger");
const rewardGiven = db.rewards_given;
const Tasks = db.tasks
const Brand = db.brands;
const ledgerTransactions = db.ledger_transactions;
const budgetHistory = db.budget_history;
const User_profile = db.user_profile;
const Contest = db.contest_task;
const rewardBalance = db.rewards_balance;
const rewardCredit = db.rewards_credit;
const common = require("./common");

function Reward() {
  Reward.prototype.giveRewardtoUser = async function (rewardGivendetail) {
    var budgetPerUser = rewardGivendetail.budgetPerUser;
    var heartPerUser = rewardGivendetail.heartPerUser;
    var tokenPerUser = rewardGivendetail.tokenPerUser;
    var energyPerUser = rewardGivendetail.energyPerUser;
    var boosterPerUser = rewardGivendetail.boosterPerUser;
    var cardPerUser = rewardGivendetail.cardPerUser;
    var uid = rewardGivendetail.uid;
    var rewardName = rewardGivendetail.rewardName;
    var reward_request_id = rewardGivendetail.reward_request_id;
    var event_id = rewardGivendetail.event_id;
    var rewards_event_type = rewardGivendetail.rewards_event_type;
    let TaskDetails = {};
    let givenResponse = {};
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
      givenResponse.error_message = "Invalid campaign or Task.";
      return givenResponse;
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
      "rewards_request_id": reward_request_id ? reward_request_id : 0,
      "rewards_award_event_id": event_id,
      "rewards_award_event_type": rewards_event_type,
      "rewards_award_user_id": uid,
      "rewards_award_name": rewardName,
      "rewards_award_token": tokenPerUser,
      "rewards_award_stars": heartPerUser,
      "rewards_award_energy": energyPerUser,
      "rewards_award_coins": budgetPerUser,
      "rewards_award_booster": boosterPerUser,
      "rewards_award_card": cardPerUser
    }
    var rewardsAwardId = '0';
    var errorMessage = '';
    await rewardGiven.create(data)
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
          errorMessage = err + ": Error occurred while ledgerTransactions for :" + uid;
          logger.log("error", err + ": Error occurred while ledgerTransactions for :" + uid);
        });
        common.manageUserAccount(uid, budgetPerUser, heartPerUser, 'credit');
        rewardsAwardId = rewardGivenData.rewards_award_id;
      })
      .catch(err => {
        logger.log("error", "Some error occurred while creating the reward request=" + err);
        errorMessage = err.message || "Some error occurred while give Reward.";
      });
    if (errorMessage) {
      givenResponse.error_message = errorMessage;
    } else if (rewardsAwardId && rewardsAwardId > 0) {
      givenResponse.rewards_award_id = rewardsAwardId;
      return givenResponse;
    }
    return givenResponse;

  }
}

module.exports = new Reward();
