const db = require("../models");
const Admin = db.admin_users
const Role = db.admin_roles
const Op = db.Sequelize.Op;
const upload = require("../middleware/upload");
/**
 * Function to add new admin Role
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNewRole = async (req, res) => {
    const body = req.body;
    const Rolename = req.body["Role name"];
    const Roleaction = req.body["Role actions"];
    if (!Rolename || !Roleaction) {
        res.status(500).send({
            message: "Role name,action required"
        });
        return
    }
    const roleDetails = await Role.findOne({
        where: {
            ar_name: Rolename
        }
    });
    if (roleDetails) {
        res.status(500).send({
            message: "Role already exist"
        });
        return
    }
    const data = {
        "ar_name": Rolename,
        "ar_action": Roleaction,
        "ar_status": body.hasOwnProperty("Role status") ? req.body["Role status"] : 0
    }
    Role.create(data)
        .then(data => {
            res.status(201).send({
                msg: "Role Added Successfully"
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Role."
            });
        });
}

/**
 * Function to get all admin Role
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.listing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'ar_role_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;

    var options = {
        include: [{
            model: db.admin_users,
            attributes: [
                ["au_name", "User Name"]
            ]
        }],
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if (sortVal) {
        var sortValue = sortVal.trim();
        options.where = {
            [sortBy]: {
                [Op.iLike]: `%${sortValue}%`
            }
        }
    }
    var total = await Role.count({
        where: options['where']
    });
    const role_list = await Role.findAll(options);
    res.status(200).send({
        data: role_list,
        totalRecords: total
    });
}
/**
 * Function to get admin Role details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.roleDetail = async (req, res) => {
    const roleID = req.params.roleID;
    const role = await Role.findOne({
        where: {
            ar_role_id: roleID
        }
    });
    if (!role) {
        res.status(500).send({
            message: "role not found"
        });
        return
    }
    res.status(200).send({
        data: role
    })
}
/**
 * Function to update user role details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateRole = async (req, res) => {
    const id = req.params.roleID;
    Role.update(req.body, {
        where: {
            ar_role_id: id
        }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "Role updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Role with id=${id}. Maybe Role was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating Role with id=" + id
        });
    });
}