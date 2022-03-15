const db = require("../models");
const Users = db.users;
const crypto = require("crypto");
const User_profile = db.user_profile;
const User_social_ext = db.user_social_ext;
const Posts = db.user_content_post;
const adminSetting=db.admin_setting;
const mail_templates=db.mail_templates;
const accountBalance=db.account_balance;
const ledgerTransactions = db.ledger_transactions;
const mailer = require("../middleware/mailer.js");
const Op = db.Sequelize.Op;
const upload = require("../middleware/upload");
const audit_log = db.audit_log
const common = require("../common");
const logger = require("../middleware/logger");
const userFF=db.user_fan_following;
const Cryptr = require('cryptr');
const cryptr = new Cryptr('socialappAPI');
const { QueryTypes } = require('sequelize');
const setSaltAndPassword = user => {
    if (user.changed("u_pass")) {
        user.u_salt = Users.generateSalt();
        user.u_pass = Users.encryptPassword(user.u_pass, user.u_salt);
    }
};
Users.beforeCreate(setSaltAndPassword);
Users.beforeUpdate(setSaltAndPassword);
/**
 * Function to add new User
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNewUser = async (req, res) => {
    const body = req.body;  
	if (!req.body["User Type"]) {
	res.status(500).send({
	message: "User type required"
	});
	return
	}
	var login_type=req.body["User Type"];
	if(login_type=='Instagram'){
    const UserDetails = await Users.findOne({
        where: {
            u_instagram_id: req.body["Instagram id"]
        },
		attributes:["u_id"]
    });	
    if (UserDetails) {
    const UserD = await Users.findOne({
		include: [{
            model: db.user_profile
        },
		{
            model: db.user_social_ext
        },
		{
			model: db.user_content_post,
            attributes: ['ta_task_id'],
			where:{
				ucpl_status:`1`
			},
            required:false
		}
		],
		attributes:["u_id","u_referer_id","u_acct_type","u_act_sec","u_email","u_active","u_fb_username","u_fb_id","u_gmail_username","u_gmail_id","u_ymail_username","u_ymail_id","u_pref_login","u_instagram_username","u_instagram_id","u_created_at","u_updated_at","u_email_verify_status"],
        where: {
            u_id: UserDetails.u_id
        }
    });		
	res.status(200).send({
		message: "Aleary Registered",
		data: UserD,
		access_token:common.genrateToken(UserDetails.u_id),
		media_token:common.imageToken(UserDetails.u_id)
	});
	return;
    }
	
	}
	if(login_type=='Normal' || login_type=='Gmail'){
    const UserDetails = await Users.findOne({
        where: {
            u_email: req.body["User email"].toLowerCase()
        }
    });
    if (UserDetails) {		
        res.status(200).send({
            message: "Aleary Registered"
		});
        return;
    }
	}
	if(login_type=='Ymail'){
    const UserDetails = await Users.findOne({
        where: {
            u_ymail_id: req.body["Ymail id"]
        }
    });
    if (UserDetails) {		
        res.status(200).send({
            message: "Aleary Registered"
		});
        return;
    }
	}	
	const template = await mail_templates.findOne({
        where: {
            mt_name: 'verify_email'
        }
    });
    
    const UserDetails = await Users.findOne({
        where: {
            u_login: req.body["User login"].toLowerCase()
        }
    });
    if (UserDetails) {		
        res.status(400).send({
            message: "Username Aleary Exist"
		});
        return;
    }
    
    const data = {
		"u_acct_type": body.hasOwnProperty("Account type") ? req.body["Account type"] : 0,
		"u_referer_id": body.hasOwnProperty("Referer id") ? req.body["Referer id"] : 0,
		"u_act_sec": body.hasOwnProperty("User act sec") ? req.body["User act sec"] : 0,
		"u_login": body.hasOwnProperty("User login") ? req.body["User login"].toLowerCase() : "",
		"u_pass": body.hasOwnProperty("User password") ? req.body["User password"] : login_type,
		"u_email": req.body["User email"] ? req.body["User email"].toLowerCase() : "",
		"au_salt": Users.generateSalt(),
		"u_active": body.hasOwnProperty("User status") ? req.body["User status"] : true,
		"u_fb_username": body.hasOwnProperty("User fb name") ? req.body["User fb name"] : "",
		"u_fb_id": body.hasOwnProperty("Fb id") ? req.body["Fb id"] : "",
		"u_gmail_username": body.hasOwnProperty("User gmail name") ? req.body["User gmail name"] : "",
		"u_gmail_id": body.hasOwnProperty("Gmail id") ? req.body["Gmail id"] : "",
		"u_ymail_username": body.hasOwnProperty("User ymail name") ? req.body["User ymail name"] : "",
		"u_ymail_id": body.hasOwnProperty("Ymail id") ? req.body["Ymail id"] : "",
		"u_pref_login": body.hasOwnProperty("User pref login") ? req.body["User pref login"] : 0,
		"u_instagram_username": body.hasOwnProperty("User instagram name") ? req.body["User instagram name"] : "",
		"u_instagram_id": body.hasOwnProperty("Instagram id") ? req.body["Instagram id"] : ""
    }
    Users.create(data)
        .then(data => {
			accountBalance.create({ac_user_id:data.u_id,ac_balance:0,ac_account_no:''});
			User_profile.create({u_id:data.u_id});
            User_social_ext.create({
				use_u_insta_link: body.hasOwnProperty("User instagram name") ? 'https://www.instagram.com/'+req.body["User instagram name"] : "",
				use_u_fb_link: body.hasOwnProperty("User fb name") ? 'https://www.facebook.com/'+req.body["User fb name"] : "",
				show_fb: body.hasOwnProperty("User fb name") ? true : false,
				show_insta: body.hasOwnProperty("User instagram name") ? true : false,
				u_id:data.u_id
			});
            audit_log.saveAuditLog(data.u_id,'add','user_login',data.u_id,data.dataValues);
		if(req.body["User email"]){
		const encryptedID = cryptr.encrypt(data.u_id);
		const vlink=process.env.SITE_API_URL+'users/verify_email/'+encryptedID;
		var templateBody=template.mt_body;
		templateBody=templateBody.replace("[CNAME]", req.body["User email"]);
		templateBody=templateBody.replace("[VLINK]", vlink);
        const message = {
            from: "Socialbrands1@gmail.com",
            to: req.body["User email"],
            subject: template.mt_subject,
            html: templateBody
        };
        mailer.sendMail(message);
		}
            res.status(201).send({			    
                message: "User Added Successfully",
                user_details:data,
				access_token:common.genrateToken(data.u_id),
				media_token:common.imageToken(data.u_id)
            });
        })
        .catch(err => {
			console.log(err)
            res.status(500).send({
				
                message: err.message || "Some error occurred while creating the User."
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
    const pageSize = parseInt(req.query.pageSize || 100);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'u_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;
    var UserId= req.header(process.env.UKEY_HEADER || "x-api-key");
    const contentUserIds = await common.getContentReportUser(['User'], UserId);
    const contentUserIdsValues = contentUserIds.map(function (item) {
        return item.content_report_type_id
      });
    var options = { 
        include: [{
            model: db.user_profile
        },{
		
            model: db.user_content_post,
			attributes: ['ucpl_id'],
            required:false,
			where: {
				ucpl_status:1
			},
        }
		],	
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
		attributes:["u_id","u_referer_id","u_acct_type","u_act_sec","u_email","u_active","u_fb_username","u_fb_id","u_gmail_username","u_gmail_id","u_ymail_username","u_ymail_id","u_pref_login","u_instagram_username","u_instagram_id","u_created_at","u_updated_at","u_email_verify_status"],
        where: {
			u_active:true
		}
    };
    if (sortVal) {
        var sortValue = sortVal.trim();
        options.where = {
            [sortBy]: {
                [Op.iLike]: `%${sortValue}%`
            }
        }
    }
    /* do not get users which are reported by someone */
    if (contentUserIdsValues.length) {
        options['where']['u_id'] = {
                [Op.not]: contentUserIdsValues
            }
    }
    options['where']['is_autotakedown'] = 0;
    var total = await Users.count({
        where: options['where']
    });
    const users_list = await Users.findAll(options);
	/*console.log(users_list.length);
	for(let i=0;i<users_list.length;i++){
		Users.update({u_email:users_list[i]['u_email'].toLowerCase()}, {
			where: {
				u_id:users_list[i]['u_id']
			}
        });
    console.log(users_list[i]['u_email']);		
	}*/
	
    res.status(200).send({
        data: users_list,
        totalRecords: total
    });
}
/**
 * Function to get admin Role details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.userDetail = async (req, res) => {
	const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
    const userID = req.params.userID;
	const Uid=req.header(process.env.UKEY_HEADER || "x-api-key");
    const User = await Users.findOne({
		include: [{
            model: db.user_profile
        },
		{
            model: db.user_social_ext
        },
		{
			model: db.user_content_post,
            attributes: ["ucpl_content_data",['ucpl_id','post_id'],'ta_task_id'],
            required:false,
			where: {
				ucpl_status:1
			},
			limit: pageSize,
			offset: skipCount,
			order: [
			['ucpl_id', "DESC"]
			],
		}
		],
		attributes:["u_id","u_login","u_referer_id","u_acct_type","u_act_sec","u_email","u_active","u_pref_login","u_created_at","u_updated_at","u_email_verify_status",
		[db.sequelize.literal('(SELECT COUNT(*) FROM user_fan_following WHERE user_fan_following.faf_by = user_login.u_id)'), 'total_following'],
		[db.sequelize.literal('(SELECT COUNT(*) FROM user_fan_following WHERE user_fan_following.faf_to = user_login.u_id )'), 'total_fans'],
		[db.sequelize.literal('(SELECT COUNT(*)  FROM user_fan_following WHERE user_fan_following.faf_by = '+Uid+' and user_fan_following.faf_to = user_login.u_id)'), 'followed_by_me'],
		[db.sequelize.literal('(SELECT COUNT(*) FROM user_fan_following WHERE user_fan_following.faf_to = '+Uid+' and user_fan_following.faf_by = user_login.u_id )'), 'following_me'],
		],
        where: {
            u_id: userID,
        }
    });
    if (!User) {
        res.status(500).send({
            message: "User not found"
        });
        return
    }
	if(User && User.u_active!=true){
		res.status(500).send({
            message: "User details not found"
        });
        return
	}
    res.status(200).send({
        user_details: User,
		media_token:common.imageToken(userID)
    })
}
/**
 * Function to update user details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateUser = async (req, res) => {
    const id = parseInt(req.params.userID);
	let updateData=req.body;
	if(req.body["u_email"]){
	const UserDetails = await Users.findOne({
		attributes:['u_id'],
        where: {
            u_email: req.body["u_email"].toLowerCase()
        }
    });
	if(UserDetails && UserDetails.u_id!=id){
		res.status(403).send({
            message: "Email Already Exist"
		});
        return;
	}
		const template = await mail_templates.findOne({
			where: {
				mt_name: 'verify_email'
			}
		});
		Users.update({u_email_verify_status:false,u_email:req.body["u_email"].toLowerCase()}, {
			where: {
				u_id: id
			}
		});
		const encryptedID = cryptr.encrypt(id);
		const vlink=process.env.SITE_API_URL+'users/verify_email/'+encryptedID;
		var templateBody=template.mt_body;
		templateBody=templateBody.replace("[CNAME]", req.body["u_email"].toLowerCase());
		templateBody=templateBody.replace("[VLINK]", vlink);
        const message = {
            from: "Socialbrands1@gmail.com",
            to: req.body["u_email"].toLowerCase(),
            subject: template.mt_subject,
            html: templateBody
        };
        mailer.sendMail(message);
		res.status(200).send({
			u_id:id,
            message: "Email verification Send to email"
		});
        return;
    }
   
	if(req.body['u_active']!==undefined){
		console.log(req.body['u_active']+"U Active")
	updateData = { ...updateData, u_deactive_me: req.header(process.env.UKEY_HEADER || "x-api-key") };
	console.log(updateData)
	const userPosts = await Posts.findAll({
        where: {
            ucpl_u_id: req.header(process.env.UKEY_HEADER || "x-api-key")
        },
		attributes:['ucpl_id','ta_task_id','ucpl_content_type']
    });	
	if(userPosts && userPosts.length>0){
	  for(let i=0;i<userPosts.length;i++){
		await Posts.update({
			ucpl_status: req.body['u_active']==true ? 1 : 0
		},
		{
			where : {
				ucpl_id:userPosts[i].ucpl_id
			}
		});
		const jType=  userPosts[i].ucpl_content_type && userPosts[i].ucpl_content_type===2 ? 'Contest' : 'Single';
	    common.jsonTask(userPosts[i].ta_task_id,jType,'update');
	  }
	}
    }
	if(req.body.u_login){
	const UserDetails = await Users.findOne({
        where: {
            u_login: req.body.u_login.toLowerCase()
        }
    });	
    
	const Userprofile = await User_profile.findOne({
        where: {
            u_display_name: req.body.u_login
        },
		attributes:["u_id"]
    });
    if ((UserDetails && UserDetails.u_id!==id) || (Userprofile && Userprofile.u_id!==id) ) {
        res.status(200).send({
            message: "Already Exist"
		});
        return;
    }
	}
	if(!id){
		res.status(404).send({
            message: "User with id not found"
        });
		return;
	}
	if(req.body.u_pass){
		res.status(500).send({
            message: "User password can not be updated"
        });
		return;
    }
    const UserDetails = await Users.findOne({
        where: {
            u_id: id
        }
    });	
	
    Users.update(updateData, {
        returning: true,
        where: {
            u_id: id
        }
    }).then(function([ num, [result] ]){
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','user_login',id,result.dataValues,UserDetails);
			User_profile.update({u_display_name:result.dataValues.u_login}, {
			where: {
			u_id: id
			}
			});
            res.status(200).send({
                message: "User updated successfully."
            });
        } else {
            logger.log("error", `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`);
            res.status(400).send({
                message: `Cannot update Role with id=${id}. Maybe User was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":updating User with id=" + id);
        res.status(500).send({
            message: err+" Error updating User with id=" + id
        });
		return;
    });
}
/**
 * Function to update user profile details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateUserProfile = async (req, res) => {
    const id = parseInt(req.params.userID);
    
	if(!id){
		res.status(404).send({
            message: "User with id not found"
        });
		return;
    }
	if(req.body.u_display_name){
	const UserDetails = await Users.findOne({
        where: {
            u_login: req.body.u_display_name
        },
		attributes:["u_id"]
    });
	const Userprofile = await User_profile.findOne({
        where: {
            u_display_name: req.body.u_display_name
        },
		attributes:["u_id"]
    });
    if ((UserDetails && UserDetails.u_id!==id) || (Userprofile && Userprofile.u_id!==id) ) {		
       res.status(200).send({
          message: "username already Exist"
		});
        return;
    }else{
		Users.update({u_login:req.body.u_display_name}, {
		where: {
			u_id: id
			}
		});
	 }
	}
	// update mobile number 
	if(req.body.u_phone){
		const UserDetails = await User_profile.findOne({
			attributes:["u_id"],
			where: {
				u_phone: req.body["u_phone"]
			}
		});	
		if(UserDetails && UserDetails.u_id!=id) {		
			res.status(404).send({
				message: "phone Already Exist"
			});
			return;
		}
   var otp=Math.floor(100000 + Math.random() * 900000);
   var sms=common.sendSMS(req.body["u_phone"], "OTP for Social App is "+otp);
	var data={
		u_phone:req.body["u_phone"],
		phone_otp:otp
	};
	User_profile.update(data, {
        where: {
            u_id: id
        }
    });
	
	}
    const UserDetails = await User_profile.findOne({
        where: {
            u_id: id
        }
    });	
    User_profile.update(req.body, {
        returning: true,
        where: {
            u_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','user_profile',id,result.dataValues,UserDetails);
			Users.findOne({
			include: [{
			model: db.user_profile
			},
			{
			model: db.user_social_ext
			}
			],
			attributes:["u_id","u_referer_id","u_acct_type","u_act_sec","u_email","u_active","u_fb_username","u_fb_id","u_gmail_username","u_gmail_id","u_ymail_username","u_ymail_id","u_pref_login","u_instagram_username","u_instagram_id","u_created_at","u_updated_at","u_email_verify_status"],
			where: {
			u_id: id
			}
			}).then(userData => {
				return res.status(200).send({
                message: "User details updated successfully.",
				data:userData,
				access_token:common.genrateToken(id),
				media_token:common.imageToken(id),
				otp:otp ? otp : null
                });
			});            
        } else {
            res.status(400).send({
                message: `Cannot update Users with id=${id}. Maybe User was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":updating User profile with id=" + id);
        res.status(500).send({
            message: "Error updating User with id=" + id
        });
		return;
    });
	
}
/**
 * Function to update user social ext
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateUsersocialExt = async (req, res) => {
    const id = req.params.userID;
	if(!id){
		res.status(404).send({
            message: "User with id not found"
        });
		return;
    }
    const UserDetails = await User_social_ext.findOne({
        where: {
            u_id: id
        }
    });	
    User_social_ext.update(req.body, {
        returning: true,
        where: {
            u_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','user_social_ext',id,result.dataValues,UserDetails);
          
            res.status(200).send({
                message: "User social ext details updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Users with id=${id}. Maybe User social ext was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":updating User social profile with id=" + id);
        res.status(500).send({
            message: err+"Error updating User social ext with id=" + id
        });
		return;
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
        username,
        password,
		login_type
    } = req.body;
	if(!login_type ||  !username) {
        return res.status(422).send({
            message: "Login details are required"
        });
    }
	var uID=0;
	switch(login_type) {
case "Normal":
	if (!username || !password) {
        return res.status(422).send({
            message: "email and password required"
        });
    }
    const resultData = await Users.authenticate(username.toLowerCase(),'u_email');
    if (!resultData) {
        res.status(404).send({
            message: "user does not exists"
        });
        return;
    }
    if(resultData.u_active !== true && resultData.u_deactive_me!==resultData.u_id) {
        res.status(404).send({
            message: "Your account is deactivated by Admin"
        });
        return;
    }
    var user_password = Users.encryptPassword(password, resultData.u_salt);
    if (user_password != resultData.u_pass) {
        res.status(400).send({
            message: "Email or Password is incorrect"
        });
        return;
    }
	uID=resultData.u_id;
	break;
case "Fb":
	const resultFB = await Users.authenticate(username,'u_fb_id');
    if (!resultFB) {
        res.status(404).send({
            message: "user does not exists"
        });
        return;
    }
    if(resultFB.u_active !== true && resultFB.u_deactive_me!==resultFB.u_id) {
        res.status(404).send({
            message: "Your account is deactivated by Admin"
        });
        return;
    }
	uID=resultFB.u_id;
	break;
case "Gmail":
	const resultGmail = await Users.authenticate(username,'u_gmail_id');
    if (!resultGmail) {
        res.status(404).send({
            message: "user does not exists"
        });
        return;
    }
    if(resultGmail.u_active !== true && resultGmail.u_deactive_me!==resultGmail.u_id) {
        res.status(404).send({
            message: "Your account is deactivated by Admin"
        });
        return;
    }
	uID=resultGmail.u_id;
	break;
case "Ymail":
	const resultYmail = await Users.authenticate(username,'u_ymail_id');
    if (!resultYmail) {
        res.status(404).send({
            message: "user does not exists"
        });
        return;
    }
    if(resultYmail.u_active !== true && resultYmail.u_deactive_me!==resultYmail.u_id) {
        res.status(404).send({
            message: "Your account is deactivated by Admin"
        });
        return;
    }
	uID=resultYmail.u_id;
	break;
case "Instagram":
    const resultInstagram = await Users.authenticate(username,'u_instagram_id');
    if (!resultInstagram) {
        res.status(404).send({
            message: "user does not exists"
        });
        return;
    }
	if(resultInstagram.u_active !== true && resultInstagram.u_deactive_me!==resultInstagram.u_id) {
        res.status(404).send({
            message: "Your account is deactivated by Admin"
        });
        return;
    }
	uID=resultInstagram.u_id;
	break;
default:
	return res.status(422).send({
            message: "Invalid Login"
        });
	}     
    const UserDetails = await Users.findOne({
		include: [{
            model: db.user_profile
        },
		{
            model: db.user_social_ext
        },
		{
			model: db.user_content_post,
            attributes: ['ta_task_id'],
			where:{
				ucpl_status:`1`
			},
            required:false
		}
		],
		attributes:["u_id","u_referer_id","u_acct_type","u_act_sec","u_email","u_active","u_fb_username","u_fb_id","u_gmail_username","u_gmail_id","u_ymail_username","u_ymail_id","u_pref_login","u_instagram_username","u_instagram_id","u_created_at","u_updated_at","u_email_verify_status", "is_user_deactivated", "is_user_hidden"],
        where: {
            u_id: uID
        }
    });
    /* Account Deactivated Check */
    if (UserDetails.is_user_deactivated == 1) {
        res.status(404).send({
            message: "Your account is deactivated"
        });
        return;
    }
	if(UserDetails.u_active!==undefined && UserDetails.u_active!==true){
	let updateData = { u_deactive_me: uID,u_active:true };
	Users.update(updateData,
		{
			where : {
				u_id:uID
			}
		});
	const userPosts = await Posts.findAll({
        where: {
            ucpl_u_id: uID
        },
		attributes:['ucpl_id','ta_task_id','ucpl_content_type']
    });	
	if(userPosts && userPosts.length>0){
	  for(let i=0;i<userPosts.length;i++){
		await Posts.update({
			ucpl_status: 1
		},
		{
			where : {
				ucpl_id:userPosts[i].ucpl_id
			}
		});
		const jType=  userPosts[i].ucpl_content_type && userPosts[i].ucpl_content_type===2 ? 'Contest' : 'Single';
	    common.jsonTask(userPosts[i].ta_task_id,jType,'update');
	  }
	}
	
    }
    var access_token = common.genrateToken(uID);
    logger.log("info", "Login Successfully with username: "+username+" , pass:"+password+" and login type:"+login_type);
    
	res.status(200).send({
		message:"Login Successfully",
        data: UserDetails,
        access_token: access_token,
		media_token:common.imageToken(uID)
    });
};
/**
 * [forgetPassword Function to change password of a user
 * @param  {Object}  req expressJs request Object
 * @param  {Object}  res expressJs request Object
 * @return {Promise}
 */
exports.forgetPassword = async (req, res) => {
    if (!req.body.email) {
        res.status(400).send({
            message: "Email can not be empty!"
        });
        return;
    }
    var emailId = req.body.email.toLowerCase();
	const resultData = await Users.authenticate(emailId,'u_email');
	
    if (!resultData) {
        res.status(403).send({
            message: " please enter valid user details"
        });
    } else {
        var newpassword = crypto.randomBytes(8).toString("base64");
		console.log(newpassword);
        var new_salt = Users.generateSalt();
        var gen_password = Users.encryptPassword(newpassword, new_salt);
        const userData = {
            u_pass: gen_password,
            u_salt: new_salt
        };
        logger.log("info", "Forget email for emailId: "+emailId+" with password :"+newpassword);
    
        Users.update(userData, {
            where: {
                u_email: emailId
            }
        }).then(data => {
            res.status(200).end();
        });
        const template = await mail_templates.findOne({
        where: {
            mt_name: 'forget_password'
        }
        });	
		var templateBody=template.mt_body;
		templateBody=templateBody.replace("[EMAIL]", emailId);
		templateBody=templateBody.replace("[NEWPWD]", newpassword);
        const message = {
            from: process.env.AD_SMTP_USER,
            to: emailId,
            subject: "Forget Password: Request for new Passord",
            html: templateBody
        };
        mailer.sendMail(message);
    }
};
/**
 * [changePassword function to change password of the user
 * @param  {[object]}  req request object
 * @param  {[object]}  res response object
 * @return {Promise}
 */
exports.changePassword = async (req, res) => {
    var user_id = req.header(process.env.UKEY_HEADER || "x-api-key");
    var new_password = req.body.new_password;
    var current_password = req.body.current_password;
    if (
        !req.body.current_password ||
        !req.body.new_password ||
        !req.body.confirm_password
    ) {
       
        return res.status(400).send({
            message: " current_password,new password and confirm password required"
        });
    }
    if (req.body.new_password != req.body.confirm_password) {
        logger.log("error", "Change Pass: new password and confirm password does not match with uid=" + user_id);
        res.status(400).send({
            message: "new password and confirm password does not match"
        });
        return;
    }
    
    const user = Users.findOne({
        where: {
            u_id: user_id,
            u_active: true
        }
    });
    const resultData = await user;
    if (resultData) {
        var user_password = Users.encryptPassword(
            current_password,
            resultData.u_salt
        );
        if (user_password == resultData.u_pass) {
            var salt = Users.generateSalt();
            var createdpassword = Users.encryptPassword(new_password, salt);
            const userData = {
                u_pass: createdpassword,
                u_salt: salt
            };
            logger.log("info", "Password changed with uid=" + user_id);
            Users.update(userData, {
                where: {
                    u_id: user_id
                }
            }).then(data => {
                return res.status(200).send({
					message: "password changed successfully"
				});
            });
        } else {
            logger.log("error", "Change Pass: Invalid user current password with uid=" + user_id);
            res.status(400).send({
                message: "Invalid user current password"
            });
        }
    } else {
        logger.log("error", "Change Pass: User does not Exit with uid=" + user_id);
        res.status(403).send({
            message: "User does not Exit"
        });
    }
};
/**
 * [check email or phone exits
 * @param  {[object]}  req request object
 * @param  {[object]}  res response object
 * @return {Promise}
 */
exports.checkUserExits = async (req, res) => {
    const UserDetails = await Users.findOne({
        where: {
            u_email: req.body["email"].toLowerCase()
        },
		attributes:["u_id","u_email_verify_status"]
    });	
    if (UserDetails) {	
        if(UserDetails.u_email_verify_status){
		   res.status(200).send({
            message: "Already Exist"
		   });
		   return;
		}else{
		const template = await mail_templates.findOne({
			where: {
			mt_name: 'verify_email'
			}
			});
		const encryptedID = cryptr.encrypt(UserDetails.u_id);
		const vlink=process.env.SITE_API_URL+'users/verify_email/'+encryptedID;
		var templateBody=template.mt_body;
			templateBody=templateBody.replace("[CNAME]", req.body["email"]);
			templateBody=templateBody.replace("[VLINK]", vlink);
		const message = {
				from: "Socialbrands1@gmail.com",
				to: req.body["email"],
				subject: template.mt_subject,
				html: templateBody
			};
        mailer.sendMail(message);
		res.status(200).send({
            message: "Already Exist and not verified"
		    });
		return;
		}
        
    }
	res.status(400).send({
	message: "Not Exist"
	});
	return;
};

/**
 * check username exist or not
 * @param  {[object]}  req request object
 * @param  {[object]}  res response object
 * @return {Promise}
 */
exports.checkUserNameExists = async (req, res) => {
    if (!req.body["username"]) {
        res.status(400).send({
            msg:
                "username is required"
        });
        return;
    }
    const UserDetails = await Users.findOne({
        where: {
            u_login: req.body["username"].toLowerCase()
        },
		attributes:["u_id"]
    });	
    if (UserDetails) {	
        res.status(400).send({
            message: "Already Exist"
		   });
		  return;
        
    }
	res.status(200).send({
	message: "Not Exist"
	});
	return;
};

/**
 * [check email or phone exits
 * @param  {[object]}  req request object
 * @param  {[object]}  res response object
 * @return {Promise}
 */
exports.emailVerifyMail = async (req, res) => {
    const UserDetails = await Users.findOne({
        where: {
            u_email: req.body["email"].toLowerCase()
        },
		attributes:["u_id","u_email_verify_status"]
    });	
    if (UserDetails) {	
        if(UserDetails.u_email_verify_status){
		   res.status(200).send({
            message: "Already verified"
		   });
		   return;
		}else{
		const template = await mail_templates.findOne({
			where: {
			mt_name: 'verify_email'
			}
		});

			const encryptedID = cryptr.encrypt(UserDetails.u_id);
			const vlink=process.env.SITE_API_URL+'users/verify_email/'+encryptedID;
			var templateBody=template.mt_body;
			templateBody=templateBody.replace("[CNAME]", req.body["email"]);
			templateBody=templateBody.replace("[VLINK]", vlink);
			const message = {
				from: "Socialbrands1@gmail.com",
				to: req.body["email"],
				subject: template.mt_subject,
				html: templateBody
			};
        mailer.sendMail(message);
            res.status(200).send({
            message: "Email send"
		    });
		   return;
		}
        
    }else{
	res.status(400).send({
	message: "Not Exist"
	});
	return;
	}
};
exports.verifyEmail = async (req, res) => {
	try{
	const decryptedID = cryptr.decrypt(req.params.verifyToken);
    Users.update({u_email_verify_status:true}, {
        returning: true,
        where: {
            u_id: decryptedID
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            res.status(200).send({
                message: "Email verified successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot verify Users with toekn=${decryptedID}`
            });
        }
    }).catch(err => {
        logger.log("error", err+":verify User with id=" + decryptedID);
        res.status(500).send({
            message: err+"Error verify User with id=" + decryptedID
        });
		return;
    });
	}catch(error){
		res.status(500).send({
            message: "Invalid verify token"
        });
		return;
	}   
};
/**
 * [check email or phone exits
 * @param  {[object]}  req request object
 * @param  {[object]}  res response object
 * @return {Promise}
 */
exports.checkMobile = async (req, res) => {
	var user_id = req.header(process.env.UKEY_HEADER || "x-api-key");
	if (
        !req.body.mobile_number
    ) {
        return res.status(400).send({
            message: "mobile required"
        });
    }
	console.log(req.body["mobile_number"]);
    const UserDetails = await User_profile.findOne({
        where: {
            u_phone: req.body["mobile_number"]
        }
    });	
    if(UserDetails) {		
        res.status(404).send({
            message: "Already Exist"
		});
        return;
    }
   var otp=Math.floor(100000 + Math.random() * 900000);
   var sms=common.sendSMS(req.body["mobile_number"], "OTP for Social App is "+otp);
   console.log(sms)
	var data={
		u_phone:req.body["mobile_number"],
		phone_otp:otp
	};
	User_profile.update(data, {
        where: {
            u_id: user_id
        }
    });
	res.status(200).send({
	message: "Otp Send",
	otp:otp
	});
	return;
};
/**
 * resend otp
 * @param  {[object]}  req request object
 * @param  {[object]}  res response object
 * @return {Promise}
 */
exports.resendOtp = async (req, res) => {
	var user_id = req.header(process.env.UKEY_HEADER || "x-api-key");
	if (
        !req.body.mobile_number
    ) {
        return res.status(400).send({
            message: "mobile required"
        });
    }
    const UserDetails = await User_profile.findOne({
        where: {
            u_phone: req.body["mobile_number"],
			u_id:user_id
        }
    });	
    if(!UserDetails) {		
        res.status(404).send({
            message: "Not registered mobile number"
		});
        return;
    }
	var otp=Math.floor(100000 + Math.random() * 900000);
   var sms=common.sendSMS(req.body["mobile_number"], "OTP for Social App is "+otp);
	var data={
		phone_otp:otp
	};
	User_profile.update(data, {
        where: {
            u_id: user_id
        }
    });
	res.status(200).send({
	message: "Otp Send",
	otp:otp
	});
	return;
};
/**
 * verify otp
 * @param  {[object]}  req request object
 * @param  {[object]}  res response object
 * @return {Promise}
 */
exports.verify_otp = async (req, res) => {
	var user_id = req.header(process.env.UKEY_HEADER || "x-api-key");
	if (
        !req.body.otp
    ) {
        return res.status(400).send({
            message: "otp required"
        });
    }
    const UserDetails = await User_profile.findOne({
        where: {
			u_id:user_id
        }
    });	
    if(!UserDetails || !UserDetails.phone_otp || req.body.otp!=UserDetails.phone_otp ) {		
        res.status(404).send({
            message: "Invalid Otp"
		});
        return;
    }	
	res.status(200).send({
	message: "Otp Verified"
	});
	return;
};
/**
 * [check follow,unfollow and fan unfane
 * @param  {[object]}  req request object
 * @param  {[object]}  res response object
 * @return {Promise}
 */
exports.user_fan_following = async (req, res) => {
	var user_id = req.header(process.env.UKEY_HEADER || "x-api-key");
	if (!user_id || !req.body.action || !req.body.u_id) {
        return res.status(400).send({
            message: "action type,action and user id required"
        });
    }
    if(req.body.action==1){
	var userfanDetails=await userFF.findOne({
		where:{
			faf_to:parseInt(req.body.u_id),
			faf_by:parseInt(user_id)
        }
	});
    if(!userfanDetails){	
	var ffData={
			"faf_to": parseInt(req.body.u_id),
			"faf_by": parseInt(user_id)
	};
	userFF.create(ffData);
	}
	res.status(200).send({
	message:  'user followed' 
	});
	return;	
	}
	userFF.destroy({
		where:{
			faf_to: parseInt(req.body.u_id),
			faf_by: parseInt(user_id),
        }
	});
	res.status(200).send({
	   message: 'user unfollowed'
	});
	return;	
	
};
/**
 * Function to get all following list
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.followingListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'u_faf_id'
    const sortOrder = req.query.sortOrder || 'DESC'
	var user_id = req.query.userId ? req.query.userId : parseInt(req.header(process.env.UKEY_HEADER || "x-api-key"));
	var m_user_id=parseInt(req.header(process.env.UKEY_HEADER || "x-api-key"));
    var options = {
		include: [    
		{
		model: db.user_profile,
		as:'following',
		attributes: [["u_display_name", "username"],["u_f_name", "frist_name"],
		["u_l_name", "last_name"],
		["u_prof_img_path", "prof_img"]
		]
		}],		
        limit: pageSize,
        offset: skipCount, 
        attributes:["faf_to",
		[db.sequelize.literal('(SELECT COUNT(ufff.u_faf_id)  FROM user_fan_following as ufff WHERE ufff.faf_to = '+m_user_id+' and ufff.faf_by = user_fan_following.faf_to)'), 'following_me'],
		[db.sequelize.literal('(SELECT COUNT(ufffSEcond.u_faf_id)  FROM user_fan_following as ufffSEcond WHERE ufffSEcond.faf_by = '+m_user_id+' and ufffSEcond.faf_to = user_fan_following.faf_to)'), 'followed_by_me']
		],		
        where: {
			faf_by: user_id
		},
		order: [
            [sortBy, sortOrder]
        ]
    };
    var total = await userFF.count({
        where: options['where']
    });
    var userlist=await userFF.findAll(options);
	
	res.status(200).send({
        data: userlist,
        totalRecords: total,
		media_token:common.imageToken(m_user_id)
    });
	
}
/**
 * Function to get all followers list
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.followersListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'u_faf_id'
    const sortOrder = req.query.sortOrder || 'DESC'
	var user_id = req.query.userId ? req.query.userId : parseInt(req.header(process.env.UKEY_HEADER || "x-api-key"));
	console.log(user_id+"++++++++++++++++++++++++++++++++++++");
	var m_user_id=parseInt(req.header(process.env.UKEY_HEADER || "x-api-key"));
    var options = {
		include: [    
		{
		model: db.user_profile,
		as:'follower',
		attributes: [["u_display_name", "username"],["u_f_name", "frist_name"],
		["u_l_name", "last_name"],
		["u_prof_img_path", "prof_img"]
		]
		}],		
        limit: pageSize,
        offset: skipCount, 
        attributes:["faf_by",[db.sequelize.literal('(SELECT COUNT(ufff.u_faf_id)  FROM user_fan_following as ufff WHERE ufff.faf_by = '+m_user_id+' and ufff.faf_to = user_fan_following.faf_by)'), 'followed_by_me'],
		[db.sequelize.literal('(SELECT COUNT(ufffSec.u_faf_id)  FROM user_fan_following as ufffSec WHERE ufffSec.faf_to = '+m_user_id+' and ufffSec.faf_by = user_fan_following.faf_by)'), 'following_me']],		
        where: {
			faf_to: user_id
		},
		order: [
            [sortBy, sortOrder]
        ]
    };
    var total = await userFF.count({
        where: options['where']
    });
    userFF.findAll(options).then(function(userlist) {
	res.status(200).send({
        data: userlist,
        totalRecords: total,
		media_token:common.imageToken(m_user_id)
    })
	});
	
}
/**
 * Function to get all User ledger_transactions
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.user_coins_transactions = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'trx_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;
    const adminDetails = await adminSetting.findOne({
        where: {
            ad_id: 1
        },
		attributes:[
		["ad_conversion_rate","conversion_rate"],["ad_min_withdraw_limit","min_withdraw_limit"],["ad_max_withdraw_limit","max_withdraw_limit"]
		]
    });	
	const accountDetails = await accountBalance.findOne({
        where: {
            ac_user_id: req.header(process.env.UKEY_HEADER || "x-api-key") || 0
        },
		attributes:[
		["ac_balance","balance_coins"],["ac_balance_stars","balance_stars"],["ac_account_no","account_no"]
		]
    });
    var options = { 
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],	
        where: {
			trx_user_id: req.header(process.env.UKEY_HEADER || "x-api-key") || 0,
			trx_coins : {
				[Op.gt]  : 0
			}
		}
    };
    if (sortVal && sortBy) {
        var sortValue = sortVal;
        options.where = {
            [req.query.sortBy]: sortValue,
			trx_user_id: req.header(process.env.UKEY_HEADER || "x-api-key") || 0,
			trx_coins : {
				[Op.gt]  : 0
			}
        }
    }
    var total = await ledgerTransactions.count({
        where: options['where']
    });
    const users_list = await ledgerTransactions.findAll(options);
    res.status(200).send({
        data: users_list,
        totalRecords: total,
		conversion:adminDetails,
		userBalance:accountDetails,
		media_token:common.imageToken(req.header(process.env.UKEY_HEADER || "x-api-key"))
    });
}
exports.user_star_transactions = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = 'trx_id';
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;
    const adminDetails = await adminSetting.findOne({
        where: {
            ad_id: 1
        },
		attributes:[
		["ad_conversion_rate","conversion_rate"],["ad_min_withdraw_limit","min_withdraw_limit"],["ad_max_withdraw_limit","max_withdraw_limit"]
		]
    });	
	const accountDetails = await accountBalance.findOne({
        where: {
            ac_user_id: req.header(process.env.UKEY_HEADER || "x-api-key") || 0
        },
		attributes:[
		["ac_balance","balance_coins"],["ac_balance_stars","balance_stars"],["ac_account_no","account_no"]
		]
    });
    var options = { 
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],	
        where: {
			trx_user_id: req.header(process.env.UKEY_HEADER || "x-api-key") || 0,
			trx_stars : {
				[Op.gt]  : 0
			}
		}
    };
    if (sortVal && sortBy) {
        var sortValue = sortVal;
        options.where = {
            [req.query.sortBy]: sortValue,
			trx_user_id: req.header(process.env.UKEY_HEADER || "x-api-key") || 0,
			trx_stars : {
				[Op.gt]  : 0
			}
        }
    }
    var total = await ledgerTransactions.count({
        where: options['where']
    });
    const users_list = await ledgerTransactions.findAll(options);
    res.status(200).send({
        data: users_list,
        totalRecords: total,
		conversion:adminDetails,
		userBalance:accountDetails,
		media_token:common.imageToken(req.header(process.env.UKEY_HEADER || "x-api-key"))
    });
}
/**
 * Function to debit coins
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.user_debit_transactions = async (req, res) => {
	const userId=req.header(process.env.UKEY_HEADER || "x-api-key");
	if(!req.body["coins"] || !req.body["conversation_amount"] || !userId){
		res.status(400).send({
            message: "coins,conversation_amount required"
		});
        return;
	}
	const adminDetails = await adminSetting.findOne({
        where: {
            ad_id: 1
        },
		attributes:[
		["ad_conversion_rate","conversion_rate"],["ad_min_withdraw_limit","min_withdraw_limit"],["ad_max_withdraw_limit","max_withdraw_limit"]
		]
    });
	
	const accountDetails = await accountBalance.findOne({
        where: {
            ac_user_id: userId
        },
		attributes:[
		["ac_id","ac_id"],["ac_balance","balance_coins"],["ac_balance_stars","balance_stars"],["ac_account_no","account_no"]
		]
    });
	
    if(!accountDetails || 	accountDetails.dataValues.balance_coins <=0 || accountDetails.dataValues.balance_coins < req.body["coins"] ){
		res.status(400).send({
            message: "Invalid balance coins"
		});
        return;
	}
	const validConversionAmount=Math.floor(req.body["coins"]/adminDetails.dataValues.conversion_rate);
	console.log(adminDetails.dataValues)
	if(validConversionAmount!=req.body["conversation_amount"]){
		res.status(400).send({
            message: "Invalid conversion amount or coins"
		});
        return;
	}
	if(req.body["conversation_amount"]> adminDetails.dataValues.max_withdraw_limit){
		res.status(400).send({
            message: "conversation amount is max then withdraw limit,Please Contact to admin"
		});
        return;
	}
	if(req.body["conversation_amount"] < adminDetails.dataValues.min_withdraw_limit){
		res.status(400).send({
            message: "conversation amount is min to withdraw limit,Please Contact to admin"
		});
        return;
	}
	//const remainderCoins=req.body["coins"]%adminDetails.conversion_rate;
	    ledgerTransactions.create({
			trx_user_id:userId,
			trx_unique_id:userId+"-"+new Date().getTime(),
			trx_type:0,
			trx_coins:req.body["coins"],
			trx_stars:0,
			trx_date_timestamp:new Date().getTime(),
			trx_source:{
				account_details:accountDetails.dataValues,
				conversion_details:adminDetails.dataValues
			},
			trx_approval_status:0,
			trx_description:req.body["description"]	,
            trx_currency_converation_amount:req.body["conversation_amount"],
            trx_conversion_rate:adminDetails.dataValues.conversion_rate,
			trx_withdraw_destination:0			
		}).then(data=>{
			console.log(accountDetails.dataValues.balance_coins)
			accountBalance.update({
				ac_balance:accountDetails.dataValues.balance_coins-req.body["coins"]
			},{
			where : {
				ac_user_id: userId
			}
			});
			res.status(200).send({
			message:  "transaction successfully debited"
			});
			return ;
		});
}

/**
 * Function to deactivate or hide unhide account
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.userDeactivateOrHide = async (req, res) => {
    const id = req.params.userID;
	if(!id){
		res.status(404).send({
            message: "User with id not found"
        });
		return;
    }
	if(!req.body.u_action){
		res.status(404).send({
            message: "u_action is Required"
        });
		return;
    }
    let updateData = {};
    if (req.body.u_action == 1) {
        updateData = { is_user_hidden: 1 };
    } else if (req.body.u_action == 2) {
        updateData = { is_user_hidden: 0 };
    } else if (req.body.u_action == 3) {
        updateData = { is_user_deactivated: 1 };
    } else if (req.body.u_action == 4) {
        updateData = { is_user_deactivated: 0 };
    }
    const UserDetails = await Users.findOne({
        where: {
            u_id: id
        }
    });	
    if (UserDetails.is_user_deactivated == 1 && UserDetails.is_user_hidden == 0 && req.body.u_action == 1) {
        res.status(404).send({
            message: "Account is deactive, Cound not update to hidden."
        });
		return;
    }
    if (UserDetails && updateData != undefined) {
        Users.update(updateData, {
            returning: true,
            where: {
                u_id: id
            }
        }).then(function([ num, [result] ]) {
            if (num == 1) {
                audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','Users',id,result.dataValues,UserDetails);
              
                res.status(200).send({
                    message: "User updated successfully."
                });
            } else {
                res.status(400).send({
                    message: `Cannot update Users with id=${id}. Maybe user was not found or req.body is empty!`
                });
            }
        }).catch(err => {
            logger.log("error", err+":updating User with id=" + id);
            res.status(500).send({
                message: err+"Error updating User with id=" + id
            });
            return;
        });
    }
    
}