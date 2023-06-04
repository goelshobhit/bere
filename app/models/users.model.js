const crypto = require("crypto");
module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define(
    "user_login",
    {
      u_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      u_referer_id: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      u_acct_type: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      u_act_sec: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      u_login: {
        type: Sequelize.STRING(100),
      },
      u_pass: {
        type: Sequelize.STRING(100),
      },
      u_email: {
        type: Sequelize.STRING(50),
        //  unique: 'uniqueuser_login'
      },
      u_active: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      u_fb_username: {
        type: Sequelize.STRING(50),
      },
      u_fb_id: {
        type: Sequelize.STRING(50),
      },
      u_gmail_username: {
        type: Sequelize.STRING(50),
      },
      u_gmail_id: {
        type: Sequelize.STRING(50),
      },
      u_ymail_username: {
        type: Sequelize.STRING(50),
      },
      u_ymail_id: {
        type: Sequelize.STRING(50),
      },
      u_pref_login: {
        type: Sequelize.INTEGER,
      },
      u_deactive_me: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      u_instagram_username: {
        type: Sequelize.STRING(50),
      },
      u_instagram_id: {
        type: Sequelize.STRING(50),
      },
      u_salt: {
        type: Sequelize.TEXT,
      },
      u_email_verify_status: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      u_heartbeat_timestamp: {
        type: Sequelize.STRING(50),
      },
      is_autotakedown: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      is_user_deactivated: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      is_user_hidden: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      username: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      job_title: {
        type: Sequelize.STRING,
      },
      bio: {
        type: Sequelize.TEXT,
      },
      referral_code: {
        type: Sequelize.STRING,
      },
      referral_link: {
        type: Sequelize.STRING,
      },
      u_email_otp: {
        type: Sequelize.INTEGER,
      },
    },
    {
      createdAt: "u_created_at",
      updatedAt: "u_updated_at",
      freezeTableName: true,
      tableName: "user_login",
      underscored: true,
    }
  );
  Users.generateSalt = function () {
    return crypto.randomBytes(16).toString("base64");
  };
  Users.encryptPassword = function (plainText, salt) {
    return crypto
      .createHash("RSA-SHA256")
      .update(plainText)
      .update(salt)
      .digest("hex");
  };
  Users.authenticate = async function (email, colmn) {
    const user = Users.findOne({
      attributes: [
        "u_id",
        "u_referer_id",
        "u_salt",
        "u_pass",
        "u_acct_type",
        "u_act_sec",
        "u_email",
        "u_active",
        "u_pref_login",
        "u_created_at",
        "u_updated_at",
        "u_deactive_me",
        "is_user_deactivated",
        "is_user_hidden",
      ],
      where: { [colmn]: email },
    });
    if (user) {
      return user;
    } else {
      return false;
    }
  };
  return Users;
};
