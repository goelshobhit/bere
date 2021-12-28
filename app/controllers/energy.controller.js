const db = require("../models");
const userProfile = db.user_profile;
const energy = db.energy;
const energyAward = db.energy_award;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const Op = db.Sequelize.Op;
const User_profile = db.user_profile;

/**
 * Function to deduct energy from user when submit task. 
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.submitTask = async (req, res) => {
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

  if (leftEnergy < 0) {
    data['energy_task_completion'] = 0;
    data['energy_task_restriction'] = 1;
    data['energy_award_timestamp'] = '';
    data['energy_award_future_timestamp'] = '';
    data['energy_bal'] = 0;
  }
  energy.create(data)
    .then(data => {
      audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'energy', data.energy_id, data.dataValues);
      if (data['energy_task_completion'] == 1) {
        userProfile.update({ "u_energy": leftEnergy }, {
          where: {
            u_id: uid
          }
        }).catch(err => {
          logger.log("error", err + ": Error occurred while updating the u_energy for user:" + uid);
        });
      }

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
      energy_userid: userIds,
      energy_task_completion: 1
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

/**
 * Function to get all unsubmit task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.unsubmittedTaskListing = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy || 'energy_id'
  const sortOrder = req.query.sortOrder || 'DESC'
  var options = {
    include: [
      {
          model: User_profile,
          attributes: [["u_display_name", "user_name"]],
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
    where: { energy_task_completion: 0 }
  };
  if (req.query.taskId) {
    options['where']['energy_taskid'] = req.query.taskId;
  }
  if (req.query.userId) {
    options['where']['energy_userid'] = req.query.userId;
  }
  if (req.query.sortVal) {
    var sortValue = req.query.sortVal;
    options['where'][sortBy] = `${sortValue}`;
  }
  var total = await energy.count({
    where: options['where']
  });
  const task_list = await energy.findAll(options);
  res.status(200).send({
    data: task_list,
    totalRecords: total
  });
}

/**
 * Function to deduct energy from user when resubmit task. 
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.resubmitTask = async (req, res) => {
  const body = req.body;
  if (!body["Energy Id"]) {
    res.status(400).send({
      msg:
        "Energy Id is required"
    });
    return;
  }
  var energyDetails = await energy.findOne({
    where: {
      energy_id: body["Energy Id"],
      energy_task_completion: 0
    }
  });
  if (!energyDetails) {
    res.status(400).send({
      msg:
        "Invalid Energy Id or Energy Task Submitted Already."
    });
    return;
  }
  var uid = energyDetails.energy_userid;
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
  var taskEnergy = energyDetails.energy_deduction;
  var leftEnergy = parseInt(userEnergy) - parseInt(taskEnergy);

  const data = {
    "energy_userid": uid,
    "energy_deduction": taskEnergy,
    "energy_bal": leftEnergy,
    "energy_award_timestamp": new Date().getTime(),
    "energy_award_future_timestamp": new Date(new Date().setHours(new Date().getHours() + 6)).getTime(),
    "energy_taskid": energyDetails.energy_taskid,
    "energy_task_completion": "1",
    "energy_task_restriction": "0"
  }

  if (leftEnergy < 0) {
    res.status(400).send({
      msg:
        "User energy is not sufficient to submit task."
    });
    return;
  }
  energy.update(data, {
    where: {
      energy_id: body["Energy Id"]
    }
  }).then(num => {
    if (num == 1) {
      userProfile.update({ "u_energy": leftEnergy }, {
        where: {
          u_id: uid
        }
      }).catch(err => {
        logger.log("error", err + ": Error occurred while updating the u_energy for user:" + uid);
      });
      res.status(201).send({
        msg: "Energy Task Submit Successfully"
      });

    } else {
      res.status(500).send({
        message: "EError occurred while updating the energy for energy id=" + body["Energy Id"]
      });
    }
  }).catch(err => {
    res.status(500).send({
      message: "EError occurred while updating the energy for energy id=" + body["Energy Id"]
    });
  });
}
