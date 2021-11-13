const db = require("../models");
const Admin = db.admin_users
const Role = db.admin_roles
const Users = db.users;
const UserFeedback = db.user_feedback
const adminSetting=db.admin_setting;
const Op = db.Sequelize.Op;
const upload = require("../middleware/upload");
const common = require("../common");
const setSaltAndPassword = user => {
    if (user.changed("au_password")) {
        user.au_salt = Admin.generateSalt();
        user.au_password = Admin.encryptPassword(user.au_password, user.au_salt);
    }
};
Admin.beforeCreate(setSaltAndPassword);
Admin.beforeUpdate(setSaltAndPassword);
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new admin user
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNewAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    const body = req.body;
    const data = {
        "au_name": body.hasOwnProperty("User name") ? req.body["User name"] : "",
        "au_email": body.hasOwnProperty("User email") ? req.body["User email"].toLowerCase() : "",
        "au_password": body.hasOwnProperty("User password") ? req.body["User password"] : "",
        "au_salt": Admin.generateSalt(),
        "au_active_status": body.hasOwnProperty("User status") ? req.body["User status"] : 0,
        "ar_role_id": body.hasOwnProperty("User role") ? req.body["User role"] : 0,
        "au_is_deleted": 0
    }
    Admin.create(data)
        .then(data => {
            res.status(201).send({
                msg: "User Added Successfully"
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
}

/**
 * Function to get all User
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.listing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'au_user_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;

    var options = {
        include: [{
            model: db.admin_roles,
            attributes: [
                ["ar_name", "Role Name"]
            ]
        }],
        attributes: ["au_user_id", "au_name", "au_email", "au_active_status", "ar_role_id"],
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if (sortVal && sortBy !== "au_active_status") {
        var sortValue = sortVal.trim();
        options.where = {
            [sortBy]: {
                [Op.iLike]: `%${sortValue}%`
            }
        }
    }
    if (sortVal && sortBy == "au_active_status") {
        var sortValue = sortVal;
        options.where = {
            [sortBy]: sortValue
        }
    }
    var total = await Admin.count({
        where: options['where']
    });
    const users_list = await Admin.findAll(options);
    res.status(200).send({
        data: users_list,
        totalRecords: total
    });
}
/**
 * Function to get User details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.userDetail = async (req, res) => {
    const userID = req.params.userID;
    const User = await Admin.findOne({
        include: [{
            model: db.admin_roles,
            attributes: [
                ["ar_name", "Role Name"]
            ]
        }],
        attributes: ["au_user_id", "au_name", "au_email", "au_active_status", "ar_role_id"],
        where: {
            au_user_id: userID
        }
    });
    if (!User) {
        res.status(500).send({
            message: "User not found"
        });
        return
    }
    res.status(200).send({
        data: User
    })
}
/**
 * Function to get adminSetting
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.adminSetting = async (req, res) => {
    const userID = req.params.userID;
    const User = await adminSetting.findOne({
        where :{    
		   ad_id: 1
        }
    });
    if (!User) {
        res.status(500).send({
            message: "Please Contact to admin"
        });
        return
    }
    res.status(200).send({
        data: User
    })
}
/**
 * Function to update admin setting
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateadminSetting = async (req, res) => {    
    adminSetting.update(req.body, {
        where: {
            ad_id: 1
        }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "Admin setting updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update setting req.body is empty!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating setting with id=" + 1
        });
    });
}
/**
 * Function to update user details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateUser = async (req, res) => {
    const id = req.params.userID;
    if (req.body.password) {
        res.status(500).send({
            message: "Change password not allowed"
        });
        return
    }
    const user = await Admin.findOne({
        where: {
            au_user_id: id
        }
    });
    Admin.update(req.body, {
        where: {
            au_user_id: id
        }
    }).then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "User updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        res.status(500).send({
            message: "Error updating User with id=" + id
        });
    });
}
/**
 * Function to check admin user credentials for login
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.userlogin = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return res.status(422).send({
            message: "email and password required"
        });
    }
    const resultData = await Admin.authenticate(email.toLowerCase());
    if (!resultData) {
        res.status(404).send({
            message: "user does not exists"
        });
        return;
    }
    if (resultData.au_is_deleted == 1) {
        res.status(404).send({
            message: "Your account is deleted by Admin"
        });
        return;
    }
    if (resultData.au_active_status !== 1) {
        res.status(404).send({
            message: "Your account is deactivated by Admin"
        });
        return;
    }
    var user_password = Admin.encryptPassword(password, resultData.au_salt);
    if (user_password != resultData.au_password) {
        res.status(400).send({
            message: "Email or Password is incorrect"
        });
        return;
    }
    const UserDetails = await Admin.findOne({
        include: [{
            model: db.admin_roles,
            attributes: [
                ["ar_name", "Role Name"]
            ]
        }],
        attributes: ["au_user_id", "au_name", "au_email", "ar_role_id"],
        where: {
            au_user_id: resultData.au_user_id
        }
    });
    var access_token = common.genrateToken(resultData.au_user_id);
    res.status(200).send({
        data: UserDetails,
        access_token: access_token
    });
};
/**
 * Function to get all Constants
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise
 */
exports.constantsVariables = async (req, res) => {   
    res.status(200).send({
        taskStatus: common.taskStatusArr(),
        taskTypes: common.taskTypesArr(),
		campaignStatus: common.campaignStatusArr(),
        userRoleActions: common.userroleActions(),
        post_report_questions: common.reportQuestions(),
        reactions_emoji:common.reactionsEmoji(),
        api_version:process.env.CONST_VERSION || 1
    });
}
/**
 * Function to add new user feedbacl to admin
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createUserFeedback = async (req, res) => {    
    const body = req.body;
	if(!req.body["Subject"] || !req.body["Message"]){
		res.status(500).send({
                message:  "Subject or Message required"
            });
	}
    const data = {
        "uf_subject": body.hasOwnProperty("Subject") ? req.body["Subject"] : "",
        "uf_u_id": req.header(process.env.UKEY_HEADER || "x-api-key"),
        "uf_message": body.hasOwnProperty("Message") ? req.body["Message"] : "",
        "is_admin": body.hasOwnProperty("is_admin") ? req.body["is_admin"] : false
    }
    UserFeedback.create(data)
        .then(data => {
            res.status(201).send({
                msg: "Feedback Submitted Successfully"
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Feedback."
            });
        });
}
/**
 * Function to get all User
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.feedbacklisting = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'uf_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;

    /* var options = {
		include: [{
            model: db.user_profile,
            attributes: [
                ["u_display_name"]
            ],
			required:false
        }], 
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if (sortVal) {
        var sortValue = sortVal;
        options.where = {
            [sortBy]: sortValue
        }
    }
   var total = await UserFeedback.count({
        where: options['where']
    });*/
	var data= await db.sequelize
        .query( `
            select
              user_feedback.*,user_profile.u_display_name as username
            from user_feedback 
			left outer join user_profile on user_feedback.uf_u_id = user_profile.u_id
			order by ${sortBy} ${sortOrder}
			limit ${pageSize} offset ${skipCount}
          `
        )
        .then((res) => res[0]);
	var total = await UserFeedback.count();
    res.status(200).send({
        data: data,
		totalRecords:total
    });
    
}