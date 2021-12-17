const db = require("../models");
const userProfile = db.user_profile;
const energy = db.energy;
const energyAward = db.energy_award;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const Op = db.Sequelize.Op;

/**
 * Function to deduct energy from user when submit task. 
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deductUserEnergylevel = async (req, res) => {
  const body = req.body;
  if (!req.body["Energy TaskId"]) {
    res.status(400).send({
      msg:
        "Energy TaskId is required"
    });
    return;
  }
  var uid = body["Energy UserId"] ? body["Energy UserId"] : req.header(process.env.UKEY_HEADER || "x-api-key");
  var userProfileDetail = await userProfile.findOne({
    where: {
      u_id: uid
    },
    attributes: ["u_energy"]
  });
  if (!userProfileDetail) {
    res.status(400).send({
      msg:
        "Invalid User."
    });
    return;
  }
  var userEnergy = userProfileDetail.u_energy;
  var taskEnergy = body.hasOwnProperty("Energy Deduction") ? req.body["Energy Deduction"] : 1;
  var leftEnergy = parseInt(userEnergy) - parseInt(taskEnergy);
  if (leftEnergy < 0) {
    res.status(400).send({
      msg:
        "User energy is not sufficient to submit task."
    });
    return;
  }

  const data = {
    "energy_userid": uid,
    "energy_deduction": taskEnergy,
    "energy_bal": leftEnergy,
    "energy_award_timestamp": new Date().getTime(),
    "energy_award_future_timestamp": new Date(new Date().setHours(new Date().getHours() + 6)).getTime(),
    "energy_taskid": body.hasOwnProperty("Energy TaskId") ? req.body["Energy TaskId"] : "0",
    "energy_task_completion": "1",
    "energy_task_restriction": "0"
  }
  energy.create(data)
    .then(data => {
      audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'energy', data.energy_id, data.dataValues);
      userProfile.update({ "u_energy": leftEnergy }, {
        where: {
          u_id: uid
        }
      }).catch(err => {
        logger.log("error", err + ": Error occurred while updating the u_energy for user:" + uid);
      });
      res.status(201).send({
        msg: "Energy Added Successfully",
        energyId: data.energy_id
      });
    })
    .catch(err => {
      logger.log("error", "Some error occurred while submiting task for Energy=" + err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while submiting task for Energy."
      });
    });
}

/**
 * Function to add energy level to user after six hours of submit task. 
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.addUserEnergylevel = async (req, res) => {
  var userProfileData = await userProfile.findAll({
    where: {
      u_energy: {
        [Op.lt]: 4
      }
    },
    attributes: ["u_id", "u_energy"]
  });
  if (!userProfileData) {
    res.status(400).send({
      msg:
        "Not Found any Record to Update."
    });
    return;
  }

  const userIds = [];
  const userEnergy = {};
  for (const userProfileDetail in userProfileData) {
    userIds.push(userProfileData[userProfileDetail].u_id);
    userEnergy[userProfileData[userProfileDetail].u_id] = userProfileData[userProfileDetail].u_energy;
  }
  var userEnergyData = await energy.findAll({
    where: {
      energy_userid: userIds
    },
    order: [
      ['energy_id', 'ASC']
    ],
  });
  if (!userEnergyData) {
    res.status(400).send({
      msg:
        "Not Found any Record to Update."
    });
    return;
  }
  var userEnergyNewDetail = {};
  for (const userEnergyDetail in userEnergyData) {
    userEnergyNewDetail[userEnergyData[userEnergyDetail].energy_userid] = userEnergyData[userEnergyDetail];
  }
  var isUpdate = 0;
  for (const userEnergyDBDetail in userEnergyNewDetail) {
    var energy_award_timestamp = userEnergyNewDetail[userEnergyDBDetail].energy_award_timestamp;

    var curentDate = new Date().getTime();
    // var curentDate = '1639676226000';

    var hoursDifference = (Math.abs(curentDate - energy_award_timestamp) / 3600000).toFixed(2);
    if (hoursDifference != 0 && hoursDifference % 6 == '0') {
      isUpdate = 1;
      var userId = userEnergyNewDetail[userEnergyDBDetail].energy_userid;
      userProfile.increment('u_energy', { by: 1, where: { u_id: userId } });
      const energyAwardData = {
        "energy_userid": userId,
        "energy_bal": userEnergy[userId] ? userEnergy[userId] + 1 : 1,
        "energy_prev_bal": userEnergy[userId] ? userEnergy[userId] : 0,
        "energy_credit": 1,
        "energy_timestamp": new Date().getTime()
      }
      energyAward.create(energyAwardData)
        .then(data => {
          audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'energy_award', data.energy_award_id, data.dataValues);
        });
    }
  }
  if (isUpdate == 1) {
    res.status(200).send({
      msg: 'Updated Sucessfully.'
    });
    return;
  } else {
    res.status(200).send({
      msg: 'No Record Found.'
    });
  }
}
