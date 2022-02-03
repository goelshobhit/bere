const db = require("../models");
const Brand = db.brands;
const userLevelTaskAction = db.user_level_task_action;
const userShippingAddress = db.user_shipping_address;
const shippingConfirmation = db.shipping_confirmation;
const levelTask = db.level_task;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const { isNull } = require("util");
const Op = db.Sequelize.Op;

/**
 * Function to add task level
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.postTaskLevel = async (req, res) => {
    const body = req.body;
    if (!req.body["Task Level"]) {
        res.status(400).send({
            msg:
                "Task Level is required"
        });
        return;
    }
    const levelTaskData = {
        "brand_id": body.hasOwnProperty("Brand Id") ? req.body["Brand Id"] : 0,
        "task_id": body.hasOwnProperty("Task Id") ? req.body["Task Id"] : 0,
        "task_level": body.hasOwnProperty("Task Level") ? req.body["Task Level"] : "",
        "task_details": body.hasOwnProperty("Task Details") ? req.body["Task Details"] : "",
        "task_price": body.hasOwnProperty("Task Price") ? req.body["Task Price"] : ""
    }
    levelTask.create(levelTaskData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'task_level', data.level_task_id, data.dataValues);
            res.status(201).send({
                msg: "Level Task Added Successfully",
                levelTaskID: data.level_task_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while creating the level task=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the level task."
            });
        });
}

/**
 * Function to update task level
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateTaskLevel = async (req, res) => {
    const body = req.body;
    if (!req.body["Task Level"]) {
        res.status(400).send({
            msg:
                "Task Level is required"
        });
        return;
    }
    const id = req.params.levelTaskID;
    var levelTaskDetails = await levelTask.findOne({
        where: {
            level_task_id: id
        }
    });
    
    const levelTaskData = {
        "brand_id": body.hasOwnProperty("Brand Id") ? req.body["Brand Id"] : 0,
        "task_id": body.hasOwnProperty("Task Id") ? req.body["Task Id"] : 0,
        "task_level": body.hasOwnProperty("Task Level") ? req.body["Task Level"] : "",
        "task_details": body.hasOwnProperty("Task Details") ? req.body["Task Details"] : "",
        "task_price": body.hasOwnProperty("Task Price") ? req.body["Task Price"] : ""
    }
    levelTask.update(levelTaskData, {
        returning: true,
        where: {
            level_task_id: id
        }
    }).then(function ([num, [result]]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'update', 'task_level', id, result.dataValues, levelTaskDetails);
            res.status(200).send({
                message: "Level Task updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Level Task with id=${id}. Maybe Level Task was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err + ":Error updating Level Task with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Level Task with id=" + id
        });
    });
};

/**
 * Function to get all task level listing
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.taskLevelListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'level_task_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    var options = {
        include: [
            {
                model: Brand,
                required: false,
                attributes: [
                    ["cr_co_name", "Brand Name"]
                ],
                where: { is_autotakedown: 0 }
            },
            {
                model: db.tasks,
                required: false,
                attributes: [
                    ["ta_name", "Task Name"]
                ]
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
        var sortValue = req.query.sortVal.trim();
        options.where = sortValue ? {
            [Op.or]: [{
                cr_co_name: {
                    [Op.iLike]: `%${sortValue}%`
                }
            }
            ]
        } : null;
    }
    if (req.query.brandId) {
        options['where']['brand_id'] = req.query.brandId;
    }
    if (req.query.taskId) {
        options['where']['task_id'] = req.query.taskId;
    }
    var total = await levelTask.count({
        where: options['where']
    });
    const level_task_list = await levelTask.findAll(options);
    res.status(200).send({
        data: level_task_list,
        totalRecords: total
    });
}


/**
 * Function to save user action for task level
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.postUserTaskLevelAction = async (req, res) => {
    const body = req.body;
    if (!req.body["Task Id"]) {
        res.status(400).send({
            msg:
                "Task Id is required"
        });
        return;
    }
    if (!req.body["User CTA Action"]) {
        res.status(400).send({
            msg:
                "User CTA Action is required"
        });
        return;
    }
    var UserId = req.header(process.env.UKEY_HEADER || "x-api-key");
    const userLevelTaskData = {
        "task_id": body.hasOwnProperty("Task Id") ? req.body["Task Id"] : 0,
        "task_type": body.hasOwnProperty("Task Type") ? req.body["Task Type"] : 0,
        "user_cta_action": body.hasOwnProperty("User CTA Action") ? req.body["User CTA Action"] : "",
        "user_cta_reasons": body.hasOwnProperty("User CTA Reasons") ? req.body["User CTA Reasons"] : 0,
        "task_user_id": body.hasOwnProperty("Task User Id") ? req.body["Task User Id"] : UserId,
        "time_allowance": body.hasOwnProperty("Time Allowance") ? req.body["Time Allowance"] : 0,
        "timer_countdown_start_time": body.hasOwnProperty("Timer Countdown Start Time") ? req.body["Timer Countdown Start Time"] : '',
        "usr_brandscore_penalty": body.hasOwnProperty("Usr Brandscore Penalty") ? body["Usr Brandscore Penalty"] : 0,
        "task_status": body.hasOwnProperty("Task Status") ? req.body["Task Status"] : 0
    }
    userLevelTaskAction.create(userLevelTaskData)
        .then(data => {
            if (body["Usr Brandscore Penalty"]) {
                db.user_profile.decrement('u_brandscore', { by: body["Usr Brandscore Penalty"], where: { u_id: UserId } });
            }
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'task_level', data.level_task_id, data.dataValues);
            res.status(201).send({
                msg: "Level Task Added Successfully",
                userLevelTaskActionID: data.user_level_task_action_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while creating the level task=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the level task."
            });
        });
}

/**
 * Function to update user task level Action
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateUserTaskLevelAction = async (req, res) => {
    const body = req.body;
    if (!req.body["Task Id"]) {
        res.status(400).send({
            msg:
                "Task Id is required"
        });
        return;
    }
    if (!req.body["User CTA Action"]) {
        res.status(400).send({
            msg:
                "User CTA Action is required"
        });
        return;
    }
    var UserId = req.header(process.env.UKEY_HEADER || "x-api-key");
    const id = req.params.userlevelTaskActionID;
    var userLevelTaskDetails = await userLevelTaskAction.findOne({
        where: {
            user_level_task_action_id: id
        }
    });
    
    const userLevelTaskData = {
        "task_id": body.hasOwnProperty("Task Id") ? req.body["Task Id"] : 0,
        "task_type": body.hasOwnProperty("Task Type") ? req.body["Task Type"] : 0,
        "user_cta_action": body.hasOwnProperty("User CTA Action") ? req.body["User CTA Action"] : "",
        "user_cta_reasons": body.hasOwnProperty("User CTA Reasons") ? req.body["User CTA Reasons"] : 0,
        "task_user_id": body.hasOwnProperty("Task User Id") ? req.body["Task User Id"] : UserId,
        "time_allowance": body.hasOwnProperty("Time Allowance") ? req.body["Time Allowance"] : 0,
        "timer_countdown_start_time": body.hasOwnProperty("Timer Countdown Start Time") ? req.body["Timer Countdown Start Time"] : '',
        "usr_brandscore_penalty": body.hasOwnProperty("Usr Brandscore Penalty") ? body["Usr Brandscore Penalty"] : 0,
        "task_status": body.hasOwnProperty("Task Status") ? req.body["Task Status"] : 0
    }
    userLevelTaskAction.update(userLevelTaskData, {
        returning: true,
        where: {
            user_level_task_action_id: id
        }
    }).then(function ([num, [result]]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'update', 'task_level', id, result.dataValues, userLevelTaskDetails);
            res.status(200).send({
                message: "User Level Task updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update User Level Task with id=${id}. Maybe User Level Task was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err + ":Error updating User Level Task with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating User Level Task with id=" + id
        });
    });
};

/**
 * Function to get all task level submit listing
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.levelTaskSubmitListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'user_level_task_action_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    var options = {
        include: [
            {
                model: db.user_profile,
                attributes: [["u_display_name", "user_name"]],
                required: false,
                where: {
                    is_autotakedown: 0
                }
            },
            {
                model: db.tasks,
                required: false,
                attributes: [
                    ["ta_name", "Task Name"]
                ]
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
        var sortValue = req.query.sortVal.trim();
        options.where = sortValue ? {
            [Op.or]: [{
                cr_co_name: {
                    [Op.iLike]: `%${sortValue}%`
                }
            }
            ]
        } : null;
    }
    if (req.query.userId) {
        options['where']['task_user_id'] = req.query.userId;
    }
    if (req.query.taskId) {
        options['where']['task_id'] = req.query.taskId;
    }
    var total = await userLevelTaskAction.count({
        where: options['where']
    });
    const user_level_listing = await userLevelTaskAction.findAll(options);
    res.status(200).send({
        data: user_level_listing,
        totalRecords: total
    });
}

/**
 * Function to add user shipping address
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.postUserAddress = async (req, res) => {
    const body = req.body;
    if (body['data'] && body['data'].length) {
        var UserId = req.header(process.env.UKEY_HEADER || "x-api-key");
        var userDbAddress = await userShippingAddress.findAll({
            where: {
                usr_id: UserId
            }
        });
        var addressInformation = [];
        var is_default_address = 0;
        var body_data = body['data'];
        for (const addressInfo in body_data) {
            var default_shipping_address = body_data[addressInfo]['Shipping Default Address'] ? body_data[addressInfo]['Shipping Default Address'] : '';
            if (default_shipping_address == 1) {
                is_default_address = 1;
            }
            addressInformation.push({
                "usr_id": UserId,
                "usr_shipping_address": body_data[addressInfo]['Shipping Address'],
                "usr_default_shipping_address": body_data[addressInfo]['Shipping Default Address'] ? body_data[addressInfo]['Shipping Default Address'] : ''
            });
        }
        /* update usr_default_shipping_address = 0 for old records if new request with usr_default_shipping_address =1 is coming for same user */
        if (is_default_address == 1 && userDbAddress) {
            for (const userAddress in userDbAddress) {
                if (userDbAddress[userAddress].usr_default_shipping_address == 1) {
                    userShippingAddress.update({
                        "usr_default_shipping_address": 0,
                        "usr_id": UserId
                    }, {
                        where: {
                            usr_shipping_address_id: userDbAddress[userAddress].usr_shipping_address_id
                        }
                    });
                }
            }
        }
        if (addressInformation.length) {
            userShippingAddress.bulkCreate(addressInformation).then(data => {
                res.status(201).send({
                    msg: "User Addresses added Successfully"
                });
            }).catch(err => {
                logger.log("error", "Some error occurred while saving the addresses=" + err);
                res.status(500).send({
                    msg: "Some error occurred while saving the addresses, May be Shipping Default Address is missing or Invalid Request."
                });
            });
        }
    } else {
        res.status(400).send({
            msg: "Request is Invalid"
        });

    }
}

/**
 * Function to list user addresses
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.userAddressListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'usr_shipping_address_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    var options = {
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if (req.query.sortVal) {
        var sortValue = req.query.sortVal.trim();
        options.where = sortValue ? {
            [Op.or]: [{
                cr_co_name: {
                    [Op.iLike]: `%${sortValue}%`
                }
            }
            ]
        } : null;
    }
    if (req.query.userId) {
        options['where']['usr_id'] = req.query.userId;
    }
    var total = await userShippingAddress.count({
        where: options['where']
    });
    const level_task_list = await userShippingAddress.findAll(options);
    res.status(200).send({
        data: level_task_list,
        totalRecords: total
    });
}

/**
 * Function to delete User Address
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteuserAddress = async (req, res) => {
    const userAddressDetails = await userShippingAddress.findOne({
        where: {
            usr_shipping_address_id: req.params.usrShippingAddressId
        }
    });
    if (!userAddressDetails) {
        res.status(500).send({
            message: "User Address not Found with id=" + req.params.usrShippingAddressId
        });
        return;
    }
    userShippingAddress.destroy({
        where: {
            usr_shipping_address_id: req.params.usrShippingAddressId
        }
    })
        .then(num => {
            res.status(200).send({
                message: "User Address deleted successfully!"
            });
            return;
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User Address with id=" + req.params.usrShippingAddressId
            });
            return;
        });
}

/**
 * Function to delete Level Task
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteLevelTask = async (req, res) => {
    const levelTaskDetails = await levelTask.findOne({
        where: {
            level_task_id: req.params.levelTaskId
        }
    });
    if (!levelTaskDetails) {
        res.status(500).send({
            message: "level Task not Found with id=" + req.params.levelTaskId
        });
        return;
    }
    levelTask.destroy({
        where: {
            level_task_id: req.params.levelTaskId
        }
    })
        .then(num => {
            res.status(200).send({
                message: "level Task deleted successfully!"
            });
            return;
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete level Task with id=" + req.params.levelTaskId
            });
            return;
        });
}

/**
 * Function to add Shipping Confirmation
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.shippingConfirmation = async (req, res) => {
    const body = req.body;
    if (!req.body["Shipping Stage"]) {
        res.status(400).send({
            msg:
                "Shipping Stage is required"
        });
        return;
    }
    var UserId = req.header(process.env.UKEY_HEADER || "x-api-key");
    const shippingConfirmationData = {
        "user_id": UserId,
        "task_id": body.hasOwnProperty("Task Id") ? req.body["Task Id"] : 0,
        "shipping_stage": body.hasOwnProperty("Shipping Stage") ? req.body["Shipping Stage"] : "",
        "shipping_stage_description": body.hasOwnProperty("Shipping Stage Description") ? req.body["Shipping Stage Description"] : "",
        "shipping_stage_description_id": body.hasOwnProperty("Shipping Stage Description Id") ? req.body["Shipping Stage Description Id"] : "",
        "free_text_descripton": body.hasOwnProperty("Free Text Descripton") ? req.body["Free Text Descripton"] : ""
    }
    shippingConfirmation.create(shippingConfirmationData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'task_level', data.sc_id, data.dataValues);
            res.status(201).send({
                msg: "Level Task Added Successfully",
                shippingConfirmationID: data.sc_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while adding shipping confirmation=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while adding shipping confirmation."
            });
        });
}

/**
 * Function to list user addresses
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.shippingConfirmationListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'sc_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    var options = {
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if (req.query.sortVal) {
        var sortValue = req.query.sortVal.trim();
        options.where = sortValue ? {
            [Op.or]: [{
                cr_co_name: {
                    [Op.iLike]: `%${sortValue}%`
                }
            }
            ]
        } : null;
    }
    if (req.query.userId) {
        options['where']['user_id'] = req.query.userId;
    }
    if (req.query.taskId) {
        options['where']['task_id'] = req.query.taskId;
    }
    var total = await shippingConfirmation.count({
        where: options['where']
    });
    const level_task_list = await shippingConfirmation.findAll(options);
    res.status(200).send({
        data: level_task_list,
        totalRecords: total
    });
}

