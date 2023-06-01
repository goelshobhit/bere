const db = require("../models");
const Users = db.users;
const crypto = require("crypto");
const User_profile = db.user_profile;
const User_social_ext = db.user_social_ext;
const Posts = db.user_content_post;
const adminSetting = db.admin_setting;
const mail_templates = db.mail_templates;
const accountBalance = db.account_balance;
const ledgerTransactions = db.ledger_transactions;
const mandrillapp = require("../middleware/mandrillapp.js");
const mailer = require("../middleware/mailer.js");
const Op = db.Sequelize.Op;
const upload = require("../middleware/upload");
const audit_log = db.audit_log;
const common = require("../common");
const logger = require("../middleware/logger");
const userFF = db.user_fan_following;
const Cryptr = require("cryptr");
const cryptr = new Cryptr("socialappAPI");
const { QueryTypes } = require("sequelize");
const _ = require("lodash");
const generate = require("../helpers/generate");
const moment = require("moment/moment");
const setSaltAndPassword = (user) => {
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
exports.registerUser = async (req, res, next) => {
  const body = req.body;

  let {
    username,
    display_name,
    first_name,
    last_name,
    password,
    email,
    date_of_birth = "",
    phonenumber = "",
    facebook_handle = [],
    pinterest_handle = [],
    instagram_handle = [],
    tiktok_handle = [],
    twitter_handle = [],
    snapchat_handle = [],
    status = true,
    user_type = "Normal",
    referer_id = 0,
    address = "",
    city = "",
    zipcode = "",
    state = "",
    country = "",
    bio = "",
    job_title = "",
    account_type = 0,
    referral_code = "",
    account_section = 0,
  } = req.body;

  date_of_birth = date_of_birth
    ? moment(date_of_birth).format("DD/MM/YYYY")
    : "";

  const login_type = user_type;

  if (referral_code) {
    try {
      const referrerUser = await Users.findOne({
        where: {
          u_login: referral_code,
        },
      });

      if (!referrerUser) {
        referral_code = "";
      }
    } catch (error) {
      return next(error);
    }
  }

  if (login_type == "Instagram") {
    let UserDetails;

    try {
      UserDetails = await Users.findOne({
        where: {
          u_instagram_id: req.body["Instagram id"],
        },
        attributes: ["u_id"],
      });
    } catch (error) {
      return next(error);
    }

    if (UserDetails) {
      try {
        const existingUser = await Users.findOne({
          include: [
            {
              model: db.user_profile,
            },
            {
              model: db.user_social_ext,
            },
            {
              model: db.user_content_post,
              attributes: ["ta_task_id"],
              where: {
                ucpl_status: `1`,
              },
              required: false,
            },
          ],
          attributes: [
            "u_id",
            "u_referer_id",
            "u_acct_type",
            "u_act_sec",
            "u_email",
            "u_active",
            "u_fb_username",
            "u_fb_id",
            "u_gmail_username",
            "u_gmail_id",
            "u_ymail_username",
            "u_ymail_id",
            "u_pref_login",
            "u_instagram_username",
            "u_instagram_id",
            "u_created_at",
            "u_updated_at",
            "u_email_verify_status",
          ],
          where: {
            u_id: UserDetails.u_id,
          },
        });
        return res.status(200).send({
          message: "Already Registered",
          data: existingUser,
          access_token: common.generateToken(UserDetails.u_id),
          media_token: common.imageToken(UserDetails.u_id),
        });
      } catch (error) {
        return next(error);
      }
    }
  }
  if (login_type == "Normal" || login_type == "Gmail") {
    let UserDetails;

    try {
      UserDetails = await Users.findOne({
        where: {
          u_email: email.toLowerCase(),
        },
      });
    } catch (error) {
      return next(error);
    }

    if (UserDetails) {
      return res.status(200).send({
        message: "Already Registered",
      });
    }
  }
  //   if (login_type == "Ymail") {
  //     const UserDetails = await Users.findOne({
  //       where: {
  //         u_ymail_id: req.body["Ymail id"],
  //       },
  //     });
  //     if (UserDetails) {
  //       res.status(200).send({
  //         message: "Already Registered",
  //       });
  //       return;
  //     }
  //   }

  let template;

  try {
    template = await mail_templates.findOne({
      where: {
        mt_name: "verify_email",
      },
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }

  let UserDetails;

  try {
    UserDetails = await Users.findOne({
      where: {
        [Op.or]: [
          {
            u_login: req.body["username"].toLowerCase(),
          },
          {
            u_login: req.body["username"],
          },
        ],
      },
    });
  } catch (error) {
    return next(error);
  }

  if (UserDetails) {
    return res.status(400).send({
      message: "Username Already Exist",
    });
  }

  let referralLink;

  try {
    referralLink = generate.referralLink(username);
  } catch (error) {
    return next(error);
  }

  const data = {
    u_acct_type: account_type || 0,
    u_referer_id: referer_id,
    u_display_name: display_name,
    u_first_name: first_name,
    u_last_name: last_name,
    u_act_sec: account_section,
    u_login: username,
    u_pass: password,
    u_email: email ? email.toLowerCase() : "",
    au_salt: Users.generateSalt(),
    u_active: status,
    u_facebook_handle: _.get(facebook_handle, "[0]", ""),
    u_instagram_handle: _.get(instagram_handle, "[0]", ""),
    u_tiktok_handle: _.get(tiktok_handle, "[0]", ""),
    u_twitter_handle: _.get(twitter_handle, "[0]", ""),
    u_snapchat_handle: _.get(snapchat_handle, "[0]", ""),
    u_pinterest_handle: _.get(pinterest_handle, "[0]", ""),
    city,
    country,
    state,
    bio,
    job_title,
    u_date_of_birth: date_of_birth,
    referral_link: referralLink,
    referral_code,
  };
  console.log("User data: " + JSON.stringify(data));

  let userRecord;

  try {
    userRecord = await Users.create(data);
  } catch (error) {
    return next(error);
  }

  console.log("Successfully created the user : ", userRecord);
  let accountRecord;
  try {
    accountRecord = await accountBalance.create({
      ac_user_id: userRecord.u_id,
      ac_balance: 0,
      ac_balance_stars: 0,
      ac_account_no: "",
    });
  } catch (error) {
    return next(error);
  }

  console.log(
    "Successfully created the account balance for the user : ",
    accountRecord
  );
  let u_dob = date_of_birth ? date_of_birth.split("/") : null;
  let userProfileRecord;
  try {
    userProfileRecord = await User_profile.create({
      u_id: userRecord.u_id,
      u_display_name: display_name,
      u_profile_name: null,
      u_f_name: first_name,
      u_l_name: last_name,
      u_dob: date_of_birth,
      u_dob_d: u_dob ? u_dob[0] : null,
      u_dob_m: u_dob ? u_dob[1] : null,
      u_dob_y: u_dob ? u_dob[2] : null,
      u_gender: null,
      u_address: address,
      u_city: city,
      u_state: state,
      u_country: country,
      u_zipcode: zipcode,
      u_prof_img_path: null,
      u_phone: phonenumber,
      u_phone_verify_status: true,
    });
  } catch (error) {
    return next(error);
  }

  console.log(
    "Successfully created the user profile for the user : ",
    userProfileRecord
  );

  try {
    let userSocialRecord = await User_social_ext.create({
      u_id: userRecord.u_id,
      instagram_handle:
        instagram_handle.length > 0
          ? instagram_handle.map((id) => `https://www.instagram.com/${id}`)
          : [],
      twitter_handle:
        twitter_handle.length > 0
          ? twitter_handle.map((id) => `https://www.twitter.com/${id}`)
          : [],
      facebook_handle:
        facebook_handle.length > 0
          ? facebook_handle.map((id) => `https://www.facebook.com/${id}`)
          : [],
      pinterest_handle:
        pinterest_handle.length > 0
          ? pinterest_handle.map((id) => `https://www.pinterest.com/${id}`)
          : [],
      snapchat_handle:
        snapchat_handle.length > 0
          ? snapchat_handle.map((id) => `https://www.snapchat.com/add/${id}`)
          : [],
      tiktok_handle:
        tiktok_handle.length > 0
          ? tiktok_handle.map((id) => `https://www.tiktok.com/${id}`)
          : [],

      use_u_instagram_link: body.hasOwnProperty("User instagram name")
        ? "https://www.instagram.com/" + req.body["User instagram name"]
        : "",
      use_u_facebook_link: body.hasOwnProperty("User fb name")
        ? "https://www.facebook.com/" + req.body["User fb name"]
        : "",
      show_facebook: body.hasOwnProperty("User fb name") ? true : false,
      show_instagram: body.hasOwnProperty("User instagram name") ? true : false,
    });
    console.log(
      "Successfully added social account handles: ",
      userSocialRecord
    );
  } catch (error) {
    return next(error);
  }

  audit_log.saveAuditLog(
    userRecord.u_id,
    "add",
    "user_login",
    userRecord.u_id,
    userRecord.dataValues
  );
  if (email) {
    try {
      const encryptedID = cryptr.encrypt(userRecord.u_id);
      const vlink =
        process.env.SITE_API_URL + "users/verify_email/" + encryptedID;
      var templateBody = template.mt_body;
      templateBody = templateBody.replace("[CNAME]", email);
      templateBody = templateBody.replace("[VLINK]", vlink);
      const message = {
        from: "Socialbrands1@gmail.com",
        to: email,
        subject: template.mt_subject,
        html: templateBody,
      };
      mailer.sendMail(message);
    } catch (error) {
      console.log(
        "Error occured while sending verification email ",
        error.message
      );
    }
  }
  res.status(201).send({
    message: "User Added Successfully",
    user_details: userRecord,
    access_token: common.generateToken(userRecord.u_id),
    media_token: common.imageToken(userRecord.u_id),
  });
};
exports.createNewUser = async (req, res) => {
  const body = req.body;
  if (!req.body["User Type"]) {
    res.status(500).send({
      message: "User type required",
    });
    return;
  }
  var login_type = req.body["User Type"];
  if (login_type == "Instagram") {
    const UserDetails = await Users.findOne({
      where: {
        u_instagram_id: req.body["Instagram id"],
      },
      attributes: ["u_id"],
    });
    if (UserDetails) {
      const UserD = await Users.findOne({
        include: [
          {
            model: db.user_profile,
          },
          {
            model: db.user_social_ext,
          },
          {
            model: db.user_content_post,
            attributes: ["ta_task_id"],
            where: {
              ucpl_status: `1`,
            },
            required: false,
          },
        ],
        attributes: [
          "u_id",
          "u_referer_id",
          "u_acct_type",
          "u_act_sec",
          "u_email",
          "u_active",
          "u_fb_username",
          "u_fb_id",
          "u_gmail_username",
          "u_gmail_id",
          "u_ymail_username",
          "u_ymail_id",
          "u_pref_login",
          "u_instagram_username",
          "u_instagram_id",
          "u_created_at",
          "u_updated_at",
          "u_email_verify_status",
        ],
        where: {
          u_id: UserDetails.u_id,
        },
      });
      res.status(200).send({
        message: "Aleary Registered",
        data: UserD,
        access_token: common.generateToken(UserDetails.u_id),
        media_token: common.imageToken(UserDetails.u_id),
      });
      return;
    }
  }
  if (login_type == "Normal" || login_type == "Gmail") {
    const UserDetails = await Users.findOne({
      where: {
        u_email: req.body["User email"].toLowerCase(),
      },
    });
    if (UserDetails) {
      res.status(200).send({
        message: "Aleary Registered",
      });
      return;
    }
  }
  if (login_type == "Ymail") {
    const UserDetails = await Users.findOne({
      where: {
        u_ymail_id: req.body["Ymail id"],
      },
    });
    if (UserDetails) {
      res.status(200).send({
        message: "Aleary Registered",
      });
      return;
    }
  }
  const template = await mail_templates.findOne({
    where: {
      mt_name: "verify_email",
    },
  });

  // const UserDetails = await Users.findOne({
  //     where: {
  //         u_login: req.body["User login"].toLowerCase()
  //     }
  // });
  // if (UserDetails) {
  //     res.status(400).send({
  //         message: "Username Aleary Exist"
  //     });
  //     return;
  // }
  const UserDetails = await Users.findOne({
    where: {
      // u_login: req.body["User login"],
      [Op.or]: [
        {
          u_login: req.body["User login"].toLowerCase(),
        },
        {
          u_login: req.body["User login"],
        },
      ],
    },
  });
  if (UserDetails) {
    res.status(400).send({
      message: "Username Aleary Exist",
    });
    return;
  }

  const data = {
    u_acct_type: body.hasOwnProperty("Account type")
      ? req.body["Account type"]
      : 0,
    u_referer_id: body.hasOwnProperty("Referer id")
      ? req.body["Referer id"]
      : 0,
    u_act_sec: body.hasOwnProperty("User act sec")
      ? req.body["User act sec"]
      : 0,
    u_login: body.hasOwnProperty("User login")
      ? req.body["User login"].toLowerCase()
      : "",
    u_pass: body.hasOwnProperty("User password")
      ? req.body["User password"]
      : login_type,
    u_email: req.body["User email"] ? req.body["User email"].toLowerCase() : "",
    au_salt: Users.generateSalt(),
    u_active: body.hasOwnProperty("User status")
      ? req.body["User status"]
      : true,
    u_fb_username: body.hasOwnProperty("User fb name")
      ? req.body["User fb name"]
      : "",
    u_fb_id: body.hasOwnProperty("Fb id") ? req.body["Fb id"] : "",
    u_gmail_username: body.hasOwnProperty("User gmail name")
      ? req.body["User gmail name"]
      : "",
    u_gmail_id: body.hasOwnProperty("Gmail id") ? req.body["Gmail id"] : "",
    u_ymail_username: body.hasOwnProperty("User ymail name")
      ? req.body["User ymail name"]
      : "",
    u_ymail_id: body.hasOwnProperty("Ymail id") ? req.body["Ymail id"] : "",
    u_pref_login: body.hasOwnProperty("User pref login")
      ? req.body["User pref login"]
      : 0,
    u_instagram_username: body.hasOwnProperty("User instagram name")
      ? req.body["User instagram name"]
      : "",
    u_instagram_id: body.hasOwnProperty("Instagram id")
      ? req.body["Instagram id"]
      : "",
  };
  Users.create(data)
    .then((data) => {
      accountBalance.create({
        ac_user_id: data.u_id,
        ac_balance: 0,
        ac_balance_stars: 0,
        ac_account_no: "",
      });
      User_profile.create({ u_id: data.u_id });
      User_social_ext.create({
        use_u_instagram_link: body.hasOwnProperty("User instagram name")
          ? "https://www.instagram.com/" + req.body["User instagram name"]
          : "",
        use_u_facebook_link: body.hasOwnProperty("User fb name")
          ? "https://www.facebook.com/" + req.body["User fb name"]
          : "",
        show_facebook: body.hasOwnProperty("User fb name") ? true : false,
        show_instagram: body.hasOwnProperty("User instagram name")
          ? true
          : false,
        u_id: data.u_id,
      });
      audit_log.saveAuditLog(
        data.u_id,
        "add",
        "user_login",
        data.u_id,
        data.dataValues
      );
      if (req.body["User email"]) {
        try {
          const encryptedID = cryptr.encrypt(data.u_id);
          const vlink =
            process.env.SITE_API_URL + "users/verify_email/" + encryptedID;
          var templateBody = template.mt_body;
          templateBody = templateBody.replace(
            "[CNAME]",
            req.body["User email"]
          );
          templateBody = templateBody.replace("[VLINK]", vlink);
          const message = {
            from: "Socialbrands1@gmail.com",
            to: req.body["User email"],
            subject: template.mt_subject,
            html: templateBody,
          };
          mailer.sendMail(message);
        } catch (error) {
          console.log(error);
        }
      }
      res.status(201).send({
        message: "User Added Successfully",
        user_details: data,
        access_token: common.generateToken(data.u_id),
        media_token: common.imageToken(data.u_id),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

exports.createNewUserv1 = async (req, res) => {
  try {
    const body = req.body;

    let {
      username,
      display_name,
      first_name,
      last_name,
      password,
      email,
      date_of_birth = "",
      phonenumber = "",
      facebook_handle = [],
      pinterest_handle = [],
      instagram_handle = [],
      tiktok_handle = [],
      twitter_handle = [],
      snapchat_handle = [],
      status = true,
      user_type = "Normal",
      referer_id = 0,
      address = "",
      city = "",
      zipcode = "",
      state = "",
      country = "",
      account_type = 0,
      account_section = 0,
    } = req.body;
    date_of_birth = date_of_birth
      ? moment(date_of_birth).format("DD/MM/YYYY")
      : "";
    if (
      (!username || !email, !password, !display_name, !first_name, !last_name)
    )
      throw new Error("Mandatory fields are missing");
    var login_type = user_type || "Normal";

    if (login_type == "Instagram") {
      const UserDetails = await Users.findOne({
        where: {
          u_instagram_id: req.body["Instagram id"],
        },
        attributes: ["u_id"],
      });
      if (UserDetails) {
        const existingUser = await Users.findOne({
          include: [
            {
              model: db.user_profile,
            },
            {
              model: db.user_social_ext,
            },
            {
              model: db.user_content_post,
              attributes: ["ta_task_id"],
              where: {
                ucpl_status: `1`,
              },
              required: false,
            },
          ],
          attributes: [
            "u_id",
            "u_referer_id",
            "u_acct_type",
            "u_act_sec",
            "u_email",
            "u_active",
            "u_fb_username",
            "u_fb_id",
            "u_gmail_username",
            "u_gmail_id",
            "u_ymail_username",
            "u_ymail_id",
            "u_pref_login",
            "u_instagram_username",
            "u_instagram_id",
            "u_created_at",
            "u_updated_at",
            "u_email_verify_status",
          ],
          where: {
            u_id: UserDetails.u_id,
          },
        });
        res.status(200).send({
          message: "Already Registered",
          data: existingUser,
          access_token: common.generateToken(UserDetails.u_id),
          media_token: common.imageToken(UserDetails.u_id),
        });
        return;
      }
    }
    if (login_type == "Normal" || login_type == "Gmail") {
      const UserDetails = await Users.findOne({
        where: {
          u_email: email.toLowerCase(),
        },
      });
      if (UserDetails) {
        res.status(200).send({
          message: "Already Registered",
        });
        return;
      }
    }
    if (login_type == "Ymail") {
      const UserDetails = await Users.findOne({
        where: {
          u_ymail_id: req.body["Ymail id"],
        },
      });
      if (UserDetails) {
        res.status(200).send({
          message: "Already Registered",
        });
        return;
      }
    }
    const template = await mail_templates.findOne({
      where: {
        mt_name: "verify_email",
      },
    });

    const UserDetails = await Users.findOne({
      where: {
        [Op.or]: [
          {
            u_login: req.body["username"].toLowerCase(),
          },
          {
            u_login: req.body["username"],
          },
        ],
      },
    });
    if (UserDetails) {
      res.status(400).send({
        message: "Username Already Exist",
      });
      return;
    }

    const data = {
      u_acct_type: account_type || 0,
      u_referer_id: referer_id,
      u_display_name: display_name,
      u_first_name: first_name,
      u_last_name: last_name,
      u_act_sec: account_section,
      u_login: username,
      u_pass: password,
      u_email: email ? email.toLowerCase() : "",
      au_salt: Users.generateSalt(),
      u_active: status,
      u_facebook_handle: facebook_handle,
      u_instagram_handle: instagram_handle,
      u_tiktok_handle: tiktok_handle,
      u_twitter_handle: twitter_handle,
      u_snapchat_handle: snapchat_handle,
      u_pinterest_handle: pinterest_handle,
      u_date_of_birth: date_of_birth,
    };
    console.log("User data: " + data);

    let userRecord = await Users.create(data);
    console.log("Successfully created the user : ", userRecord);
    let accountRecord = await accountBalance.create({
      ac_user_id: userRecord.u_id,
      ac_balance: 0,
      ac_balance_stars: 0,
      ac_account_no: "",
    });
    console.log(
      "Successfully created the account balance for the user : ",
      accountRecord
    );
    let u_dob = date_of_birth ? date_of_birth.split("/") : null;
    let userProfileRecord = await User_profile.create({
      u_id: userRecord.u_id,
      u_display_name: display_name,
      u_profile_name: null,
      u_f_name: first_name,
      u_l_name: last_name,
      u_dob: date_of_birth,
      u_dob_d: u_dob ? u_dob[0] : null,
      u_dob_m: u_dob ? u_dob[1] : null,
      u_dob_y: u_dob ? u_dob[2] : null,
      u_gender: null,
      u_address: address,
      u_city: city,
      u_state: state,
      u_country: country,
      u_zipcode: zipcode,
      u_prof_img_path: null,
      u_phone: phonenumber,
      u_phone_verify_status: true,
    });
    console.log(
      "Successfully created the user profile for the user : ",
      userProfileRecord
    );

    let userSocialRecord = await User_social_ext.create({
      u_id: userRecord.u_id,
      instagram_handle:
        instagram_handle.length > 0
          ? instagram_handle.map((id) => `https://www.instagram.com/${id}`)
          : [],
      twitter_handle:
        twitter_handle.length > 0
          ? twitter_handle.map((id) => `https://www.twitter.com/${id}`)
          : [],
      facebook_handle:
        facebook_handle.length > 0
          ? facebook_handle.map((id) => `https://www.facebook.com/${id}`)
          : [],
      pinterest_handle:
        pinterest_handle.length > 0
          ? pinterest_handle.map((id) => `https://www.pinterest.com/${id}`)
          : [],
      snapchat_handle:
        snapchat_handle.length > 0
          ? snapchat_handle.map((id) => `https://www.snapchat.com/add/${id}`)
          : [],
      tiktok_handle:
        tiktok_handle.length > 0
          ? tiktok_handle.map((id) => `https://www.tiktok.com/${id}`)
          : [],

      use_u_instagram_link: body.hasOwnProperty("User instagram name")
        ? "https://www.instagram.com/" + req.body["User instagram name"]
        : "",
      use_u_facebook_link: body.hasOwnProperty("User fb name")
        ? "https://www.facebook.com/" + req.body["User fb name"]
        : "",
      show_facebook: body.hasOwnProperty("User fb name") ? true : false,
      show_instagram: body.hasOwnProperty("User instagram name") ? true : false,
    });
    console.log(
      "Successfully added social account handles: ",
      userSocialRecord
    );
    audit_log.saveAuditLog(
      userRecord.u_id,
      "add",
      "user_login",
      userRecord.u_id,
      userRecord.dataValues
    );

    if (email) {
      try {
        const encryptedID = cryptr.encrypt(userRecord.u_id);
        const vlink =
          process.env.SITE_API_URL + "users/verify_email/" + encryptedID;
        var templateBody = template.mt_body;
        templateBody = templateBody.replace("[CNAME]", email);
        templateBody = templateBody.replace("[VLINK]", vlink);
        const message = {
          from: "Socialbrands1@gmail.com",
          to: email,
          subject: template.mt_subject,
          html: templateBody,
        };
        mailer.sendMail(message);
      } catch (error) {
        console.log(
          "Error occured while sending verification email ",
          error.message
        );
      }
    }
    res.status(201).send({
      message: "User Added Successfully",
      user_details: userRecord,
      access_token: common.generateToken(userRecord.u_id),
      media_token: common.imageToken(userRecord.u_id),
    });
  } catch (error) {
    console.log(error);
    console.log("Unable to create new user ", error.message);
    audit_log.saveAuditLog(1, "Unable to create new user ", error.message);
    res.status(500).send({
      message: error.message || "Some error occurred while creating the User.",
    });
  }
};

const fetchCmsDetailsOld = async (userID) => {
  var level_options = {
    include: [
      {
        model: db.level_task,
      },
    ],
    where: {
      task_user_id: userID,
    },
  };
  const user_level_listing = await db.user_level_task_action.findAll(
    level_options
  );

  var video_add_options = {
    include: [
      {
        model: db.watch_ads_task,
      },
    ],
    where: {
      u_id: userID,
    },
  };
  const video_add_listing = await db.watch_ads_task_submit.findAll(
    video_add_options
  );
  var videoAddIds = {};
  if (video_add_listing.length) {
    video_add_listing.forEach((element) => {
      if (!videoAddIds[element.video_ad.cr_co_id]) {
        videoAddIds[element.video_ad.cr_co_id] = [];
      }
      videoAddIds[element.video_ad.cr_co_id].push(element);
    });
  }
  var bonus_reward_options = {
    include: [
      {
        model: db.bonus_item,
      },
    ],
    where: {
      bonus_rewards_usrid: userID,
    },
  };
  const bonus_rewards_listing = await db.bonus_rewards.findAll(
    bonus_reward_options
  );
  var bonusRewardIds = {};
  if (bonus_rewards_listing.length) {
    bonus_rewards_listing.forEach((element) => {
      if (!bonusRewardIds[element.bonus_item.bonus_item_brand_id]) {
        bonusRewardIds[element.bonus_item.bonus_item_brand_id] = [];
      }
      bonusRewardIds[element.bonus_item.bonus_item_brand_id].push(element);
    });
  }

  var survey_options = {
    include: [
      {
        model: db.survey,
        attributes: ["sr_id", "sr_brand_id"],
      },
    ],
    attributes: ["sr_id", "sr_completed"],
    where: {
      sr_uid: userID,
    },
  };
  const survey_listing = await db.survey_user_complete.findAll(survey_options);

  var bonus_task_options = {
    where: {
      bonus_task_usr_id: userID,
    },
  };
  const bonus_task_listing = await db.bonus_task.findAll(bonus_task_options);
  var brandBonusTaskIncompleteIds = {};
  var brandBonusTaskCompleteIds = {};
  if (bonus_task_listing.length) {
    bonus_task_listing.forEach((element) => {
      if (!brandBonusTaskIncompleteIds[element.bonus_task_brand_id]) {
        brandBonusTaskIncompleteIds[element.bonus_task_brand_id] = [];
      }
      if (!brandBonusTaskCompleteIds[element.bonus_task_brand_id]) {
        brandBonusTaskCompleteIds[element.bonus_task_brand_id] = [];
      }
      if (element.bonus_task_is_finished == "1") {
        brandBonusTaskCompleteIds[element.bonus_task_brand_id].push(element);
      } else {
        brandBonusTaskIncompleteIds[element.bonus_task_brand_id].push(element);
      }
    });
  }
  var reward_given_options = {
    include: [
      {
        model: db.reward_center,
      },
    ],
    where: {
      rewards_award_user_id: userID,
    },
  };
  const reward_given_listing = await db.rewards_given.findAll(
    reward_given_options
  );

  const User = await Users.findOne({
    include: [
      {
        model: db.user_content_post,
        attributes: [
          "ucpl_content_data",
          ["ucpl_id", "post_id"],
          "ta_task_id",
          "ucpl_content_type",
          "upcl_brand_details",
          "ucpl_created_at",
        ],
        required: false,
        include: [
          {
            model: db.post_comment,
            required: false,
            where: {
              pc_commenter_uid: {
                [Op.not]: userID,
              },
            },
          },
        ],
        where: {
          ucpl_status: 1,
        },
        // limit: pageSize,
        // offset: skipCount,
        order: [["ucpl_id", "DESC"]],
      },
    ],
    attributes: [
      "u_id",
      "u_login",
      "u_referer_id",
      "u_acct_type",
      "u_act_sec",
      "u_email",
      "u_active",
      "u_pref_login",
      "u_created_at",
      "u_updated_at",
      "u_email_verify_status",
      "is_user_deactivated",
      "is_user_hidden",
      //[db.sequelize.literal('(SELECT SUM(bonus_usr_riddim_level) FROM bonus_usr WHERE bonus_usr.bonus_usr_id = '+userID+'  )'), 'Riddim Level'],
      [db.sequelize.literal("0"), "Tickets Earned"],
      [db.sequelize.literal("0"), "Presents Earned"],
      [db.sequelize.literal("0"), "Lottery Wheels"],
      [db.sequelize.literal("0"), "Easter Eggs"],
      [db.sequelize.literal("0"), "Chests Earned"],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM bonus_rewards WHERE bonus_rewards.bonus_rewards_usrid = " +
            userID +
            ")"
        ),
        "Bonuses Won",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM bonus_task WHERE bonus_task.bonus_task_usr_id = " +
            userID +
            " and bonus_task_is_finished = 1 )"
        ),
        "Bonus Tasks Completed",
      ],
      [db.sequelize.literal("0"), "Tasks Entered"],
      [db.sequelize.literal("0"), "Contests Entered"],
      [db.sequelize.literal("0"), "Content Entered"],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM survey_user_complete WHERE survey_user_complete.sr_uid = " +
            userID +
            ")"
        ),
        "Surveys",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM user_fan_following WHERE user_fan_following.faf_by = " +
            userID +
            ")"
        ),
        "Following",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM user_fan_following WHERE user_fan_following.faf_to = " +
            userID +
            ")"
        ),
        "Followers",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM watch_ads_task_submit WHERE watch_ads_task_submit.u_id = " +
            userID +
            " and watch_ads_task_submit.u_id = user_login.u_id )"
        ),
        "Ads Watched",
      ],
      [
        db.sequelize.literal(
          "(SELECT SUM(pc_comment_likes) FROM post_comment WHERE post_comment.pc_commenter_uid = " +
            userID +
            "  )"
        ),
        "Liked Comments",
      ],
      [
        db.sequelize.literal(
          "(SELECT SUM(pc_comment_unlikes) FROM post_comment WHERE post_comment.pc_commenter_uid = " +
            userID +
            "  )"
        ),
        "Disliked Comments",
      ],
      [
        db.sequelize.literal(
          "(SELECT SUM(ucpl_reaction_counter) FROM user_content_post WHERE user_content_post.ucpl_u_id = " +
            userID +
            "  )"
        ),
        "Reactions Received",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM post_user_reactions WHERE post_user_reactions.u_id = " +
            userID +
            ")"
        ),
        "Reactions Given",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM content_report WHERE content_report.content_report_owner_id = " +
            userID +
            ")"
        ),
        "Reported Content",
      ],
      [db.sequelize.literal("0"), "Number of Brands"],
      [db.sequelize.literal("0"), "Tier 2 Sent"],
      [db.sequelize.literal("0"), "Tier 2 Incomplete"],
      [db.sequelize.literal("0"), "Tier 2 Declined"],
      [db.sequelize.literal("0"), "Tier 2 Completed"],
      [db.sequelize.literal("0"), "Tier 3 Completed"],
      [db.sequelize.literal("0"), "Tier 3 Sent"],
      [db.sequelize.literal("0"), "Tier 3 Incomplete"],
      [db.sequelize.literal("0"), "Tier 3 Declined"],
      [db.sequelize.literal("0"), "Tier 3 Completed"],
      [db.sequelize.literal("null"), "Brands Participated"],
    ],
    where: {
      u_id: userID,
      is_user_hidden: 0,
    },
  });
  if (!User) {
    // res.status(500).send({
    //   message: "User not found",
    // });
    return {};
  }
  if (User && User.is_user_deactivated == 1) {
    // res.status(500).send({
    //   message: "User Is deactivated",
    // });
    return {};
  }
  if (User && User.u_active != true) {
    // res.status(500).send({
    //   message: "User details not found",
    // });
    return {};
  }
  let [
    taskLevelTwoCount,
    tasklevelTwoDecline,
    taskLevelThreeCount,
    tasklevelThreeDecline,
  ] = [[], [], [], []];
  let [
    tasklevelTwoComplete,
    tasklevelThreeComplete,
    tasklevelTwoInComplete,
    tasklevelThreeInComplete,
  ] = [[], [], [], []];
  var taskLevelBrandTwoCount = {};
  var taskLevelBrandThreeCount = {};
  var tasklevelBrandTwoDecline = {};
  var tasklevelBrandThreeDecline = {};
  var tasklevelBrandTwoComplete = {};
  var tasklevelBrandThreeComplete = {};
  var tasklevelBrandTwoInComplete = {};
  var tasklevelBrandThreeInComplete = {};
  if (user_level_listing.length) {
    for (const user_level_key in user_level_listing) {
      var brand_id = user_level_listing[user_level_key].level_task.brand_id;
      var task_id = user_level_listing[user_level_key].task_id;
      if (user_level_listing[user_level_key].level_task.task_level == 2) {
        if (!taskLevelBrandTwoCount[brand_id]) {
          taskLevelBrandTwoCount[brand_id] = [];
        }
        taskLevelTwoCount.push(task_id);
        taskLevelBrandTwoCount[brand_id].push(task_id);
        if (user_level_listing[user_level_key].user_cta_action == 0) {
          // decline
          if (!tasklevelBrandTwoDecline[brand_id]) {
            tasklevelBrandTwoDecline[brand_id] = [];
          }
          tasklevelTwoDecline.push(task_id);
          tasklevelBrandTwoDecline[brand_id].push(task_id);
        } else if (user_level_listing[user_level_key].user_cta_action == 1) {
          // accept
          if (!tasklevelBrandTwoComplete[brand_id]) {
            tasklevelBrandTwoComplete[brand_id] = [];
          }
          tasklevelTwoComplete.push(task_id);
          tasklevelBrandTwoComplete[brand_id].push(task_id);
        }
        if (
          user_level_listing[user_level_key].user_cta_action == 1 &&
          user_level_listing[user_level_key].task_status == 0
        ) {
          if (!tasklevelBrandTwoInComplete[brand_id]) {
            tasklevelBrandTwoInComplete[brand_id] = [];
          }
          tasklevelTwoInComplete.push(task_id);
          tasklevelBrandTwoInComplete[brand_id].push(task_id);
        }
      } else if (
        user_level_listing[user_level_key].level_task.task_level == 3
      ) {
        if (!taskLevelBrandThreeCount[brand_id]) {
          taskLevelBrandThreeCount[brand_id] = [];
        }
        taskLevelThreeCount.push(task_id);
        taskLevelBrandThreeCount[brand_id].push(task_id);

        if (user_level_listing[user_level_key].user_cta_action == 0) {
          if (!tasklevelBrandThreeDecline[brand_id]) {
            tasklevelBrandThreeDecline[brand_id] = [];
          }
          tasklevelThreeDecline.push(task_id);
          tasklevelBrandThreeDecline[brand_id].push(task_id);
        } else if (user_level_listing[user_level_key].user_cta_action == 1) {
          // accept
          if (!tasklevelBrandThreeComplete[brand_id]) {
            tasklevelBrandThreeComplete[brand_id] = [];
          }
          tasklevelThreeComplete.push(task_id);
          tasklevelBrandThreeComplete[brand_id].push(task_id);
        }
        if (
          user_level_listing[user_level_key].user_cta_action == 1 &&
          user_level_listing[user_level_key].task_status == 0
        ) {
          if (!tasklevelBrandThreeInComplete[brand_id]) {
            tasklevelBrandThreeInComplete[brand_id] = [];
          }
          tasklevelThreeInComplete.push(task_id);
          tasklevelBrandThreeInComplete[brand_id].push(task_id);
        }
      }
    }

    User["dataValues"]["Tier 2 Sent"] = taskLevelTwoCount.length;
    User["dataValues"]["Tier 3 Sent"] = taskLevelThreeCount.length;
    User["dataValues"]["Tier 2 Incomplete"] = tasklevelTwoInComplete.length;
    User["dataValues"]["Tier 3 Incomplete"] = tasklevelThreeInComplete.length;
    User["dataValues"]["Tier 2 Completed"] = tasklevelTwoComplete.length;
    User["dataValues"]["Tier 3 Completed"] = tasklevelThreeComplete.length;
    User["dataValues"]["Tier 2 Declined"] = tasklevelTwoDecline.length;
    User["dataValues"]["Tier 3 Declined"] = tasklevelThreeDecline.length;
  }
  // return res.status(200).send({
  //     reward_given_listing: reward_given_listing
  // });
  var rewardBrandTokens = {};
  var rewardBrandStars = {};
  if (reward_given_listing.length) {
    var easterEgg = [];
    var present = [];
    var chest = [];
    var lotteryWheel = [];
    for (const reward_given_key in reward_given_listing) {
      var reward_listing = reward_given_listing[reward_given_key];
      if (!rewardBrandTokens[reward_listing.rewards_brand_id]) {
        rewardBrandTokens[reward_listing.rewards_brand_id] = [];
      }
      if (!rewardBrandStars[reward_listing.rewards_brand_id]) {
        rewardBrandStars[reward_listing.rewards_brand_id] = [];
      }
      rewardBrandTokens[reward_listing.rewards_brand_id].push(
        reward_listing.rewards_award_token
      );
      rewardBrandStars[reward_listing.rewards_brand_id].push(
        reward_listing.rewards_award_stars
      );
      if (reward_listing.reward_center != undefined) {
        if (reward_listing.reward_center.reward_center_reward_type == 0) {
          easterEgg.push(reward_listing.rewards_award_id);
        } else if (
          reward_listing.reward_center.reward_center_reward_type == 1
        ) {
          present.push(reward_listing.rewards_award_id);
        } else if (
          reward_listing.reward_center.reward_center_reward_type == 2
        ) {
          chest.push(reward_listing.rewards_award_id);
        } else if (
          reward_listing.reward_center.reward_center_reward_type == 3
        ) {
          lotteryWheel.push(reward_listing.rewards_award_id);
        }
      }
    }
    User["dataValues"]["Easter Eggs"] = easterEgg.length;
    User["dataValues"]["Presents Earned"] = present.length;
    User["dataValues"]["Chests Earned"] = chest.length;
    User["dataValues"]["Lottery Wheels"] = lotteryWheel.length;
  }
  var brandSurveyIds = {};
  if (survey_listing.length) {
    for (const survey_listing_Key in survey_listing) {
      const survey_brand_id =
        survey_listing[survey_listing_Key].dataValues.survey.sr_brand_id;
      if (!brandSurveyIds[survey_brand_id]) {
        brandSurveyIds[survey_brand_id] = [];
      }
      brandSurveyIds[survey_brand_id].push(survey_listing[survey_listing_Key]);
    }
  }
  if (User.user_content_posts.length) {
    let [taskIds, contestIds, contentData, brandIds, brandNames, brandData] = [
      [],
      [],
      [],
      [],
      [],
      [],
    ];
    var userContentPosts = User.user_content_posts;
    var brandContent = {};
    var brandTaskIds = {};
    var brandContestIds = {};
    var brandCommentData = {};

    userContentPosts.forEach((element) => {
      contentData.push(element.ta_task_id);
      if (!brandTaskIds[element.upcl_brand_details.id]) {
        brandTaskIds[element.upcl_brand_details.id] = [];
      }
      if (!brandContestIds[element.upcl_brand_details.id]) {
        brandContestIds[element.upcl_brand_details.id] = [];
      }
      if (element.ucpl_content_type == "1") {
        taskIds.push(element.ta_task_id);
        brandTaskIds[element.upcl_brand_details.id].push(element.ta_task_id);
      } else if (element.ucpl_content_type == 2) {
        contestIds.push(element.ta_task_id);
        brandContestIds[element.upcl_brand_details.id].push(element.ta_task_id);
      }
      if (element.upcl_brand_details) {
        brandIds.push(element.upcl_brand_details.id);
        brandNames.push(element.upcl_brand_details.name);
        brandData[element.upcl_brand_details.id] =
          element.upcl_brand_details.name;
      }
      if (!brandContent[element.upcl_brand_details.id]) {
        brandContent[element.upcl_brand_details.id] = [];
      }
      brandContent[element.upcl_brand_details.id].push(element);
      if (!brandCommentData[element.upcl_brand_details.id]) {
        brandCommentData[element.upcl_brand_details.id] = [];
      }
      if (element.post_comments.length) {
        brandCommentData[element.upcl_brand_details.id].push(
          element.post_comments
        );
      }
    });
    if (brandIds.length) {
      var brandUniqueIds = brandIds.filter((v, i, a) => a.indexOf(v) === i);
      User["dataValues"]["Number of Brands"] = brandUniqueIds.length;
      var brandDetail = {};
      for (const brandUniqueKey in brandUniqueIds) {
        var brand_id = brandUniqueIds[brandUniqueKey];
        var brand_name = brandData[brand_id];
        console.log(brand_name);
        brandDetail[brand_name] = {};
        brandDetail[brand_name]["Brand Id"] = brand_id;
        brandDetail[brand_name]["User Reach"] = 0;
        brandDetail[brand_name]["User Engagment Rate"] = brandCommentData[
          brand_id
        ][0]
          ? brandCommentData[brand_id][0].length
          : 0;
        brandDetail[brand_name]["last participated date"] =
          brandContent[brand_id][0]["ucpl_created_at"];
        brandDetail[brand_name]["Brand Shared"] = 0;
        brandDetail[brand_name]["Tokens Earned"] = rewardBrandTokens[brand_id]
          ? rewardBrandTokens[brand_id].reduce((a, b) => a + b, 0)
          : 0;
        brandDetail[brand_name]["Stars Earned"] = rewardBrandStars[brand_id]
          ? rewardBrandStars[brand_id].reduce((a, b) => a + b, 0)
          : 0;
        brandDetail[brand_name]["Brand Status"] = 0;
        brandDetail[brand_name]["Number Of Brand Task Enteries"] = 0;
        brandDetail[brand_name]["Number of Brand NOT Task Enteries"] = 0;
        brandDetail[brand_name]["Content Tasks Entered"] =
          brandContent[brand_id].length;
        brandDetail[brand_name]["Tasks Entered"] = 0;
        brandDetail[brand_name]["Contest Tasks Entered"] = 0;
        if (brandTaskIds[brand_id].length) {
          //var taskUniqueIds = brandTaskIds[brand_id].filter((v, i, a) => a.indexOf(v) === i);
          brandDetail[brand_name]["Tasks Entered"] =
            brandTaskIds[brand_id].length;
        }
        if (brandContestIds[brand_id].length) {
          //var brandContestUniqueIds = brandContestIds[brand_id].filter((v, i, a) => a.indexOf(v) === i);
          brandDetail[brand_name]["Contest Tasks Entered"] =
            brandContestIds[brand_id].length;
        }
        brandDetail[brand_name]["Surveys Questions tasks"] = brandSurveyIds[
          brand_id
        ]
          ? brandSurveyIds[brand_id].length
          : 0;
        brandDetail[brand_name]["Ads watched"] = videoAddIds[brand_id]
          ? videoAddIds[brand_id].length
          : 0;
        brandDetail[brand_name]["Tickets"] = 0;
        brandDetail[brand_name]["Bonuses Won"] = bonusRewardIds[brand_id]
          ? bonusRewardIds[brand_id].length
          : 0;
        brandDetail[brand_name]["bonus tasks incomplete"] =
          brandBonusTaskIncompleteIds[brand_id]
            ? brandBonusTaskIncompleteIds[brand_id].length
            : 0;
        brandDetail[brand_name]["Bonus task completed"] =
          brandBonusTaskCompleteIds[brand_id]
            ? brandBonusTaskCompleteIds[brand_id].length
            : 0;
        brandDetail[brand_name]["offers sent tier 2"] =
          taskLevelBrandTwoCount && taskLevelBrandTwoCount[brand_id]
            ? taskLevelBrandTwoCount[brand_id].length
            : 0;
        brandDetail[brand_name]["completed tier 2"] =
          tasklevelBrandTwoComplete && tasklevelBrandTwoComplete[brand_id]
            ? tasklevelBrandTwoComplete[brand_id].length
            : 0;
        brandDetail[brand_name]["accepted not completed tier 2"] =
          tasklevelBrandTwoInComplete && tasklevelBrandTwoInComplete[brand_id]
            ? tasklevelBrandTwoInComplete[brand_id].length
            : 0;
        brandDetail[brand_name]["not accepted tier 2 declined"] =
          tasklevelBrandTwoDecline[brand_id]
            ? tasklevelBrandTwoDecline[brand_id].length
            : 0;
        brandDetail[brand_name]["completed tier 3"] =
          tasklevelBrandThreeComplete[brand_id]
            ? tasklevelBrandThreeComplete[brand_id].length
            : 0;
        brandDetail[brand_name]["offers sent tier 3"] =
          taskLevelBrandThreeCount[brand_id]
            ? taskLevelBrandThreeCount[brand_id].length
            : 0;
        brandDetail[brand_name]["accepted not completed tier 3"] =
          tasklevelBrandThreeInComplete[brand_id]
            ? tasklevelBrandThreeInComplete[brand_id].length
            : 0;
        brandDetail[brand_name]["not accepted tier 3 declined"] =
          tasklevelBrandThreeDecline[brand_id]
            ? tasklevelBrandThreeDecline[brand_id].length
            : 0;
      }
      console.log(brandDetail);
      User["dataValues"]["brands"] = brandDetail;
    }
    let totalBrands = Object.keys(brandDetail);
    let totalTokensEarned = 0,
      totalStarsEarned = 0,
      totalUserReach = 0,
      totalEngagementRate = 0;
    if (Object.keys(brandDetail) > 0) {
      for (let brandName in brandDetail) {
        totalTokensEarned += brandDetail[brandName]["Tokens Earned"];
        totalStarsEarned += brandDetail[brandName]["Stars Earned"];

        totalUserReach += brandDetail[brandName]["User Reach"];
        totalEngagementRate += brandDetail[brandName]["User Engagment Rate"];
      }
    }
    User["dataValues"]["total Tokens Earned"] = totalTokensEarned;
    User["dataValues"]["totalTokensEarned"] = totalStarsEarned;
    User["dataValues"]["totalUserReach"] = totalUserReach;
    User["dataValues"]["averageEngagementRate"] =
      totalEngagementRate > 0 && totalBrands > 0
        ? totalEngagementRate / totalBrands
        : 0;
    if (brandNames.length) {
      var brandUniqueNames = brandNames.filter((v, i, a) => a.indexOf(v) === i);
      User["dataValues"]["Brands Participated"] = brandUniqueNames;
    }
    if (taskIds.length) {
      //var taskUniqueIds = taskIds.filter((v, i, a) => a.indexOf(v) === i);
      User["dataValues"]["Tasks Entered"] = taskIds.length;
    }
    if (contestIds.length) {
      //var contestUniqueIds = contestIds.filter((v, i, a) => a.indexOf(v) === i);
      User["dataValues"]["Contests Entered"] = contestIds.length;
    }
    if (contentData.length) {
      User["dataValues"]["Content Entered"] = contentData.length;
    }
  }
  // delete User["dataValues"]["user_content_posts"];
  return User;
};
const fetchCmsDetails = async (userID) => {
  try {
    var level_options = {
      include: [
        {
          model: db.level_task,
        },
      ],
      where: {
        task_user_id: userID,
      },
    };
    const user_level_listing = await db.user_level_task_action.findAll(
      level_options
    );

    var video_add_options = {
      include: [
        {
          model: db.watch_ads_task,
        },
      ],
      where: {
        u_id: userID,
      },
    };
    const video_add_listing = await db.watch_ads_task_submit.findAll(
      video_add_options
    );
    var videoAddIds = {};
    if (video_add_listing.length) {
      video_add_listing.forEach((element) => {
        if (!videoAddIds[element.video_ad.cr_co_id]) {
          videoAddIds[element.video_ad.cr_co_id] = [];
        }
        videoAddIds[element.video_ad.cr_co_id].push(element);
      });
    }
    var bonus_reward_options = {
      include: [
        {
          model: db.bonus_item,
        },
      ],
      where: {
        bonus_rewards_usrid: userID,
      },
    };
    const bonus_rewards_listing = await db.bonus_rewards.findAll(
      bonus_reward_options
    );
    var bonusRewardIds = {};
    if (bonus_rewards_listing.length) {
      bonus_rewards_listing.forEach((element) => {
        if (!bonusRewardIds[element.bonus_item.bonus_item_brand_id]) {
          bonusRewardIds[element.bonus_item.bonus_item_brand_id] = [];
        }
        bonusRewardIds[element.bonus_item.bonus_item_brand_id].push(element);
      });
    }

    var survey_options = {
      include: [
        {
          model: db.survey,
          attributes: ["sr_id", "sr_brand_id"],
        },
      ],
      attributes: ["sr_id", "sr_completed"],
      where: {
        sr_uid: userID,
      },
    };
    const survey_listing = await db.survey_user_complete.findAll(
      survey_options
    );

    var bonus_task_options = {
      where: {
        bonus_task_usr_id: userID,
      },
    };
    const bonus_task_listing = await db.bonus_task.findAll(bonus_task_options);
    var brandBonusTaskIncompleteIds = {};
    var brandBonusTaskCompleteIds = {};
    if (bonus_task_listing.length) {
      bonus_task_listing.forEach((element) => {
        if (!brandBonusTaskIncompleteIds[element.bonus_task_brand_id]) {
          brandBonusTaskIncompleteIds[element.bonus_task_brand_id] = [];
        }
        if (!brandBonusTaskCompleteIds[element.bonus_task_brand_id]) {
          brandBonusTaskCompleteIds[element.bonus_task_brand_id] = [];
        }
        if (element.bonus_task_is_finished == "1") {
          brandBonusTaskCompleteIds[element.bonus_task_brand_id].push(element);
        } else {
          brandBonusTaskIncompleteIds[element.bonus_task_brand_id].push(
            element
          );
        }
      });
    }
    var reward_given_options = {
      include: [
        {
          model: db.reward_center,
        },
      ],
      where: {
        rewards_award_user_id: userID,
      },
    };
    const reward_given_listing = await db.rewards_given.findAll(
      reward_given_options
    );

    const User = await Users.findOne({
      include: [
        {
          model: db.user_content_post,
          attributes: [
            "ucpl_content_data",
            ["ucpl_id", "post_id"],
            "ta_task_id",
            "ucpl_content_type",
            "upcl_brand_details",
            "ucpl_created_at",
          ],
          required: false,
          include: [
            {
              model: db.post_comment,
              required: false,
              where: {
                pc_commenter_uid: {
                  [Op.not]: userID,
                },
              },
            },
          ],
          where: {
            ucpl_status: 1,
          },
          // limit: pageSize,
          // offset: skipCount,
          order: [["ucpl_id", "DESC"]],
        },
      ],
      attributes: [
        "u_id",
        "u_login",
        "u_referer_id",
        "u_acct_type",
        "u_act_sec",
        "u_email",
        "u_active",
        "u_pref_login",
        "u_created_at",
        "u_updated_at",
        "u_email_verify_status",
        "is_user_deactivated",
        "is_user_hidden",
        //[db.sequelize.literal('(SELECT SUM(bonus_usr_riddim_level) FROM bonus_usr WHERE bonus_usr.bonus_usr_id = '+userID+'  )'), 'Riddim Level'],
        [db.sequelize.literal("0"), "Tickets Earned"],
        [db.sequelize.literal("0"), "Presents Earned"],
        [db.sequelize.literal("0"), "Lottery Wheels"],
        [db.sequelize.literal("0"), "Easter Eggs"],
        [db.sequelize.literal("0"), "Chests Earned"],
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM bonus_rewards WHERE bonus_rewards.bonus_rewards_usrid = " +
              userID +
              ")"
          ),
          "Bonuses Won",
        ],
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM bonus_task WHERE bonus_task.bonus_task_usr_id = " +
              userID +
              " and bonus_task_is_finished = 1 )"
          ),
          "Bonus Tasks Completed",
        ],
        [db.sequelize.literal("0"), "Tasks Entered"],
        [db.sequelize.literal("0"), "Contests Entered"],
        [db.sequelize.literal("0"), "Content Entered"],
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM survey_user_complete WHERE survey_user_complete.sr_uid = " +
              userID +
              ")"
          ),
          "Surveys",
        ],
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM user_fan_following WHERE user_fan_following.faf_by = " +
              userID +
              ")"
          ),
          "Following",
        ],
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM user_fan_following WHERE user_fan_following.faf_to = " +
              userID +
              ")"
          ),
          "Followers",
        ],
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM watch_ads_task_submit WHERE watch_ads_task_submit.u_id = " +
              userID +
              " and watch_ads_task_submit.u_id = user_login.u_id )"
          ),
          "Ads Watched",
        ],
        [
          db.sequelize.literal(
            "(SELECT SUM(pc_comment_likes) FROM post_comment WHERE post_comment.pc_commenter_uid = " +
              userID +
              "  )"
          ),
          "Liked Comments",
        ],
        [
          db.sequelize.literal(
            "(SELECT SUM(pc_comment_unlikes) FROM post_comment WHERE post_comment.pc_commenter_uid = " +
              userID +
              "  )"
          ),
          "Disliked Comments",
        ],
        [
          db.sequelize.literal(
            "(SELECT SUM(ucpl_reaction_counter) FROM user_content_post WHERE user_content_post.ucpl_u_id = " +
              userID +
              "  )"
          ),
          "Reactions Received",
        ],
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM post_user_reactions WHERE post_user_reactions.u_id = " +
              userID +
              ")"
          ),
          "Reactions Given",
        ],
        [
          db.sequelize.literal(
            "(SELECT COUNT(*) FROM content_report WHERE content_report.content_report_owner_id = " +
              userID +
              ")"
          ),
          "Reported Content",
        ],
        [db.sequelize.literal("0"), "Number of Brands"],
        [db.sequelize.literal("0"), "Tier 2 Sent"],
        [db.sequelize.literal("0"), "Tier 2 Incomplete"],
        [db.sequelize.literal("0"), "Tier 2 Declined"],
        [db.sequelize.literal("0"), "Tier 2 Completed"],
        [db.sequelize.literal("0"), "Tier 3 Completed"],
        [db.sequelize.literal("0"), "Tier 3 Sent"],
        [db.sequelize.literal("0"), "Tier 3 Incomplete"],
        [db.sequelize.literal("0"), "Tier 3 Declined"],
        [db.sequelize.literal("0"), "Tier 3 Completed"],
        [db.sequelize.literal("null"), "Brands Participated"],
      ],
      where: {
        u_id: userID,
        is_user_hidden: 0,
      },
    });
    if (!User) {
      // res.status(500).send({
      //   message: "User not found",
      // });
      return {};
    }
    if (User && User.is_user_deactivated == 1) {
      // res.status(500).send({
      //   message: "User Is deactivated",
      // });
      return {};
    }
    if (User && User.u_active != true) {
      // res.status(500).send({
      //   message: "User details not found",
      // });
      return {};
    }
    let [
      taskLevelTwoCount,
      tasklevelTwoDecline,
      taskLevelThreeCount,
      tasklevelThreeDecline,
    ] = [[], [], [], []];
    let [
      tasklevelTwoComplete,
      tasklevelThreeComplete,
      tasklevelTwoInComplete,
      tasklevelThreeInComplete,
    ] = [[], [], [], []];
    var taskLevelBrandTwoCount = {};
    var taskLevelBrandThreeCount = {};
    var tasklevelBrandTwoDecline = {};
    var tasklevelBrandThreeDecline = {};
    var tasklevelBrandTwoComplete = {};
    var tasklevelBrandThreeComplete = {};
    var tasklevelBrandTwoInComplete = {};
    var tasklevelBrandThreeInComplete = {};
    if (user_level_listing.length) {
      for (const user_level_key in user_level_listing) {
        var brand_id = user_level_listing[user_level_key].level_task.brand_id;
        var task_id = user_level_listing[user_level_key].task_id;
        if (user_level_listing[user_level_key].level_task.task_level == 2) {
          if (!taskLevelBrandTwoCount[brand_id]) {
            taskLevelBrandTwoCount[brand_id] = [];
          }
          taskLevelTwoCount.push(task_id);
          taskLevelBrandTwoCount[brand_id].push(task_id);
          if (user_level_listing[user_level_key].user_cta_action == 0) {
            // decline
            if (!tasklevelBrandTwoDecline[brand_id]) {
              tasklevelBrandTwoDecline[brand_id] = [];
            }
            tasklevelTwoDecline.push(task_id);
            tasklevelBrandTwoDecline[brand_id].push(task_id);
          } else if (user_level_listing[user_level_key].user_cta_action == 1) {
            // accept
            if (!tasklevelBrandTwoComplete[brand_id]) {
              tasklevelBrandTwoComplete[brand_id] = [];
            }
            tasklevelTwoComplete.push(task_id);
            tasklevelBrandTwoComplete[brand_id].push(task_id);
          }
          if (
            user_level_listing[user_level_key].user_cta_action == 1 &&
            user_level_listing[user_level_key].task_status == 0
          ) {
            if (!tasklevelBrandTwoInComplete[brand_id]) {
              tasklevelBrandTwoInComplete[brand_id] = [];
            }
            tasklevelTwoInComplete.push(task_id);
            tasklevelBrandTwoInComplete[brand_id].push(task_id);
          }
        } else if (
          user_level_listing[user_level_key].level_task.task_level == 3
        ) {
          if (!taskLevelBrandThreeCount[brand_id]) {
            taskLevelBrandThreeCount[brand_id] = [];
          }
          taskLevelThreeCount.push(task_id);
          taskLevelBrandThreeCount[brand_id].push(task_id);

          if (user_level_listing[user_level_key].user_cta_action == 0) {
            if (!tasklevelBrandThreeDecline[brand_id]) {
              tasklevelBrandThreeDecline[brand_id] = [];
            }
            tasklevelThreeDecline.push(task_id);
            tasklevelBrandThreeDecline[brand_id].push(task_id);
          } else if (user_level_listing[user_level_key].user_cta_action == 1) {
            // accept
            if (!tasklevelBrandThreeComplete[brand_id]) {
              tasklevelBrandThreeComplete[brand_id] = [];
            }
            tasklevelThreeComplete.push(task_id);
            tasklevelBrandThreeComplete[brand_id].push(task_id);
          }
          if (
            user_level_listing[user_level_key].user_cta_action == 1 &&
            user_level_listing[user_level_key].task_status == 0
          ) {
            if (!tasklevelBrandThreeInComplete[brand_id]) {
              tasklevelBrandThreeInComplete[brand_id] = [];
            }
            tasklevelThreeInComplete.push(task_id);
            tasklevelBrandThreeInComplete[brand_id].push(task_id);
          }
        }
      }

      User["dataValues"]["Tier 2 Sent"] = taskLevelTwoCount.length;
      User["dataValues"]["Tier 3 Sent"] = taskLevelThreeCount.length;
      User["dataValues"]["Tier 2 Incomplete"] = tasklevelTwoInComplete.length;
      User["dataValues"]["Tier 3 Incomplete"] = tasklevelThreeInComplete.length;
      User["dataValues"]["Tier 2 Completed"] = tasklevelTwoComplete.length;
      User["dataValues"]["Tier 3 Completed"] = tasklevelThreeComplete.length;
      User["dataValues"]["Tier 2 Declined"] = tasklevelTwoDecline.length;
      User["dataValues"]["Tier 3 Declined"] = tasklevelThreeDecline.length;
    }
    // return res.status(200).send({
    //     reward_given_listing: reward_given_listing
    // });
    var rewardBrandTokens = {};
    var rewardBrandStars = {};
    if (reward_given_listing.length) {
      var easterEgg = [];
      var present = [];
      var chest = [];
      var lotteryWheel = [];
      for (const reward_given_key in reward_given_listing) {
        var reward_listing = reward_given_listing[reward_given_key];
        if (!rewardBrandTokens[reward_listing.rewards_brand_id]) {
          rewardBrandTokens[reward_listing.rewards_brand_id] = [];
        }
        if (!rewardBrandStars[reward_listing.rewards_brand_id]) {
          rewardBrandStars[reward_listing.rewards_brand_id] = [];
        }
        rewardBrandTokens[reward_listing.rewards_brand_id].push(
          reward_listing.rewards_award_token
        );
        rewardBrandStars[reward_listing.rewards_brand_id].push(
          reward_listing.rewards_award_stars
        );
        if (reward_listing.reward_center != undefined) {
          if (reward_listing.reward_center.reward_center_reward_type == 0) {
            easterEgg.push(reward_listing.rewards_award_id);
          } else if (
            reward_listing.reward_center.reward_center_reward_type == 1
          ) {
            present.push(reward_listing.rewards_award_id);
          } else if (
            reward_listing.reward_center.reward_center_reward_type == 2
          ) {
            chest.push(reward_listing.rewards_award_id);
          } else if (
            reward_listing.reward_center.reward_center_reward_type == 3
          ) {
            lotteryWheel.push(reward_listing.rewards_award_id);
          }
        }
      }
      User["dataValues"]["Easter Eggs"] = easterEgg.length;
      User["dataValues"]["Presents Earned"] = present.length;
      User["dataValues"]["Chests Earned"] = chest.length;
      User["dataValues"]["Lottery Wheels"] = lotteryWheel.length;
    }
    var brandSurveyIds = {};
    if (survey_listing.length) {
      for (const survey_listing_Key in survey_listing) {
        const survey_brand_id =
          survey_listing[survey_listing_Key].dataValues.survey.sr_brand_id;
        if (!brandSurveyIds[survey_brand_id]) {
          brandSurveyIds[survey_brand_id] = [];
        }
        brandSurveyIds[survey_brand_id].push(
          survey_listing[survey_listing_Key]
        );
      }
    }
    if (User.user_content_posts.length) {
      let [taskIds, contestIds, contentData, brandIds, brandNames, brandData] =
        [[], [], [], [], [], []];
      var userContentPosts = User.user_content_posts;
      var brandContent = {};
      var brandTaskIds = {};
      var brandContestIds = {};
      var brandCommentData = {};

      userContentPosts.forEach((element) => {
        contentData.push(element.ta_task_id);
        if (!brandTaskIds[element.upcl_brand_details.id]) {
          brandTaskIds[element.upcl_brand_details.id] = [];
        }
        if (!brandContestIds[element.upcl_brand_details.id]) {
          brandContestIds[element.upcl_brand_details.id] = [];
        }
        if (element.ucpl_content_type == "1") {
          taskIds.push(element.ta_task_id);
          brandTaskIds[element.upcl_brand_details.id].push(element.ta_task_id);
        } else if (element.ucpl_content_type == 2) {
          contestIds.push(element.ta_task_id);
          brandContestIds[element.upcl_brand_details.id].push(
            element.ta_task_id
          );
        }
        if (element.upcl_brand_details) {
          brandIds.push(element.upcl_brand_details.id);
          brandNames.push(element.upcl_brand_details.name);
          brandData[element.upcl_brand_details.id] =
            element.upcl_brand_details.name;
        }
        if (!brandContent[element.upcl_brand_details.id]) {
          brandContent[element.upcl_brand_details.id] = [];
        }
        brandContent[element.upcl_brand_details.id].push(element);
        if (!brandCommentData[element.upcl_brand_details.id]) {
          brandCommentData[element.upcl_brand_details.id] = [];
        }
        if (element.post_comments.length) {
          brandCommentData[element.upcl_brand_details.id].push(
            element.post_comments
          );
        }
      });
      if (brandIds.length) {
        var brandUniqueIds = brandIds.filter((v, i, a) => a.indexOf(v) === i);
        User["dataValues"]["Number of Brands"] = brandUniqueIds.length;
        var brandDetail = {};
        for (const brandUniqueKey in brandUniqueIds) {
          var brand_id = brandUniqueIds[brandUniqueKey];
          var brand_name = brandData[brand_id];
          console.log(brand_name);
          brandDetail[brand_name] = {};
          brandDetail[brand_name]["Brand Id"] = brand_id;
          brandDetail[brand_name]["User Reach"] = 0;
          brandDetail[brand_name]["User Engagment Rate"] = brandCommentData[
            brand_id
          ][0]
            ? brandCommentData[brand_id][0].length
            : 0;
          brandDetail[brand_name]["last participated date"] =
            brandContent[brand_id][0]["ucpl_created_at"];
          brandDetail[brand_name]["Brand Shared"] = 0;
          brandDetail[brand_name]["Tokens Earned"] = rewardBrandTokens[brand_id]
            ? rewardBrandTokens[brand_id].reduce((a, b) => a + b, 0)
            : 0;
          brandDetail[brand_name]["Stars Earned"] = rewardBrandStars[brand_id]
            ? rewardBrandStars[brand_id].reduce((a, b) => a + b, 0)
            : 0;
          brandDetail[brand_name]["Brand Status"] = 0;
          brandDetail[brand_name]["Number Of Brand Task Enteries"] = 0;
          brandDetail[brand_name]["Number of Brand NOT Task Enteries"] = 0;
          brandDetail[brand_name]["Content Tasks Entered"] =
            brandContent[brand_id].length;
          brandDetail[brand_name]["Tasks Entered"] = 0;
          brandDetail[brand_name]["Contest Tasks Entered"] = 0;
          if (brandTaskIds[brand_id].length) {
            //var taskUniqueIds = brandTaskIds[brand_id].filter((v, i, a) => a.indexOf(v) === i);
            brandDetail[brand_name]["Tasks Entered"] =
              brandTaskIds[brand_id].length;
          }
          if (brandContestIds[brand_id].length) {
            //var brandContestUniqueIds = brandContestIds[brand_id].filter((v, i, a) => a.indexOf(v) === i);
            brandDetail[brand_name]["Contest Tasks Entered"] =
              brandContestIds[brand_id].length;
          }
          brandDetail[brand_name]["Surveys Questions tasks"] = brandSurveyIds[
            brand_id
          ]
            ? brandSurveyIds[brand_id].length
            : 0;
          brandDetail[brand_name]["Ads watched"] = videoAddIds[brand_id]
            ? videoAddIds[brand_id].length
            : 0;
          brandDetail[brand_name]["Tickets"] = 0;
          brandDetail[brand_name]["Bonuses Won"] = bonusRewardIds[brand_id]
            ? bonusRewardIds[brand_id].length
            : 0;
          brandDetail[brand_name]["bonus tasks incomplete"] =
            brandBonusTaskIncompleteIds[brand_id]
              ? brandBonusTaskIncompleteIds[brand_id].length
              : 0;
          brandDetail[brand_name]["Bonus task completed"] =
            brandBonusTaskCompleteIds[brand_id]
              ? brandBonusTaskCompleteIds[brand_id].length
              : 0;
          brandDetail[brand_name]["offers sent tier 2"] =
            taskLevelBrandTwoCount && taskLevelBrandTwoCount[brand_id]
              ? taskLevelBrandTwoCount[brand_id].length
              : 0;
          brandDetail[brand_name]["completed tier 2"] =
            tasklevelBrandTwoComplete && tasklevelBrandTwoComplete[brand_id]
              ? tasklevelBrandTwoComplete[brand_id].length
              : 0;
          brandDetail[brand_name]["accepted not completed tier 2"] =
            tasklevelBrandTwoInComplete && tasklevelBrandTwoInComplete[brand_id]
              ? tasklevelBrandTwoInComplete[brand_id].length
              : 0;
          brandDetail[brand_name]["not accepted tier 2 declined"] =
            tasklevelBrandTwoDecline[brand_id]
              ? tasklevelBrandTwoDecline[brand_id].length
              : 0;
          brandDetail[brand_name]["completed tier 3"] =
            tasklevelBrandThreeComplete[brand_id]
              ? tasklevelBrandThreeComplete[brand_id].length
              : 0;
          brandDetail[brand_name]["offers sent tier 3"] =
            taskLevelBrandThreeCount[brand_id]
              ? taskLevelBrandThreeCount[brand_id].length
              : 0;
          brandDetail[brand_name]["accepted not completed tier 3"] =
            tasklevelBrandThreeInComplete[brand_id]
              ? tasklevelBrandThreeInComplete[brand_id].length
              : 0;
          brandDetail[brand_name]["not accepted tier 3 declined"] =
            tasklevelBrandThreeDecline[brand_id]
              ? tasklevelBrandThreeDecline[brand_id].length
              : 0;
        }
        console.log(brandDetail);
        User["dataValues"]["brands"] = brandDetail;
      }
      let totalBrands = Object.keys(brandDetail);
      let totalTokensEarned = 0,
        totalStarsEarned = 0,
        totalUserReach = 0,
        totalEngagementRate = 0;
      if (Object.keys(brandDetail) > 0) {
        for (let brandName in brandDetail) {
          totalTokensEarned += brandDetail[brandName]["Tokens Earned"];
          totalStarsEarned += brandDetail[brandName]["Stars Earned"];

          totalUserReach += brandDetail[brandName]["User Reach"];
          totalEngagementRate += brandDetail[brandName]["User Engagment Rate"];
        }
      }
      User["dataValues"]["total Tokens Earned"] = totalTokensEarned;
      User["dataValues"]["totalTokensEarned"] = totalStarsEarned;
      User["dataValues"]["totalUserReach"] = totalUserReach;
      User["dataValues"]["averageEngagementRate"] =
        totalEngagementRate > 0 && totalBrands > 0
          ? totalEngagementRate / totalBrands
          : 0;
      if (brandNames.length) {
        var brandUniqueNames = brandNames.filter(
          (v, i, a) => a.indexOf(v) === i
        );
        User["dataValues"]["Brands Participated"] = brandUniqueNames;
      }
      if (taskIds.length) {
        //var taskUniqueIds = taskIds.filter((v, i, a) => a.indexOf(v) === i);
        User["dataValues"]["Tasks Entered"] = taskIds.length;
      }
      if (contestIds.length) {
        //var contestUniqueIds = contestIds.filter((v, i, a) => a.indexOf(v) === i);
        User["dataValues"]["Contests Entered"] = contestIds.length;
      }
      if (contentData.length) {
        User["dataValues"]["Content Entered"] = contentData.length;
      }
    }
    delete User["dataValues"]["user_content_posts"];
    return User;
  } catch (error) {
    console.error("Failed to fetch CMS details ,", error);
    return {};
  }
};

exports.createNewUserOld = async (req, res) => {
  const body = req.body;

  let {
    username,
    display_name,
    first_name,
    last_name,
    password,
    email,
    date_of_birth,
    phonenumber,
    facebook_handle = [],
    twiter_handle: [],
    pinterest_handle = [],
    instagram_handle = [],
    tiktok_handle = [],
    snapchat_handle = [],
    status,
    user_type,
    referer_id,
    address,
    city,
    postal_code,
    state,
    country,
  } = req.body;
  console.log(body);
  var login_type = user_type || "Normal";
  if (login_type == "Instagram") {
    const UserDetails = await Users.findOne({
      where: {
        u_instagram_id: req.body["Instagram id"],
      },
      attributes: ["u_id"],
    });
    if (UserDetails) {
      const existingUser = await Users.findOne({
        include: [
          {
            model: db.user_profile,
          },
          {
            model: db.user_social_ext,
          },
          {
            model: db.user_content_post,
            attributes: ["ta_task_id"],
            where: {
              ucpl_status: `1`,
            },
            required: false,
          },
        ],
        attributes: [
          "u_id",
          "u_referer_id",
          "u_acct_type",
          "u_act_sec",
          "u_email",
          "u_active",
          "u_fb_username",
          "u_fb_id",
          "u_gmail_username",
          "u_gmail_id",
          "u_ymail_username",
          "u_ymail_id",
          "u_pref_login",
          "u_instagram_username",
          "u_instagram_id",
          "u_created_at",
          "u_updated_at",
          "u_email_verify_status",
        ],
        where: {
          u_id: UserDetails.u_id,
        },
      });
      res.status(200).send({
        message: "Already Registered",
        data: existingUser,
        access_token: common.generateToken(UserDetails.u_id),
        media_token: common.imageToken(UserDetails.u_id),
      });
      return;
    }
  }
  if (login_type == "Normal" || login_type == "Gmail") {
    const UserDetails = await Users.findOne({
      where: {
        u_email: req.body["email"].toLowerCase(),
      },
    });
    if (UserDetails) {
      res.status(200).send({
        message: "Already Registered",
      });
      return;
    }
  }
  if (login_type == "Ymail") {
    const UserDetails = await Users.findOne({
      where: {
        u_ymail_id: req.body["Ymail id"],
      },
    });
    if (UserDetails) {
      res.status(200).send({
        message: "Already Registered",
      });
      return;
    }
  }
  const template = await mail_templates.findOne({
    where: {
      mt_name: "verify_email",
    },
  });

  const UserDetails = await Users.findOne({
    where: {
      [Op.or]: [
        {
          u_login: req.body["username"].toLowerCase(),
        },
        {
          u_login: req.body["username"],
        },
      ],
    },
  });
  if (UserDetails) {
    res.status(400).send({
      message: "Username Already Exist",
    });
    return;
  }

  const data = {
    u_acct_type: body.hasOwnProperty("Account type")
      ? req.body["Account type"]
      : 0,
    u_referer_id: body.hasOwnProperty("referer_id")
      ? req.body["referer_id"]
      : 0,
    u_display_name: body.hasOwnProperty("display_name")
      ? req.body["display_name"]
      : "",
    u_first_name: body.hasOwnProperty("first_name")
      ? req.body["first_name"]
      : "",
    u_last_name: body.hasOwnProperty("last_name") ? req.body["last_name"] : "",

    u_act_sec: body.hasOwnProperty("User act sec")
      ? req.body["User act sec"]
      : 0,
    u_login: body.hasOwnProperty("username")
      ? req.body["username"].toLowerCase()
      : "",
    u_pass: body.hasOwnProperty("password") ? req.body["password"] : login_type,
    u_email: req.body["email"] ? req.body["email"].toLowerCase() : "",
    au_salt: Users.generateSalt(),
    u_active: body.hasOwnProperty("status") ? req.body["status"] : true,
    u_social_handle: social_media_handle,
    u_fb_username: body.hasOwnProperty("User fb name")
      ? req.body["User fb name"]
      : "",
    u_facebook_handle: body.hasOwnProperty("facebook_handle")
      ? req.body["facebook_handle"]
      : [],
    u_instagram_handle: body.hasOwnProperty("instagram_handle")
      ? req.body["instagram_handle"]
      : [],
    u_tiktok_handle: body.hasOwnProperty("tiktok_handle")
      ? req.body["tiktok_handle"]
      : [],
    u_twitter_handle: body.hasOwnProperty("twitter_handle")
      ? req.body["twitter_handle"]
      : [],
    u_snapchat_handle: body.hasOwnProperty("snapchat_handle")
      ? req.body["snapchat_handle"]
      : [],
    u_pinterest_handle: body.hasOwnProperty("pinterest_handle")
      ? req.body["pinterest_handle"]
      : [],
    u_date_of_birth: body.hasOwnProperty("date_of_birth")
      ? req.body["date_of_birth"]
      : "",

    // u_fb_id: body.hasOwnProperty("Fb id") ? req.body["Fb id"] : "",
    // u_gmail_username: body.hasOwnProperty("User gmail name")
    //   ? req.body["User gmail name"]
    //   : "",
    // u_gmail_id: body.hasOwnProperty("Gmail id") ? req.body["Gmail id"] : "",
    // u_ymail_username: body.hasOwnProperty("User ymail name")
    //   ? req.body["User ymail name"]
    //   : "",
    // u_ymail_id: body.hasOwnProperty("Ymail id") ? req.body["Ymail id"] : "",
    // u_pref_login: body.hasOwnProperty("User pref login")
    //   ? req.body["User pref login"]
    //   : 0,
    // u_instagram_username: body.hasOwnProperty("User instagram name")
    //   ? req.body["User instagram name"]
    //   : "",
    // u_instagram_id: body.hasOwnProperty("Instagram id")
    //   ? req.body["Instagram id"]
    //   : "",
  };
  Users.create(data)
    .then((data) => {
      accountBalance.create({
        ac_user_id: data.u_id,
        ac_balance: 0,
        ac_balance_stars: 0,
        ac_account_no: "",
      });
      User_profile.create({ u_id: data.u_id });
      User_social_ext.create({
        use_u_instagram_link: body.hasOwnProperty("User instagram name")
          ? "https://www.instagram.com/" + req.body["User instagram name"]
          : "",
        use_u_facebook_link: body.hasOwnProperty("User fb name")
          ? "https://www.facebook.com/" + req.body["User fb name"]
          : "",
        show_facebook: body.hasOwnProperty("User fb name") ? true : false,
        show_instagram: body.hasOwnProperty("User instagram name")
          ? true
          : false,
        u_id: data.u_id,
      });
      audit_log.saveAuditLog(
        data.u_id,
        "add",
        "user_login",
        data.u_id,
        data.dataValues
      );
      if (req.body["email"]) {
        try {
          const encryptedID = cryptr.encrypt(data.u_id);
          const vlink =
            process.env.SITE_API_URL + "users/verify_email/" + encryptedID;
          var templateBody = template.mt_body;
          templateBody = templateBody.replace("[CNAME]", req.body["email"]);
          templateBody = templateBody.replace("[VLINK]", vlink);
          const message = {
            from: "Socialbrands1@gmail.com",
            to: req.body["email"],
            subject: template.mt_subject,
            html: templateBody,
          };
          mailer.sendMail(message);
        } catch (error) {
          console.log(error);
        }
      }
      res.status(201).send({
        message: "User Added Successfully",
        user_details: data,
        access_token: common.generateToken(data.u_id),
        media_token: common.imageToken(data.u_id),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};
/**
 * Function to get all admin Role
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.listing = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.pageSize || 0);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || "u_id";
    const sortOrder = req.query.sortOrder || "DESC";
    const sortVal = req.query.sortVal;
    let searchString = req.query.searchString || "";
    searchString = searchString
      ? typeof parseInt(searchString, 10) === "number"
        ? searchString
        : searchString.toLowerCase()
      : "";

    var UserId = req.header(process.env.UKEY_HEADER || "x-api-key");
    const contentUserIds = await common.getContentReportUser(["User"], UserId);
    const contentUserIdsValues = contentUserIds.map(function (item) {
      return item.content_report_type_id;
    });
    let options = {
      include: [
        {
          model: db.user_profile,
        },
        {
          model: db.user_content_post,
          attributes: ["ucpl_id"],
          required: false,
          where: {
            ucpl_status: 1,
          },
        },
      ],
      // limit: pageSize,
      // offset: skipCount,
      order: [[sortBy, sortOrder]],
      attributes: [
        "u_id",
        "u_referer_id",
        "u_acct_type",
        "u_act_sec",
        "u_email",
        "u_active",
        "u_login",
        "u_fb_username",
        "u_fb_id",
        "u_gmail_username",
        "u_gmail_id",
        "u_ymail_username",
        "u_ymail_id",
        "u_pref_login",
        "u_instagram_username",
        "u_instagram_id",
        "u_created_at",
        "u_updated_at",
        "u_email_verify_status",
        "is_user_deactivated",
        "is_user_hidden",
      ],
      where: {
        u_active: true,
      },
    };
    // Search string pagination by u_id , name
    if (searchString) {
      options.include[0].where = {
        [Op.or]: [
          {
            u_id: {
              [Op.eq]:
                typeof searchString === "number" ? parseInt(searchString) : 0,
            },
          },
          {
            u_f_name: {
              [Op.like]: `%${searchString.toLowerCase()}%`,
            },
          },
          {
            u_l_name: {
              [Op.like]: `%${searchString}%`,
            },
          },
          {
            u_display_name: {
              [Op.like]: `%${searchString}%`,
            },
          },
          {
            u_profile_name: {
              [Op.like]: `%${searchString}%`,
            },
          },
        ],
      };
    }
    if (pageSize > 0) {
      options = { ...options, limit: pageSize, offset: skipCount };
    }
    if (sortVal) {
      var sortValue = sortVal.trim();
      options.where = {
        [sortBy]: {
          [Op.like]: `%${sortValue}%`,
        },
      };
    }
    /* do not get users which are reported by someone */
    if (contentUserIdsValues.length) {
      options["where"]["u_id"] = {
        [Op.not]: contentUserIdsValues,
      };
    }
    options["where"]["is_autotakedown"] = 0;
    options["where"]["is_user_deactivated"] = 0;
    options["where"]["is_user_hidden"] = 0;
    var total = await Users.count({
      where: options["where"],
    });

    console.log(options.include[0]);
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
      totalRecords: total,
    });
  } catch (error) {
    console.log("Failed to fetch user list ", error.message);
    res.status(400).send({
      error: error.message,
      data: [],
      totalRecords: 0,
    });
  }
};
exports.listingv3 = async (req, res) => {
  // try {
  const pageSize = parseInt(req.query.pageSize || 0);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = req.query.sortBy || "u_id";
  const sortOrder = req.query.sortOrder || "DESC";
  const sortVal = req.query.sortVal;
  const searchString = req.query.userName;

  var UserId = req.header(process.env.UKEY_HEADER || "x-api-key");
  const contentUserIds = await common.getContentReportUser(["User"], UserId);
  const contentUserIdsValues = contentUserIds.map(function (item) {
    return item.content_report_type_id;
  });
  let options = {
    include: [
      {
        model: db.user_profile,
      },
      {
        model: db.user_content_post,
        attributes: ["ucpl_id"],
        required: false,
        where: {
          ucpl_status: 1,
        },
      },
    ],
    // limit: pageSize,
    // offset: skipCount,
    order: [[sortBy, sortOrder]],
    attributes: [
      "u_id",
      "u_referer_id",
      "u_acct_type",
      "u_act_sec",
      "u_email",
      "u_active",
      "u_fb_username",
      "u_fb_id",
      "u_gmail_username",
      "u_gmail_id",
      "u_ymail_username",
      "u_ymail_id",
      "u_pref_login",
      "u_instagram_username",
      "u_instagram_id",
      "u_created_at",
      "u_updated_at",
      "u_email_verify_status",
      "is_user_deactivated",
      "is_user_hidden",
    ],
    where: {
      u_active: true,
    },
  };
  //Search string pagination
  if (searchString) {
    options.include[0].where = {
      [Op.or]: [
        {
          u_f_name: {
            [Op.like]: `%${searchString}%`,
          },
        },
        {
          u_display_name: {
            [Op.like]: `%${searchString}%`,
          },
        },
      ],
    };
  }
  if (pageSize > 0) {
    options = { ...options, limit: pageSize, offset: skipCount };
  }
  if (sortVal) {
    var sortValue = sortVal.trim();
    options.where = {
      [sortBy]: {
        [Op.iLike]: `%${sortValue}%`,
      },
    };
  }
  /* do not get users which are reported by someone */
  if (contentUserIdsValues.length) {
    options["where"]["u_id"] = {
      [Op.not]: contentUserIdsValues,
    };
  }
  options["where"]["is_autotakedown"] = 0;
  options["where"]["is_user_deactivated"] = 0;
  options["where"]["is_user_hidden"] = 0;
  var total = await Users.count({
    where: options["where"],
  });

  console.log(options);
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
    totalRecords: total,
  });
  // } catch (error) {
  //   console.log("Failed to fetch user list ", error.message);
  //   res.status(400).send({
  //     error: error.message,
  //     data: [],
  //     totalRecords: 0,
  //   });
  // }
};
exports.listingv2 = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.pageSize || 100);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || "u_id";
    const sortOrder = req.query.sortOrder || "DESC";
    const sortVal = req.query.sortVal;
    var UserId = req.header(process.env.UKEY_HEADER || "x-api-key");
    const contentUserIds = await common.getContentReportUser(["User"], UserId);
    const contentUserIdsValues = contentUserIds.map(function (item) {
      return item.content_report_type_id;
    });
    var options = {
      include: [
        {
          model: db.user_profile,
        },
        {
          model: db.user_content_post,
          attributes: ["ucpl_id"],
          required: false,
          where: {
            ucpl_status: 1,
          },
        },
      ],
      limit: pageSize,
      offset: skipCount,
      order: [[sortBy, sortOrder]],
      attributes: [
        "u_id",
        "u_referer_id",
        "u_acct_type",
        "u_act_sec",
        "u_email",
        "u_active",
        "u_fb_username",
        "u_fb_id",
        "u_gmail_username",
        "u_gmail_id",
        "u_ymail_username",
        "u_ymail_id",
        "u_pref_login",
        "u_instagram_username",
        "u_instagram_id",
        "u_created_at",
        "u_updated_at",
        "u_email_verify_status",
        "is_user_deactivated",
        "is_user_hidden",
      ],
      where: {
        u_active: true,
      },
    };
    if (sortVal) {
      var sortValue = sortVal.trim();
      options.where = {
        [sortBy]: {
          [Op.iLike]: `%${sortValue}%`,
        },
      };
    }
    /* do not get users which are reported by someone */
    if (contentUserIdsValues.length) {
      options["where"]["u_id"] = {
        [Op.not]: contentUserIdsValues,
      };
    }
    options["where"]["is_autotakedown"] = 0;
    options["where"]["is_user_deactivated"] = 0;
    options["where"]["is_user_hidden"] = 0;
    var total = await Users.count({
      where: options["where"],
    });
    const users_list = await Users.findAll(options);
    let userDetails = [];
    // let detail = await fetchCmsDetails(
    //   users_list[0].u_id,
    //   pageSize,
    //   skipCount
    // );

    userDetails = await Promise.all(
      users_list.map(async (user) => {
        try {
          let user_cms_details = await fetchCmsDetails(
            user.u_id,
            pageSize,
            skipCount
          );
          if (!user_cms_details["dataValues"])
            throw new Error("Cms details not found for ,", user.u_id);

          console.log("uid ", user.u_id, " ", user_cms_details["dataValues"]);
          if (user_cms_details["dataValues"]) {
            return {
              ...user["dataValues"],
              user_cms_details: user_cms_details["dataValues"],
            };
          } else {
            return {
              ...user["dataValues"],
              user_cms_details: {},
            };
          }
        } catch (error) {
          console.log("Failed to fetch CMS details ", error.message);
          return {
            ...user["dataValues"],
            user_cms_details: [],
          };
        }
      })
    );

    return res.status(200).send({
      data: userDetails,
      totalRecords: total,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({
      error: error.message,
      data: [],
      totalRecords: [],
    });
  }
};
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
  const Uid = req.header(process.env.UKEY_HEADER || "x-api-key");
  const User = await Users.findOne({
    include: [
      {
        model: db.user_profile,
      },
      {
        model: db.user_social_ext,
      },
      {
        model: db.user_content_post,
        attributes: ["ucpl_content_data", ["ucpl_id", "post_id"], "ta_task_id"],
        required: false,
        where: {
          ucpl_status: 1,
        },
        limit: pageSize,
        offset: skipCount,
        order: [["ucpl_id", "DESC"]],
      },
    ],
    attributes: [
      "u_id",
      "u_login",
      "u_referer_id",
      "u_acct_type",
      "u_act_sec",
      "u_email",
      "u_active",
      "u_pref_login",
      "u_created_at",
      "u_updated_at",
      "u_email_verify_status",
      "is_user_deactivated",
      "is_user_hidden",
      "u_fb_username",
      "u_fb_id",
      "u_gmail_username",
      "u_gmail_id",
      "u_ymail_username",
      "u_ymail_id",
      "u_pref_login",
      "u_instagram_username",
      "u_instagram_id",
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM user_fan_following WHERE user_fan_following.faf_by = user_login.u_id)"
        ),
        "total_following",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM user_fan_following WHERE user_fan_following.faf_to = user_login.u_id )"
        ),
        "total_fans",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*)  FROM user_fan_following WHERE user_fan_following.faf_by = " +
            Uid +
            " and user_fan_following.faf_to = user_login.u_id)"
        ),
        "followed_by_me",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM user_fan_following WHERE user_fan_following.faf_to = " +
            Uid +
            " and user_fan_following.faf_by = user_login.u_id )"
        ),
        "following_me",
      ],
    ],
    where: {
      u_id: userID,
      is_user_hidden: 0,
    },
  });
  if (!User) {
    res.status(500).send({
      message: "User not found",
    });
    return;
  }
  const accountDetails = await accountBalance.findOne({
    where: {
      ac_user_id: userID,
    },
    attributes: [
      ["ac_balance", "balance_coins"],
      ["ac_balance_stars", "balance_stars"],
      ["ac_account_no", "account_no"],
    ],
  });
  User.dataValues.account_details = accountDetails;
  if (User && User.is_user_deactivated == 1) {
    res.status(500).send({
      message: "User Is deactivated",
    });
    return;
  }
  if (User && User.u_active != true) {
    res.status(500).send({
      message: "User details not found",
    });
    return;
  }
  res.status(200).send({
    user_details: User,
    media_token: common.imageToken(userID),
  });
};

/**
 * Function to get user detail and brands details for user.
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.userDetailForAdmin = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const userID = req.params.userID;
  const Uid = req.header(process.env.UKEY_HEADER || "x-api-key");
  var level_options = {
    include: [
      {
        model: db.level_task,
      },
    ],
    where: {
      task_user_id: userID,
    },
  };
  const user_level_listing = await db.user_level_task_action.findAll(
    level_options
  );

  var video_add_options = {
    include: [
      {
        model: db.watch_ads_task,
      },
    ],
    where: {
      u_id: userID,
    },
  };
  const video_add_listing = await db.watch_ads_task_submit.findAll(
    video_add_options
  );
  var videoAddIds = {};
  if (video_add_listing.length) {
    video_add_listing.forEach((element) => {
      let videoBrandId = element ? video_ad.cr_co_id : "";
      if (!videoAddIds[videoBrandId]) {
        videoAddIds[videoBrandId] = [];
      } else {
        videoAddIds[videoBrandId].push(element);
      }
    });
  }
  var bonus_reward_options = {
    include: [
      {
        model: db.bonus_item,
      },
    ],
    where: {
      bonus_rewards_usrid: userID,
    },
  };
  const bonus_rewards_listing = await db.bonus_rewards.findAll(
    bonus_reward_options
  );
  var bonusRewardIds = {};
  if (bonus_rewards_listing.length) {
    bonus_rewards_listing.forEach((element) => {
      if (!bonusRewardIds[element.bonus_item.bonus_item_brand_id]) {
        bonusRewardIds[element.bonus_item.bonus_item_brand_id] = [];
      }
      bonusRewardIds[element.bonus_item.bonus_item_brand_id].push(element);
    });
  }

  var survey_options = {
    include: [
      {
        model: db.survey,
        attributes: ["sr_id", "sr_brand_id"],
      },
    ],
    attributes: ["sr_id", "sr_completed"],
    where: {
      sr_uid: userID,
    },
  };
  const survey_listing = await db.survey_user_complete.findAll(survey_options);

  var bonus_task_options = {
    where: {
      bonus_task_usr_id: userID,
    },
  };
  const bonus_task_listing = await db.bonus_task.findAll(bonus_task_options);
  var brandBonusTaskIncompleteIds = {};
  var brandBonusTaskCompleteIds = {};
  if (bonus_task_listing.length) {
    bonus_task_listing.forEach((element) => {
      if (!brandBonusTaskIncompleteIds[element.bonus_task_brand_id]) {
        brandBonusTaskIncompleteIds[element.bonus_task_brand_id] = [];
      }
      if (!brandBonusTaskCompleteIds[element.bonus_task_brand_id]) {
        brandBonusTaskCompleteIds[element.bonus_task_brand_id] = [];
      }
      if (element.bonus_task_is_finished == "1") {
        brandBonusTaskCompleteIds[element.bonus_task_brand_id].push(element);
      } else {
        brandBonusTaskIncompleteIds[element.bonus_task_brand_id].push(element);
      }
    });
  }
  var reward_given_options = {
    include: [
      {
        model: db.reward_center,
      },
    ],
    where: {
      rewards_award_user_id: userID,
    },
  };
  const reward_given_listing = await db.rewards_given.findAll(
    reward_given_options
  );

  const User = await Users.findOne({
    include: [
      {
        model: db.user_profile,
        attributes: [
          "u_display_name",
          "u_address",
          "u_city",
          "u_state",
          "u_country",
          "u_zipcode",
          "u_prof_img_path",
          "u_status",
          "u_stars",
          "u_budget",
          "u_energy",
          "u_brandscore",
        ],
      },
      // {
      //     model: db.user_social_ext
      // },
      {
        model: db.user_content_post,
        attributes: [
          "ucpl_content_data",
          ["ucpl_id", "post_id"],
          "ta_task_id",
          "ucpl_content_type",
          "upcl_brand_details",
          "ucpl_created_at",
        ],
        required: false,
        include: [
          {
            model: db.post_comment,
            required: false,
            where: {
              pc_commenter_uid: {
                [Op.not]: userID,
              },
            },
          },
        ],
        where: {
          ucpl_status: 1,
        },
        limit: pageSize,
        offset: skipCount,
        order: [["ucpl_id", "DESC"]],
      },
    ],
    attributes: [
      "u_id",
      "u_login",
      "u_referer_id",
      "u_acct_type",
      "u_act_sec",
      "u_email",
      "u_active",
      "u_pref_login",
      "u_created_at",
      "u_updated_at",
      "u_email_verify_status",
      "is_user_deactivated",
      "is_user_hidden",
      //[db.sequelize.literal('(SELECT SUM(bonus_usr_riddim_level) FROM bonus_usr WHERE bonus_usr.bonus_usr_id = '+userID+'  )'), 'Riddim Level'],
      [db.sequelize.literal("0"), "Tickets Earned"],
      [db.sequelize.literal("0"), "Presents Earned"],
      [db.sequelize.literal("0"), "Lottery Wheels"],
      [db.sequelize.literal("0"), "Easter Eggs"],
      [db.sequelize.literal("0"), "Chests Earned"],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM bonus_rewards WHERE bonus_rewards.bonus_rewards_usrid = " +
            userID +
            ")"
        ),
        "Bonuses Won",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM bonus_task WHERE bonus_task.bonus_task_usr_id = " +
            userID +
            " and bonus_task_is_finished = 1 )"
        ),
        "Bonus Tasks Completed",
      ],
      [db.sequelize.literal("0"), "Tasks Entered"],
      [db.sequelize.literal("0"), "Contests Entered"],
      [db.sequelize.literal("0"), "Content Entered"],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM survey_user_complete WHERE survey_user_complete.sr_uid = " +
            userID +
            ")"
        ),
        "Surveys",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM user_fan_following WHERE user_fan_following.faf_by = " +
            userID +
            ")"
        ),
        "Following",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM user_fan_following WHERE user_fan_following.faf_to = " +
            userID +
            ")"
        ),
        "Followers",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM watch_ads_task_submit WHERE watch_ads_task_submit.u_id = " +
            userID +
            " and watch_ads_task_submit.u_id = user_login.u_id )"
        ),
        "Ads Watched",
      ],
      [
        db.sequelize.literal(
          "(SELECT SUM(pc_comment_likes) FROM post_comment WHERE post_comment.pc_commenter_uid = " +
            userID +
            "  )"
        ),
        "Liked Comments",
      ],
      [
        db.sequelize.literal(
          "(SELECT SUM(pc_comment_unlikes) FROM post_comment WHERE post_comment.pc_commenter_uid = " +
            userID +
            "  )"
        ),
        "Disliked Comments",
      ],
      [
        db.sequelize.literal(
          "(SELECT SUM(ucpl_reaction_counter) FROM user_content_post WHERE user_content_post.ucpl_u_id = " +
            userID +
            "  )"
        ),
        "Reactions Received",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM post_user_reactions WHERE post_user_reactions.u_id = " +
            userID +
            ")"
        ),
        "Reactions Given",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(*) FROM content_report WHERE content_report.content_report_owner_id = " +
            userID +
            ")"
        ),
        "Reported Content",
      ],
      [db.sequelize.literal("0"), "Number of Brands"],
      [db.sequelize.literal("0"), "Tier 2 Sent"],
      [db.sequelize.literal("0"), "Tier 2 Incomplete"],
      [db.sequelize.literal("0"), "Tier 2 Declined"],
      [db.sequelize.literal("0"), "Tier 2 Completed"],
      [db.sequelize.literal("0"), "Tier 3 Completed"],
      [db.sequelize.literal("0"), "Tier 3 Sent"],
      [db.sequelize.literal("0"), "Tier 3 Incomplete"],
      [db.sequelize.literal("0"), "Tier 3 Declined"],
      [db.sequelize.literal("0"), "Tier 3 Completed"],
      [db.sequelize.literal("null"), "Brands Participated"],
    ],
    where: {
      u_id: userID,
      is_user_hidden: 0,
    },
  });
  if (!User) {
    res.status(500).send({
      message: "User not found",
    });
    return;
  }
  if (User && User.is_user_deactivated == 1) {
    res.status(500).send({
      message: "User Is deactivated",
    });
    return;
  }
  if (User && User.u_active != true) {
    res.status(500).send({
      message: "User details not found",
    });
    return;
  }
  let [
    taskLevelTwoCount,
    tasklevelTwoDecline,
    taskLevelThreeCount,
    tasklevelThreeDecline,
  ] = [[], [], [], []];
  let [
    tasklevelTwoComplete,
    tasklevelThreeComplete,
    tasklevelTwoInComplete,
    tasklevelThreeInComplete,
  ] = [[], [], [], []];
  var taskLevelBrandTwoCount = {};
  var taskLevelBrandThreeCount = {};
  var tasklevelBrandTwoDecline = {};
  var tasklevelBrandThreeDecline = {};
  var tasklevelBrandTwoComplete = {};
  var tasklevelBrandThreeComplete = {};
  var tasklevelBrandTwoInComplete = {};
  var tasklevelBrandThreeInComplete = {};
  if (user_level_listing.length) {
    for (const user_level_key in user_level_listing) {
      var brand_id = user_level_listing[user_level_key].level_task.brand_id;
      var task_id = user_level_listing[user_level_key].task_id;
      if (user_level_listing[user_level_key].level_task.task_level == 2) {
        if (!taskLevelBrandTwoCount[brand_id]) {
          taskLevelBrandTwoCount[brand_id] = [];
        }
        taskLevelTwoCount.push(task_id);
        taskLevelBrandTwoCount[brand_id].push(task_id);
        if (user_level_listing[user_level_key].user_cta_action == 0) {
          // decline
          if (!tasklevelBrandTwoDecline[brand_id]) {
            tasklevelBrandTwoDecline[brand_id] = [];
          }
          tasklevelTwoDecline.push(task_id);
          tasklevelBrandTwoDecline[brand_id].push(task_id);
        } else if (user_level_listing[user_level_key].user_cta_action == 1) {
          // accept
          if (!tasklevelBrandTwoComplete[brand_id]) {
            tasklevelBrandTwoComplete[brand_id] = [];
          }
          tasklevelTwoComplete.push(task_id);
          tasklevelBrandTwoComplete[brand_id].push(task_id);
        }
        if (
          user_level_listing[user_level_key].user_cta_action == 1 &&
          user_level_listing[user_level_key].task_status == 0
        ) {
          if (!tasklevelBrandTwoInComplete[brand_id]) {
            tasklevelBrandTwoInComplete[brand_id] = [];
          }
          tasklevelTwoInComplete.push(task_id);
          tasklevelBrandTwoInComplete[brand_id].push(task_id);
        }
      } else if (
        user_level_listing[user_level_key].level_task.task_level == 3
      ) {
        if (!taskLevelBrandThreeCount[brand_id]) {
          taskLevelBrandThreeCount[brand_id] = [];
        }
        taskLevelThreeCount.push(task_id);
        taskLevelBrandThreeCount[brand_id].push(task_id);

        if (user_level_listing[user_level_key].user_cta_action == 0) {
          if (!tasklevelBrandThreeDecline[brand_id]) {
            tasklevelBrandThreeDecline[brand_id] = [];
          }
          tasklevelThreeDecline.push(task_id);
          tasklevelBrandThreeDecline[brand_id].push(task_id);
        } else if (user_level_listing[user_level_key].user_cta_action == 1) {
          // accept
          if (!tasklevelBrandThreeComplete[brand_id]) {
            tasklevelBrandThreeComplete[brand_id] = [];
          }
          tasklevelThreeComplete.push(task_id);
          tasklevelBrandThreeComplete[brand_id].push(task_id);
        }
        if (
          user_level_listing[user_level_key].user_cta_action == 1 &&
          user_level_listing[user_level_key].task_status == 0
        ) {
          if (!tasklevelBrandThreeInComplete[brand_id]) {
            tasklevelBrandThreeInComplete[brand_id] = [];
          }
          tasklevelThreeInComplete.push(task_id);
          tasklevelBrandThreeInComplete[brand_id].push(task_id);
        }
      }
    }

    User["dataValues"]["Tier 2 Sent"] = taskLevelTwoCount.length;
    User["dataValues"]["Tier 3 Sent"] = taskLevelThreeCount.length;
    User["dataValues"]["Tier 2 Incomplete"] = tasklevelTwoInComplete.length;
    User["dataValues"]["Tier 3 Incomplete"] = tasklevelThreeInComplete.length;
    User["dataValues"]["Tier 2 Completed"] = tasklevelTwoComplete.length;
    User["dataValues"]["Tier 3 Completed"] = tasklevelThreeComplete.length;
    User["dataValues"]["Tier 2 Declined"] = tasklevelTwoDecline.length;
    User["dataValues"]["Tier 3 Declined"] = tasklevelThreeDecline.length;
  }
  // return res.status(200).send({
  //     reward_given_listing: reward_given_listing
  // });
  var rewardBrandTokens = {};
  var rewardBrandStars = {};
  if (reward_given_listing.length) {
    var easterEgg = [];
    var present = [];
    var chest = [];
    var lotteryWheel = [];
    for (const reward_given_key in reward_given_listing) {
      var reward_listing = reward_given_listing[reward_given_key];
      if (!rewardBrandTokens[reward_listing.rewards_brand_id]) {
        rewardBrandTokens[reward_listing.rewards_brand_id] = [];
      }
      if (!rewardBrandStars[reward_listing.rewards_brand_id]) {
        rewardBrandStars[reward_listing.rewards_brand_id] = [];
      }
      rewardBrandTokens[reward_listing.rewards_brand_id].push(
        reward_listing.rewards_award_token
      );
      rewardBrandStars[reward_listing.rewards_brand_id].push(
        reward_listing.rewards_award_stars
      );
      if (reward_listing.reward_center != undefined) {
        if (reward_listing.reward_center.reward_center_reward_type == 0) {
          easterEgg.push(reward_listing.rewards_award_id);
        } else if (
          reward_listing.reward_center.reward_center_reward_type == 1
        ) {
          present.push(reward_listing.rewards_award_id);
        } else if (
          reward_listing.reward_center.reward_center_reward_type == 2
        ) {
          chest.push(reward_listing.rewards_award_id);
        } else if (
          reward_listing.reward_center.reward_center_reward_type == 3
        ) {
          lotteryWheel.push(reward_listing.rewards_award_id);
        }
      }
    }
    User["dataValues"]["Easter Eggs"] = easterEgg.length;
    User["dataValues"]["Presents Earned"] = present.length;
    User["dataValues"]["Chests Earned"] = chest.length;
    User["dataValues"]["Lottery Wheels"] = lotteryWheel.length;
  }
  var brandSurveyIds = {};
  if (survey_listing.length) {
    for (const survey_listing_Key in survey_listing) {
      const survey_brand_id =
        survey_listing[survey_listing_Key].dataValues.survey.sr_brand_id;
      if (!brandSurveyIds[survey_brand_id]) {
        brandSurveyIds[survey_brand_id] = [];
      }
      brandSurveyIds[survey_brand_id].push(survey_listing[survey_listing_Key]);
    }
  }
  if (User.user_content_posts.length) {
    let [taskIds, contestIds, contentData, brandIds, brandNames, brandData] = [
      [],
      [],
      [],
      [],
      [],
      [],
    ];
    var userContentPosts = User.user_content_posts;
    var brandContent = {};
    var brandTaskIds = {};
    var brandContestIds = {};
    var brandCommentData = {};

    userContentPosts.forEach((element) => {
      contentData.push(element.ta_task_id);
      if (!brandTaskIds[element.upcl_brand_details.id]) {
        brandTaskIds[element.upcl_brand_details.id] = [];
      }
      if (!brandContestIds[element.upcl_brand_details.id]) {
        brandContestIds[element.upcl_brand_details.id] = [];
      }
      if (element.ucpl_content_type == "1") {
        taskIds.push(element.ta_task_id);
        brandTaskIds[element.upcl_brand_details.id].push(element.ta_task_id);
      } else if (element.ucpl_content_type == 2) {
        contestIds.push(element.ta_task_id);
        brandContestIds[element.upcl_brand_details.id].push(element.ta_task_id);
      }
      if (element.upcl_brand_details) {
        brandIds.push(element.upcl_brand_details.id);
        brandNames.push(element.upcl_brand_details.name);
        brandData[element.upcl_brand_details.id] =
          element.upcl_brand_details.name;
      }
      if (!brandContent[element.upcl_brand_details.id]) {
        brandContent[element.upcl_brand_details.id] = [];
      }
      brandContent[element.upcl_brand_details.id].push(element);
      if (!brandCommentData[element.upcl_brand_details.id]) {
        brandCommentData[element.upcl_brand_details.id] = [];
      }
      if (element.post_comments.length) {
        brandCommentData[element.upcl_brand_details.id].push(
          element.post_comments
        );
      }
    });
    if (brandIds.length) {
      var brandUniqueIds = brandIds.filter((v, i, a) => a.indexOf(v) === i);
      User["dataValues"]["Number of Brands"] = brandUniqueIds.length;
      var brandDetail = {};
      for (const brandUniqueKey in brandUniqueIds) {
        var brand_id = brandUniqueIds[brandUniqueKey];
        var brand_name = brandData[brand_id];
        brandDetail[brand_name] = {};
        brandDetail[brand_name]["Brand Id"] = brand_id;
        brandDetail[brand_name]["User Reach"] = 0;
        brandDetail[brand_name]["User Engagment Rate"] = brandCommentData[
          brand_id
        ][0]
          ? brandCommentData[brand_id][0].length
          : 0;
        brandDetail[brand_name]["last participated date"] =
          brandContent[brand_id][0]["ucpl_created_at"];
        brandDetail[brand_name]["Brand Shared"] = 0;
        brandDetail[brand_name]["Tokens Earned"] = rewardBrandTokens[brand_id]
          ? rewardBrandTokens[brand_id].reduce((a, b) => a + b, 0)
          : 0;
        brandDetail[brand_name]["Stars Earned"] = rewardBrandStars[brand_id]
          ? rewardBrandStars[brand_id].reduce((a, b) => a + b, 0)
          : 0;
        brandDetail[brand_name]["Brand Status"] = 0;
        brandDetail[brand_name]["Number Of Brand Task Enteries"] = 0;
        brandDetail[brand_name]["Number of Brand NOT Task Enteries"] = 0;
        brandDetail[brand_name]["Content Tasks Entered"] =
          brandContent[brand_id].length;
        brandDetail[brand_name]["Tasks Entered"] = 0;
        brandDetail[brand_name]["Contest Tasks Entered"] = 0;
        if (brandTaskIds[brand_id].length) {
          //var taskUniqueIds = brandTaskIds[brand_id].filter((v, i, a) => a.indexOf(v) === i);
          brandDetail[brand_name]["Tasks Entered"] =
            brandTaskIds[brand_id].length;
        }
        if (brandContestIds[brand_id].length) {
          //var brandContestUniqueIds = brandContestIds[brand_id].filter((v, i, a) => a.indexOf(v) === i);
          brandDetail[brand_name]["Contest Tasks Entered"] =
            brandContestIds[brand_id].length;
        }
        brandDetail[brand_name]["Surveys Questions tasks"] = brandSurveyIds[
          brand_id
        ]
          ? brandSurveyIds[brand_id].length
          : 0;
        brandDetail[brand_name]["Ads watched"] = videoAddIds[brand_id]
          ? videoAddIds[brand_id].length
          : 0;
        brandDetail[brand_name]["Tickets"] = 0;
        brandDetail[brand_name]["Bonuses Won"] = bonusRewardIds[brand_id]
          ? bonusRewardIds[brand_id].length
          : 0;
        brandDetail[brand_name]["bonus tasks incomplete"] =
          brandBonusTaskIncompleteIds[brand_id]
            ? brandBonusTaskIncompleteIds[brand_id].length
            : 0;
        brandDetail[brand_name]["Bonus task completed"] =
          brandBonusTaskCompleteIds[brand_id]
            ? brandBonusTaskCompleteIds[brand_id].length
            : 0;
        brandDetail[brand_name]["offers sent tier 2"] =
          taskLevelBrandTwoCount && taskLevelBrandTwoCount[brand_id]
            ? taskLevelBrandTwoCount[brand_id].length
            : 0;
        brandDetail[brand_name]["completed tier 2"] =
          tasklevelBrandTwoComplete && tasklevelBrandTwoComplete[brand_id]
            ? tasklevelBrandTwoComplete[brand_id].length
            : 0;
        brandDetail[brand_name]["accepted not completed tier 2"] =
          tasklevelBrandTwoInComplete && tasklevelBrandTwoInComplete[brand_id]
            ? tasklevelBrandTwoInComplete[brand_id].length
            : 0;
        brandDetail[brand_name]["not accepted tier 2 declined"] =
          tasklevelBrandTwoDecline[brand_id]
            ? tasklevelBrandTwoDecline[brand_id].length
            : 0;
        brandDetail[brand_name]["completed tier 3"] =
          tasklevelBrandThreeComplete[brand_id]
            ? tasklevelBrandThreeComplete[brand_id].length
            : 0;
        brandDetail[brand_name]["offers sent tier 3"] =
          taskLevelBrandThreeCount[brand_id]
            ? taskLevelBrandThreeCount[brand_id].length
            : 0;
        brandDetail[brand_name]["accepted not completed tier 3"] =
          tasklevelBrandThreeInComplete[brand_id]
            ? tasklevelBrandThreeInComplete[brand_id].length
            : 0;
        brandDetail[brand_name]["not accepted tier 3 declined"] =
          tasklevelBrandThreeDecline[brand_id]
            ? tasklevelBrandThreeDecline[brand_id].length
            : 0;
      }
      User["dataValues"]["brands"] = brandDetail;
    }
    let totalBrands = Object.keys(brandDetail);
    let totalTokensEarned = 0,
      totalStarsEarned = 0,
      totalUserReach = 0,
      totalEngagementRate = 0;
    if (Object.keys(brandDetail) > 0) {
      for (let brandName in brandDetail) {
        totalTokensEarned += brandDetail[brandName]["Tokens Earned"];
        totalStarsEarned += brandDetail[brandName]["Stars Earned"];

        totalUserReach += brandDetail[brandName]["User Reach"];
        totalEngagementRate += brandDetail[brandName]["User Engagment Rate"];
      }
    }
    User["dataValues"]["totalTokensEarned"] = totalTokensEarned;
    User["dataValues"]["totalStarsEarned"] = totalStarsEarned;
    User["dataValues"]["totalUserReach"] = totalUserReach;
    User["dataValues"]["averageEngagementRate"] =
      totalEngagementRate > 0 && totalBrands > 0
        ? totalEngagementRate / totalBrands
        : 0;
    if (brandNames.length) {
      var brandUniqueNames = brandNames.filter((v, i, a) => a.indexOf(v) === i);
      User["dataValues"]["Brands Participated"] = brandUniqueNames;
    }
    if (taskIds.length) {
      //var taskUniqueIds = taskIds.filter((v, i, a) => a.indexOf(v) === i);
      User["dataValues"]["Tasks Entered"] = taskIds.length;
    }
    if (contestIds.length) {
      //var contestUniqueIds = contestIds.filter((v, i, a) => a.indexOf(v) === i);
      User["dataValues"]["Contests Entered"] = contestIds.length;
    }
    if (contentData.length) {
      User["dataValues"]["Content Entered"] = contentData.length;
    }
  }
  delete User["dataValues"]["user_content_posts"];
  return res.status(200).send({
    user_details: User,
    media_token: common.imageToken(userID),
  });
};

/**
 * Function to get user detail and brands details for user.
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.userBrandTaskDetails = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const userID = req.params.userID;
  const Uid = req.header(process.env.UKEY_HEADER || "x-api-key");
  if (!req.query.brandId) {
    return res.status(400).send({
      message: "brandId are required",
    });
  }
  const User = await Users.findOne({
    include: [
      {
        model: db.user_content_post,
        attributes: [
          "ucpl_content_data",
          ["ucpl_id", "post_id"],
          "ta_task_id",
          "ucpl_content_type",
          "upcl_brand_details",
          "ucpl_created_at",
        ],

        where: {
          ucpl_status: 1,
          upcl_brand_details: {
            id: req.query.brandId,
          },
        },
        limit: pageSize,
        offset: skipCount,
        order: [["ucpl_id", "DESC"]],
      },
    ],
    attributes: ["u_id", "u_login"],
    where: {
      u_id: userID,
      is_user_hidden: 0,
    },
  });
  if (!User) {
    res.status(500).send({
      message: "User not found",
    });
    return;
  }
  if (User && User.is_user_deactivated == 1) {
    res.status(500).send({
      message: "User Is deactivated",
    });
    return;
  }
  res.status(200).send({
    message: User,
  });
  return;
};

/**
 * Function to update user details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateUser = async (req, res) => {
  const id = parseInt(req.params.userID);
  let updateData = req.body;
  let template = {};
  var already_verified = 0;
  if (req.body["u_email"]) {
    updateData["u_email"] = req.body["u_email"].toLowerCase();
    const UserDetails = await Users.findOne({
      attributes: ["u_id", "u_email_verify_status"],
      where: {
        u_email: req.body["u_email"].toLowerCase(),
      },
    });
    if (UserDetails && UserDetails.u_id != id) {
      res.status(403).send({
        message: "Email Already Exist",
      });
      return;
    }
    if (UserDetails && UserDetails.u_email_verify_status == true) {
      already_verified = 1;
    }
    if (already_verified == 0) {
      updateData["u_email_verify_status"] = false;
      template = await mail_templates.findOne({
        where: {
          mt_name: "verify_email",
        },
      });
    }
  }

  if (req.body["u_active"] !== undefined) {
    console.log(req.body["u_active"] + "U Active");
    updateData = {
      ...updateData,
      u_deactive_me: req.header(process.env.UKEY_HEADER || "x-api-key"),
    };
    console.log(updateData);
    const userPosts = await Posts.findAll({
      where: {
        ucpl_u_id: req.header(process.env.UKEY_HEADER || "x-api-key"),
      },
      attributes: ["ucpl_id", "ta_task_id", "ucpl_content_type"],
    });
    if (userPosts && userPosts.length > 0) {
      for (let i = 0; i < userPosts.length; i++) {
        await Posts.update(
          {
            ucpl_status: req.body["u_active"] == true ? 1 : 0,
          },
          {
            where: {
              ucpl_id: userPosts[i].ucpl_id,
            },
          }
        );
        const jType =
          userPosts[i].ucpl_content_type && userPosts[i].ucpl_content_type === 2
            ? "Contest"
            : "Single";
        common.jsonTask(userPosts[i].ta_task_id, jType, "update");
      }
    }
  }
  if (req.body.u_login) {
    const UserDetails = await Users.findOne({
      where: {
        u_login: req.body.u_login.toLowerCase(),
      },
    });

    const Userprofile = await User_profile.findOne({
      where: {
        u_display_name: req.body.u_login,
      },
      attributes: ["u_id"],
    });
    if (
      (UserDetails && UserDetails.u_id !== id) ||
      (Userprofile && Userprofile.u_id !== id)
    ) {
      res.status(200).send({
        message: "UserName Already Exist",
      });
      return;
    }
  }
  if (!id) {
    res.status(404).send({
      message: "User with id not found",
    });
    return;
  }
  if (req.body.u_pass) {
    res.status(500).send({
      message: "User password cannot be updated",
    });
    return;
  }
  const UserDetails = await Users.findOne({
    where: {
      u_id: id,
    },
  });

  Users.update(updateData, {
    returning: true,
    where: {
      u_id: id,
    },
  })
    .then(function ([num, [result]]) {
      if (num == 1) {
        if (
          req.body["u_email"] &&
          already_verified == 0 &&
          template.mt_body != undefined
        ) {
          try {
            const encryptedID = cryptr.encrypt(id);
            const vlink =
              process.env.SITE_API_URL + "users/verify_email/" + encryptedID;
            var templateBody = template.mt_body;
            templateBody = templateBody.replace(
              "[CNAME]",
              req.body["u_email"].toLowerCase()
            );
            templateBody = templateBody.replace("[VLINK]", vlink);
            const message = {
              from: "Socialbrands1@gmail.com",
              to: req.body["u_email"].toLowerCase(),
              subject: template.mt_subject,
              html: templateBody,
            };
            mailer.sendMail(message);
          } catch (error) {
            console.log(error);
          }
        }
        audit_log.saveAuditLog(
          req.header(process.env.UKEY_HEADER || "x-api-key"),
          "update",
          "user_login",
          id,
          result.dataValues,
          UserDetails
        );
        User_profile.update(
          { u_display_name: result.dataValues.u_login },
          {
            where: {
              u_id: id,
            },
          }
        );
        res.status(200).send({
          message: "User updated successfully.",
        });
      } else {
        logger.log(
          "error",
          `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        );
        res.status(400).send({
          message: `Cannot update Role with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      logger.log("error", err + ":updating User with id=" + id);
      res.status(500).send({
        message: err + " Error updating User with id=" + id,
      });
      return;
    });
};
/**
 * Function to update user profile details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateUserProfile = async (req, res) => {
  const id = parseInt(req.params.userID);
  const { bio, job_title, ...rest } = req.body;

  if (!id) {
    res.status(404).send({
      message: "User with id not found",
    });
    return;
  }

  const dbUser = await Users.findOne({
    where: {
      u_id: id,
    },
  });

  if (bio !== undefined || bio !== null) {
    dbUser.bio = bio;
    try {
      dbUser.save();
    } catch (error) {
      return next(error);
    }
  }

  if (job_title !== undefined || job_title !== null) {
    dbUser.job_title = job_title;
    try {
      dbUser.save();
    } catch (error) {
      return next(error);
    }
  }

  if (req.body.u_display_name) {
    const UserDetails = await Users.findOne({
      where: {
        u_login: req.body.u_display_name,
      },
      attributes: ["u_id"],
    });
    const Userprofile = await User_profile.findOne({
      where: {
        u_display_name: req.body.u_display_name,
      },
      attributes: ["u_id"],
    });
    if (
      (UserDetails && UserDetails.u_id !== id) ||
      (Userprofile && Userprofile.u_id !== id)
    ) {
      return res.status(200).send({
        message: "username already Exist",
      });
    } else {
      Users.update(
        { u_login: req.body.u_display_name },
        {
          where: {
            u_id: id,
          },
        }
      );
    }
  }
  // update mobile number
  if (req.body.u_phone) {
    const UserDetails = await User_profile.findOne({
      attributes: ["u_id"],
      where: {
        u_phone: req.body["u_phone"],
      },
    });
    if (UserDetails && UserDetails.u_id != id) {
      res.status(404).send({
        message: "phone Already Exist",
      });
      return;
    }
    var otp = Math.floor(100000 + Math.random() * 900000);
    var sms = common.sendSMS(
      req.body["u_phone"],
      "OTP for Social App is " + otp
    );
    var data = {
      u_phone: req.body["u_phone"],
      phone_otp: otp,
      u_phone_verify_status: false,
    };
    User_profile.update(data, {
      where: {
        u_id: id,
      },
    });
  }
  const UserDetails = await User_profile.findOne({
    where: {
      u_id: id,
    },
  });

  try {
    const [num, [result]] = await User_profile.update(rest, {
      returning: true,
      where: {
        u_id: id,
      },
    });

    if (num == 1) {
      audit_log.saveAuditLog(
        req.header(process.env.UKEY_HEADER || "x-api-key"),
        "update",
        "user_profile",
        id,
        result.dataValues,
        UserDetails
      );
      const userData = await Users.findOne({
        include: [
          {
            model: db.user_profile,
          },
          {
            model: db.user_social_ext,
          },
        ],
        attributes: [
          "u_id",
          "u_referer_id",
          "u_acct_type",
          "u_act_sec",
          "u_email",
          "u_active",
          "u_fb_username",
          "u_fb_id",
          "u_gmail_username",
          "u_gmail_id",
          "u_ymail_username",
          "u_ymail_id",
          "u_pref_login",
          "u_instagram_username",
          "u_instagram_id",
          "u_created_at",
          "u_updated_at",
          "u_email_verify_status",
          "bio",
          "job_title",
        ],
        where: {
          u_id: id,
        },
      });
      return res.status(200).send({
        message: "User details updated successfully.",
        data: userData,
        access_token: common.generateToken(id),
        media_token: common.imageToken(id),
        otp: otp ? otp : null,
      });
    } else {
      res.status(400).send({
        message: `Cannot update Users with id=${id}. Maybe User was not found or req.body is empty!`,
      });
    }
  } catch (err) {
    logger.log("error", err + ":updating User profile with id=" + id);
    return res.status(500).send({
      message: "Error updating User with id=" + id,
    });
  }
};
/**
 * Function to update user social ext
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateUsersocialExt = async (req, res) => {
  const id = req.params.userID;
  if (!id) {
    res.status(404).send({
      message: "User with id not found",
    });
    return;
  }
  const UserDetails = await User_social_ext.findOne({
    where: {
      u_id: id,
    },
  });
  User_social_ext.update(req.body, {
    returning: true,
    where: {
      u_id: id,
    },
  })
    .then(function ([num, [result]]) {
      if (num == 1) {
        audit_log.saveAuditLog(
          req.header(process.env.UKEY_HEADER || "x-api-key"),
          "update",
          "user_social_ext",
          id,
          result.dataValues,
          UserDetails
        );

        res.status(200).send({
          message: "User social ext details updated successfully.",
        });
      } else {
        res.status(400).send({
          message: `Cannot update Users with id=${id}. Maybe User social ext was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      logger.log("error", err + ":updating User social profile with id=" + id);
      res.status(500).send({
        message: err + "Error updating User social ext with id=" + id,
      });
      return;
    });
};
/**
 * Function to check admin user credentials for login
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.userlogin = async (req, res) => {
  const { username, password, login_type } = req.body;
  if (!login_type || !username) {
    return res.status(422).send({
      message: "Login details are required",
    });
  }
  var uID = 0;
  switch (login_type) {
    case "Normal":
      if (!username || !password) {
        return res.status(422).send({
          message: "email and password required",
        });
      }
      const resultData = await Users.authenticate(
        username.toLowerCase(),
        "u_email"
      );
      if (!resultData) {
        res.status(404).send({
          message: "user does not exists",
        });
        return;
      }
      if (
        resultData.u_active !== true &&
        resultData.u_deactive_me !== resultData.u_id
      ) {
        res.status(404).send({
          message: "Your account is deactivated by Admin",
        });
        return;
      }
      var user_password = Users.encryptPassword(password, resultData.u_salt);
      if (user_password != resultData.u_pass) {
        res.status(400).send({
          message: "Email or Password is incorrect",
        });
        return;
      }
      uID = resultData.u_id;
      break;
    case "Fb":
      const resultFB = await Users.authenticate(username, "u_fb_id");
      if (!resultFB) {
        res.status(404).send({
          message: "user does not exists",
        });
        return;
      }
      if (
        resultFB.u_active !== true &&
        resultFB.u_deactive_me !== resultFB.u_id
      ) {
        res.status(404).send({
          message: "Your account is deactivated by Admin",
        });
        return;
      }
      uID = resultFB.u_id;
      break;
    case "Gmail":
      const resultGmail = await Users.authenticate(username, "u_gmail_id");
      if (!resultGmail) {
        res.status(404).send({
          message: "user does not exists",
        });
        return;
      }
      if (
        resultGmail.u_active !== true &&
        resultGmail.u_deactive_me !== resultGmail.u_id
      ) {
        res.status(404).send({
          message: "Your account is deactivated by Admin",
        });
        return;
      }
      uID = resultGmail.u_id;
      break;
    case "Ymail":
      const resultYmail = await Users.authenticate(username, "u_ymail_id");
      if (!resultYmail) {
        res.status(404).send({
          message: "user does not exists",
        });
        return;
      }
      if (
        resultYmail.u_active !== true &&
        resultYmail.u_deactive_me !== resultYmail.u_id
      ) {
        res.status(404).send({
          message: "Your account is deactivated by Admin",
        });
        return;
      }
      uID = resultYmail.u_id;
      break;
    case "Instagram":
      const resultInstagram = await Users.authenticate(
        username,
        "u_instagram_id"
      );
      if (!resultInstagram) {
        res.status(404).send({
          message: "user does not exists",
        });
        return;
      }
      if (
        resultInstagram.u_active !== true &&
        resultInstagram.u_deactive_me !== resultInstagram.u_id
      ) {
        res.status(404).send({
          message: "Your account is deactivated by Admin",
        });
        return;
      }
      uID = resultInstagram.u_id;
      break;
    default:
      return res.status(422).send({
        message: "Invalid Login",
      });
  }
  const UserDetails = await Users.findOne({
    include: [
      {
        model: db.user_profile,
      },
      {
        model: db.user_social_ext,
      },
      {
        model: db.user_content_post,
        attributes: ["ta_task_id"],
        where: {
          ucpl_status: `1`,
        },
        required: false,
      },
    ],
    attributes: [
      "u_id",
      "u_referer_id",
      "u_acct_type",
      "u_act_sec",
      "u_email",
      "u_active",
      "u_fb_username",
      "u_fb_id",
      "u_gmail_username",
      "u_gmail_id",
      "u_ymail_username",
      "u_ymail_id",
      "u_pref_login",
      "u_instagram_username",
      "u_instagram_id",
      "u_created_at",
      "u_updated_at",
      "u_email_verify_status",
      "is_user_deactivated",
      "is_user_hidden",
      "referral_code",
      "referral_link",
      "job_title",
      "bio",
    ],
    where: {
      u_id: uID,
    },
  });
  /* Account Deactivated Check */
  if (UserDetails.is_user_deactivated == 1) {
    res.status(404).send({
      message: "Your account is deactivated",
    });
    return;
  }
  if (UserDetails.u_active !== undefined && UserDetails.u_active !== true) {
    let updateData = { u_deactive_me: uID, u_active: true };
    Users.update(updateData, {
      where: {
        u_id: uID,
      },
    });
    const userPosts = await Posts.findAll({
      where: {
        ucpl_u_id: uID,
      },
      attributes: ["ucpl_id", "ta_task_id", "ucpl_content_type"],
    });
    if (userPosts && userPosts.length > 0) {
      for (let i = 0; i < userPosts.length; i++) {
        await Posts.update(
          {
            ucpl_status: 1,
          },
          {
            where: {
              ucpl_id: userPosts[i].ucpl_id,
            },
          }
        );
        const jType =
          userPosts[i].ucpl_content_type && userPosts[i].ucpl_content_type === 2
            ? "Contest"
            : "Single";
        common.jsonTask(userPosts[i].ta_task_id, jType, "update");
      }
    }
  }
  var access_token = common.generateToken(uID);
  logger.log(
    "info",
    "Login Successfully with username: " +
      username +
      " , pass:" +
      password +
      " and login type:" +
      login_type
  );

  res.status(200).send({
    message: "Login Successfully",
    data: UserDetails,
    access_token: access_token,
    media_token: common.imageToken(uID),
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
      message: "Email can not be empty!",
    });
    return;
  }
  var emailId = req.body.email.toLowerCase();
  const resultData = await Users.authenticate(emailId, "u_email");

  if (!resultData) {
    res.status(403).send({
      message: " please enter valid user details",
    });
  } else {
    var newpassword = crypto.randomBytes(8).toString("base64");
    console.log(newpassword);
    var new_salt = Users.generateSalt();
    var gen_password = Users.encryptPassword(newpassword, new_salt);
    const userData = {
      u_pass: gen_password,
      u_salt: new_salt,
    };
    logger.log(
      "info",
      "Forget email for emailId: " + emailId + " with password :" + newpassword
    );

    Users.update(userData, {
      where: {
        u_email: emailId,
      },
    }).then((data) => {
      res.status(200).end();
    });
    try {
      const template = await mail_templates.findOne({
        where: {
          mt_name: "forget_password",
        },
      });
      var templateBody = template.mt_body;
      templateBody = templateBody.replace("[EMAIL]", emailId);
      templateBody = templateBody.replace("[NEWPWD]", newpassword);
      const message = {
        from: process.env.AD_SMTP_USER,
        to: emailId,
        subject: "Forget Password: Request for new Passord",
        html: templateBody,
      };
      mailer.sendMail(message);
    } catch (error) {
      console.log(error);
    }
  }
};

/**
 * [forgetPassword Function to change password of a user
 * @param  {Object}  req expressJs request Object
 * @param  {Object}  res expressJs request Object
 * @return {Promise}
 */
exports.forgetPasswordUsingMandrill = async (req, res) => {
  if (!req.body.email) {
    res.status(400).send({
      message: "Email can not be empty!",
    });
    return;
  }
  var emailId = req.body.email.toLowerCase();
  const resultData = await Users.authenticate(emailId, "u_email");

  if (!resultData) {
    res.status(403).send({
      message: " please enter valid user details",
    });
  } else {
    var newpassword = crypto.randomBytes(8).toString("base64");
    console.log(newpassword);
    var new_salt = Users.generateSalt();
    var gen_password = Users.encryptPassword(newpassword, new_salt);
    const userData = {
      u_pass: gen_password,
      u_salt: new_salt,
    };
    logger.log(
      "info",
      "Forget email for emailId: " + emailId + " with password :" + newpassword
    );

    Users.update(userData, {
      where: {
        u_email: emailId,
      },
    }).then((data) => {
      res.status(200).end();
    });
    const templateContent = [
      {
        name: "new_code",
        content: newpassword,
      },
      {
        name: "email",
        content: emailId,
      },
    ];
    mandrillapp.sendAnEmailUsingTemplate(
      "forget-code",
      templateContent,
      emailId
    );
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
      message: " current_password,new password and confirm password required",
    });
  }
  if (req.body.new_password != req.body.confirm_password) {
    logger.log(
      "error",
      "Change Pass: new password and confirm password does not match with uid=" +
        user_id
    );
    res.status(400).send({
      message: "new password and confirm password does not match",
    });
    return;
  }

  const user = Users.findOne({
    where: {
      u_id: user_id,
      u_active: true,
    },
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
        u_salt: salt,
      };
      logger.log("info", "Password changed with uid=" + user_id);
      Users.update(userData, {
        where: {
          u_id: user_id,
        },
      }).then((data) => {
        return res.status(200).send({
          message: "password changed successfully",
        });
      });
    } else {
      logger.log(
        "error",
        "Change Pass: Invalid user current password with uid=" + user_id
      );
      res.status(400).send({
        message: "Invalid user current password",
      });
    }
  } else {
    logger.log("error", "Change Pass: User does not Exit with uid=" + user_id);
    res.status(403).send({
      message: "User does not Exit",
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
      u_email: req.body["email"].toLowerCase(),
    },
    attributes: ["u_id", "u_email_verify_status"],
  });
  if (UserDetails) {
    if (UserDetails.u_email_verify_status) {
      res.status(200).send({
        message: "Already Exist",
      });
      return;
    } else {
      try {
        const template = await mail_templates.findOne({
          where: {
            mt_name: "verify_email",
          },
        });
        const encryptedID = cryptr.encrypt(UserDetails.u_id);
        const vlink =
          process.env.SITE_API_URL + "users/verify_email/" + encryptedID;
        var templateBody = template.mt_body;
        templateBody = templateBody.replace("[CNAME]", req.body["email"]);
        templateBody = templateBody.replace("[VLINK]", vlink);
        const message = {
          from: "Socialbrands1@gmail.com",
          to: req.body["email"],
          subject: template.mt_subject,
          html: templateBody,
        };
        mailer.sendMail(message);
      } catch (error) {
        console.log(error);
      }
      res.status(200).send({
        message: "Already Exist and not verified",
      });
      return;
    }
  }
  res.status(400).send({
    message: "Not Exist",
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
      msg: "username is required",
    });
    return;
  }
  const UserDetails = await Users.findOne({
    where: {
      u_login: req.body["username"].toLowerCase(),
    },
    attributes: ["u_id"],
  });
  if (UserDetails) {
    res.status(400).send({
      message: "Already Exist",
    });
    return;
  }
  res.status(200).send({
    message: "Not Exist",
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
      u_email: req.body["email"].toLowerCase(),
    },
    attributes: ["u_id", "u_email_verify_status"],
  });
  if (UserDetails) {
    if (UserDetails.u_email_verify_status) {
      res.status(200).send({
        message: "Already verified",
      });
      return;
    } else {
      try {
        const template = await mail_templates.findOne({
          where: {
            mt_name: "verify_email",
          },
        });

        const encryptedID = cryptr.encrypt(UserDetails.u_id);
        const vlink =
          process.env.SITE_API_URL + "users/verify_email/" + encryptedID;
        var templateBody = template.mt_body;
        templateBody = templateBody.replace("[CNAME]", req.body["email"]);
        templateBody = templateBody.replace("[VLINK]", vlink);
        const message = {
          from: "care@riddim.com",
          to: req.body["email"],
          subject: template.mt_subject,
          html: templateBody,
        };
        await mailer.sendMail(message);
      } catch (error) {
        return res.status(500).send({
          message: "Email error",
        });
      }
      res.status(200).send({
        message: "Email send",
      });
      return;
    }
  } else {
    res.status(400).send({
      message: "Not Exist",
    });
    return;
  }
};
exports.verifyEmail = async (req, res) => {
  try {
    const decryptedID = cryptr.decrypt(req.params.verifyToken);
    Users.update(
      { u_email_verify_status: true },
      {
        returning: true,
        where: {
          u_id: decryptedID,
        },
      }
    )
      .then(function ([num, [result]]) {
        if (num == 1) {
          res.status(200).send({
            message: "Email verified successfully.",
          });
        } else {
          res.status(400).send({
            message: `Cannot verify Users with toekn=${decryptedID}`,
          });
        }
      })
      .catch((err) => {
        logger.log("error", err + ":verify User with id=" + decryptedID);
        res.status(500).send({
          message: err + "Error verify User with id=" + decryptedID,
        });
        return;
      });
  } catch (error) {
    res.status(500).send({
      message: "Invalid verify token",
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
  if (!req.body.mobile_number) {
    return res.status(400).send({
      message: "mobile required",
    });
  }
  console.log(req.body["mobile_number"]);
  const UserDetails = await User_profile.findOne({
    where: {
      u_phone: req.body["mobile_number"],
    },
  });
  if (UserDetails) {
    res.status(404).send({
      message: "Already Exist",
    });
    return;
  }
  var otp = Math.floor(100000 + Math.random() * 900000);
  var sms = common.sendSMS(
    req.body["mobile_number"],
    "OTP for Social App is " + otp
  );
  console.log(sms);
  var data = {
    u_phone: req.body["mobile_number"],
    phone_otp: otp,
  };
  User_profile.update(data, {
    where: {
      u_id: user_id,
    },
  });
  res.status(200).send({
    message: "Otp Send",
    otp: otp,
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
  if (!req.body.mobile_number) {
    return res.status(400).send({
      message: "mobile required",
    });
  }
  const UserDetails = await User_profile.findOne({
    where: {
      u_phone: req.body["mobile_number"],
      u_id: user_id,
    },
  });
  if (!UserDetails) {
    res.status(404).send({
      message: "Not registered mobile number",
    });
    return;
  }
  var otp = Math.floor(100000 + Math.random() * 900000);
  var sms = common.sendSMS(
    req.body["mobile_number"],
    "OTP for Social App is " + otp
  );
  var data = {
    phone_otp: otp,
  };
  User_profile.update(data, {
    where: {
      u_id: user_id,
    },
  });
  res.status(200).send({
    message: "Otp Send",
    otp: otp,
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
  if (!req.body.otp) {
    return res.status(400).send({
      message: "otp required",
    });
  }
  const UserDetails = await User_profile.findOne({
    where: {
      u_id: user_id,
    },
  });
  if (
    (!UserDetails ||
      !UserDetails.phone_otp ||
      req.body.otp != UserDetails.phone_otp) &&
    req.body.otp != "000000"
  ) {
    res.status(404).send({
      message: "Invalid Otp",
    });
    return;
  }
  if (UserDetails.u_phone_verify_status == true) {
    res.status(200).send({
      message: "Already Verified",
    });
    return;
  } else {
    User_profile.update(
      { u_phone_verify_status: true },
      {
        where: {
          u_id: user_id,
        },
      }
    );
    res.status(200).send({
      message: "Otp Verified",
    });
    return;
  }
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
      message: "action type,action and user id required",
    });
  }
  if (req.body.action == 1) {
    var userfanDetails = await userFF.findOne({
      where: {
        faf_to: parseInt(req.body.u_id),
        faf_by: parseInt(user_id),
      },
    });
    if (!userfanDetails) {
      var ffData = {
        faf_to: parseInt(req.body.u_id),
        faf_by: parseInt(user_id),
      };
      userFF.create(ffData);
    }
    res.status(200).send({
      message: "user followed",
    });
    return;
  }
  userFF.destroy({
    where: {
      faf_to: parseInt(req.body.u_id),
      faf_by: parseInt(user_id),
    },
  });
  res.status(200).send({
    message: "user unfollowed",
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
  const sortBy = req.query.sortBy || "u_faf_id";
  const sortOrder = req.query.sortOrder || "DESC";
  var user_id = req.query.userId
    ? req.query.userId
    : parseInt(req.header(process.env.UKEY_HEADER || "x-api-key"));
  var m_user_id = parseInt(req.header(process.env.UKEY_HEADER || "x-api-key"));
  var options = {
    include: [
      {
        model: db.user_profile,
        as: "following",
        attributes: [
          ["u_display_name", "username"],
          ["u_f_name", "first_name"],
          ["u_l_name", "last_name"],
          ["u_prof_img_path", "prof_img"],
        ],
      },
    ],
    limit: pageSize,
    offset: skipCount,
    attributes: [
      "faf_to",
      [
        db.sequelize.literal(
          "(SELECT COUNT(ufff.u_faf_id)  FROM user_fan_following as ufff WHERE ufff.faf_to = " +
            m_user_id +
            " and ufff.faf_by = user_fan_following.faf_to)"
        ),
        "following_me",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(ufffSEcond.u_faf_id)  FROM user_fan_following as ufffSEcond WHERE ufffSEcond.faf_by = " +
            m_user_id +
            " and ufffSEcond.faf_to = user_fan_following.faf_to)"
        ),
        "followed_by_me",
      ],
    ],
    where: {
      faf_by: user_id,
    },
    order: [[sortBy, sortOrder]],
  };
  var total = await userFF.count({
    where: options["where"],
  });
  var userlist = await userFF.findAll(options);

  res.status(200).send({
    data: userlist,
    totalRecords: total,
    media_token: common.imageToken(m_user_id),
  });
};
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
  const sortBy = req.query.sortBy || "u_faf_id";
  const sortOrder = req.query.sortOrder || "DESC";
  var user_id = req.query.userId
    ? req.query.userId
    : parseInt(req.header(process.env.UKEY_HEADER || "x-api-key"));
  console.log(user_id + "++++++++++++++++++++++++++++++++++++");
  var m_user_id = parseInt(req.header(process.env.UKEY_HEADER || "x-api-key"));
  var options = {
    include: [
      {
        model: db.user_profile,
        as: "follower",
        attributes: [
          ["u_display_name", "username"],
          ["u_f_name", "first_name"],
          ["u_l_name", "last_name"],
          ["u_prof_img_path", "prof_img"],
        ],
      },
    ],
    limit: pageSize,
    offset: skipCount,
    attributes: [
      "faf_by",
      [
        db.sequelize.literal(
          "(SELECT COUNT(ufff.u_faf_id)  FROM user_fan_following as ufff WHERE ufff.faf_by = " +
            m_user_id +
            " and ufff.faf_to = user_fan_following.faf_by)"
        ),
        "followed_by_me",
      ],
      [
        db.sequelize.literal(
          "(SELECT COUNT(ufffSec.u_faf_id)  FROM user_fan_following as ufffSec WHERE ufffSec.faf_to = " +
            m_user_id +
            " and ufffSec.faf_by = user_fan_following.faf_by)"
        ),
        "following_me",
      ],
    ],
    where: {
      faf_to: user_id,
    },
    order: [[sortBy, sortOrder]],
  };
  var total = await userFF.count({
    where: options["where"],
  });
  userFF.findAll(options).then(function (userlist) {
    res.status(200).send({
      data: userlist,
      totalRecords: total,
      media_token: common.imageToken(m_user_id),
    });
  });
};
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
  const sortBy = req.query.sortBy || "trx_id";
  const sortOrder = req.query.sortOrder || "DESC";
  const sortVal = req.query.sortVal;
  const adminDetails = await adminSetting.findOne({
    where: {
      ad_id: 1,
    },
    attributes: [
      ["ad_conversion_rate", "conversion_rate"],
      ["ad_min_withdraw_limit", "min_withdraw_limit"],
      ["ad_max_withdraw_limit", "max_withdraw_limit"],
    ],
  });
  const accountDetails = await accountBalance.findOne({
    where: {
      ac_user_id: req.header(process.env.UKEY_HEADER || "x-api-key") || 0,
    },
    attributes: [
      ["ac_balance", "balance_coins"],
      ["ac_balance_stars", "balance_stars"],
      ["ac_account_no", "account_no"],
    ],
  });
  var options = {
    limit: pageSize,
    offset: skipCount,
    order: [[sortBy, sortOrder]],
    where: {
      trx_user_id: req.header(process.env.UKEY_HEADER || "x-api-key") || 0,
      trx_coins: {
        [Op.gt]: 0,
      },
    },
  };
  if (sortVal && sortBy) {
    var sortValue = sortVal;
    options.where = {
      [req.query.sortBy]: sortValue,
      trx_user_id: req.header(process.env.UKEY_HEADER || "x-api-key") || 0,
      trx_coins: {
        [Op.gt]: 0,
      },
    };
  }
  var total = await ledgerTransactions.count({
    where: options["where"],
  });
  const users_list = await ledgerTransactions.findAll(options);
  res.status(200).send({
    data: users_list,
    totalRecords: total,
    conversion: adminDetails,
    userBalance: accountDetails,
    media_token: common.imageToken(
      req.header(process.env.UKEY_HEADER || "x-api-key")
    ),
  });
};
exports.user_star_transactions = async (req, res) => {
  const pageSize = parseInt(req.query.pageSize || 10);
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const skipCount = (pageNumber - 1) * pageSize;
  const sortBy = "trx_id";
  const sortOrder = req.query.sortOrder || "DESC";
  const sortVal = req.query.sortVal;
  const adminDetails = await adminSetting.findOne({
    where: {
      ad_id: 1,
    },
    attributes: [
      ["ad_conversion_rate", "conversion_rate"],
      ["ad_min_withdraw_limit", "min_withdraw_limit"],
      ["ad_max_withdraw_limit", "max_withdraw_limit"],
    ],
  });
  const accountDetails = await accountBalance.findOne({
    where: {
      ac_user_id: req.header(process.env.UKEY_HEADER || "x-api-key") || 0,
    },
    attributes: [
      ["ac_balance", "balance_coins"],
      ["ac_balance_stars", "balance_stars"],
      ["ac_account_no", "account_no"],
    ],
  });
  var options = {
    limit: pageSize,
    offset: skipCount,
    order: [[sortBy, sortOrder]],
    where: {
      trx_user_id: req.header(process.env.UKEY_HEADER || "x-api-key") || 0,
      trx_stars: {
        [Op.gt]: 0,
      },
    },
  };
  if (sortVal && sortBy) {
    var sortValue = sortVal;
    options.where = {
      [req.query.sortBy]: sortValue,
      trx_user_id: req.header(process.env.UKEY_HEADER || "x-api-key") || 0,
      trx_stars: {
        [Op.gt]: 0,
      },
    };
  }
  var total = await ledgerTransactions.count({
    where: options["where"],
  });
  const users_list = await ledgerTransactions.findAll(options);
  res.status(200).send({
    data: users_list,
    totalRecords: total,
    conversion: adminDetails,
    userBalance: accountDetails,
    media_token: common.imageToken(
      req.header(process.env.UKEY_HEADER || "x-api-key")
    ),
  });
};
/**
 * Function to debit coins
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.user_debit_transactions = async (req, res) => {
  const userId = req.header(process.env.UKEY_HEADER || "x-api-key");
  if (!req.body["coins"] || !req.body["conversation_amount"] || !userId) {
    res.status(400).send({
      message: "coins,conversation_amount required",
    });
    return;
  }
  const adminDetails = await adminSetting.findOne({
    where: {
      ad_id: 1,
    },
    attributes: [
      ["ad_conversion_rate", "conversion_rate"],
      ["ad_min_withdraw_limit", "min_withdraw_limit"],
      ["ad_max_withdraw_limit", "max_withdraw_limit"],
    ],
  });

  const accountDetails = await accountBalance.findOne({
    where: {
      ac_user_id: userId,
    },
    attributes: [
      ["ac_id", "ac_id"],
      ["ac_balance", "balance_coins"],
      ["ac_balance_stars", "balance_stars"],
      ["ac_account_no", "account_no"],
    ],
  });

  if (
    !accountDetails ||
    accountDetails.dataValues.balance_coins <= 0 ||
    accountDetails.dataValues.balance_coins < req.body["coins"]
  ) {
    res.status(400).send({
      message: "Invalid balance coins",
    });
    return;
  }
  const validConversionAmount = Math.floor(
    req.body["coins"] / adminDetails.dataValues.conversion_rate
  );
  console.log(adminDetails.dataValues);
  if (validConversionAmount != req.body["conversation_amount"]) {
    res.status(400).send({
      message: "Invalid conversion amount or coins",
    });
    return;
  }
  if (
    req.body["conversation_amount"] > adminDetails.dataValues.max_withdraw_limit
  ) {
    res.status(400).send({
      message:
        "conversation amount is max then withdraw limit,Please Contact to admin",
    });
    return;
  }
  if (
    req.body["conversation_amount"] < adminDetails.dataValues.min_withdraw_limit
  ) {
    res.status(400).send({
      message:
        "conversation amount is min to withdraw limit,Please Contact to admin",
    });
    return;
  }
  //const remainderCoins=req.body["coins"]%adminDetails.conversion_rate;
  ledgerTransactions
    .create({
      trx_user_id: userId,
      trx_unique_id: userId + "-" + new Date().getTime(),
      trx_type: 0,
      trx_coins: req.body["coins"],
      trx_stars: 0,
      trx_date_timestamp: new Date().getTime(),
      trx_source: {
        account_details: accountDetails.dataValues,
        conversion_details: adminDetails.dataValues,
      },
      trx_approval_status: 0,
      trx_description: req.body["description"],
      trx_currency_converation_amount: req.body["conversation_amount"],
      trx_conversion_rate: adminDetails.dataValues.conversion_rate,
      trx_withdraw_destination: 0,
    })
    .then((data) => {
      console.log(accountDetails.dataValues.balance_coins);
      accountBalance.update(
        {
          ac_balance:
            accountDetails.dataValues.balance_coins - req.body["coins"],
        },
        {
          where: {
            ac_user_id: userId,
          },
        }
      );
      res.status(200).send({
        message: "transaction successfully debited",
      });
      return;
    });
};

/**
 * Function to deactivate or hide unhide account
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.userDeactivateOrHide = async (req, res) => {
  const id = req.params.userID;
  if (!id) {
    res.status(404).send({
      message: "User with id not found",
    });
    return;
  }
  if (!req.body.u_action) {
    res.status(404).send({
      message: "u_action is Required",
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
      u_id: id,
    },
  });
  if (
    UserDetails.is_user_deactivated == 1 &&
    UserDetails.is_user_hidden == 0 &&
    req.body.u_action == 1
  ) {
    res.status(404).send({
      message: "Account is deactive, Cound not update to hidden.",
    });
    return;
  }
  if (UserDetails && updateData != undefined) {
    Users.update(updateData, {
      returning: true,
      where: {
        u_id: id,
      },
    })
      .then(function ([num, [result]]) {
        if (num == 1) {
          audit_log.saveAuditLog(
            req.header(process.env.UKEY_HEADER || "x-api-key"),
            "update",
            "Users",
            id,
            result.dataValues,
            UserDetails
          );

          res.status(200).send({
            message: "User updated successfully.",
          });
        } else {
          res.status(400).send({
            message: `Cannot update Users with id=${id}. Maybe user was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        logger.log("error", err + ":updating User with id=" + id);
        res.status(500).send({
          message: err + "Error updating User with id=" + id,
        });
        return;
      });
  }
};
