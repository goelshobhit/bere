require("dotenv").config({ path: __dirname + "/.env" });
const envConfigs = require("../config/config.js");

const Sequelize = require("sequelize");
const Umzug = require("umzug");
const path = require("path");

const env = process.env.NODE_ENV || "development";
const dbConfig = envConfigs[env];
const db = {};

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  logging:true
});

const migrator = new Umzug({
  migrations: {
    // indicates the folder containing the migration .js files
    path: path.join(__dirname, "../migrations"),
    // inject sequelize's QueryInterface in the migrations
    params: [sequelize.getQueryInterface(), Sequelize]
  },
  // indicates that the migration data should be store in the database
  // itself through sequelize. The default configuration creates a table
  // named `SequelizeMeta`.
  storage: "sequelize",
  storageOptions: {
    sequelize: sequelize
  }
});

const seeder = new Umzug({
  migrations: {
    // indicates the folder containing the migration .js files
    path: path.join(__dirname, "../seeders"),
    // inject sequelize's QueryInterface in the migrations
    params: [sequelize.getQueryInterface(), Sequelize]
  },
  // indicates that the migration data should be store in the database
  // itself through sequelize. The default configuration creates a table
  // named `SequelizeMeta`.
  storage: "sequelize",
  storageOptions: {
    sequelize: sequelize
  }
});
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Modesl/Tables
db.brands = require("./brands.model.js")(sequelize, Sequelize);
db.campaigns = require("./campaigns.model")(sequelize, Sequelize);
db.tasks = require("./tasks.model")(sequelize, Sequelize);
db.hashtags = require("./task.hashtag.model")(sequelize, Sequelize);
db.admin_users = require("./admin.model")(sequelize, Sequelize);
db.admin_roles = require("./admin_roles.model")(sequelize, Sequelize);
db.users = require("./users.model")(sequelize, Sequelize);
db.user_profile = require("./user_profile.model")(sequelize, Sequelize);
db.user_social_ext = require("./user_social_ext.model")(sequelize, Sequelize);
db.user_preference = require("./user_preference.model")(sequelize, Sequelize);
db.user_social_reach = require("./user_social_reach_int.model")(sequelize, Sequelize);
db.user_social_engage = require("./user_social_engage_ext.model")(sequelize, Sequelize);
db.user_content_post = require("./user_content_post.model")(sequelize, Sequelize);
db.post_comment = require("./post_comment.model")(sequelize, Sequelize);
db.brands_budget = require("./brands_budget.model")(sequelize, Sequelize);
db.comments_likes = require("./comment_likes.model")(sequelize, Sequelize);
db.post_user_reactions = require("./task.reactions.model")(sequelize, Sequelize);
db.contest_task = require("./contest_task.model")(sequelize, Sequelize);
db.tasks_json = require("./tasks_json.model")(sequelize, Sequelize);
db.audit_log = require("./audit_log.model")(sequelize, Sequelize);
db.post_report = require("./post_report.model")(sequelize, Sequelize);
db.post_report = require("./post_report.model")(sequelize, Sequelize);
db.user_fan_following = require("./user_fan_following.model")(sequelize, Sequelize);
db.budget_history=require("./budget_history.model")(sequelize,Sequelize);
db.notify_grp = require("./notify_grp.model.js")(sequelize, Sequelize);
db.notify_event = require("./notify_event.model.js")(sequelize, Sequelize);
db.notify_trig = require("./notify_trig.model.js")(sequelize, Sequelize);
//email tempaltes 
db.mail_templates=require("./mail_templates.model")(sequelize,Sequelize);
db.user_feedback=require("./user_feedback.model")(sequelize,Sequelize);
//wallet db tables 
db.ledger_transactions=require("./ledgerTransaction.model")(sequelize,Sequelize);
db.account_balance=require("./accountBalance.model")(sequelize,Sequelize);
db.admin_setting=require("./adminSetting.model")(sequelize,Sequelize);

//Relations
db.campaigns.belongsTo(db.brands, {foreignKey: 'cr_co_id', targetKey: 'cr_co_id'});
db.brands.hasMany(db.campaigns, {foreignKey: 'cr_co_id', targetKey: 'cr_co_id'});
db.campaigns.hasMany(db.tasks, {foreignKey: 'cp_campaign_id', targetKey: 'cp_campaign_id'});
db.tasks.belongsTo(db.campaigns, {foreignKey: 'cp_campaign_id', targetKey: 'cp_campaign_id'});
db.campaigns.hasMany(db.contest_task, {foreignKey: 'cp_campaign_id', targetKey: 'cp_campaign_id'});
db.contest_task.belongsTo(db.campaigns, {foreignKey: 'cp_campaign_id', targetKey: 'cp_campaign_id'});
/*db.hashtags.belongsTo(db.tasks, {foreignKey: 'ta_task_id', targetKey: 'ta_task_id'});
db.tasks.hasOne(db.hashtags, {foreignKey: 'ta_task_id', targetKey: 'ta_task_id'});*/
db.admin_users.belongsTo(db.admin_roles, {foreignKey: 'ar_role_id', targetKey: 'ar_role_id'});
db.admin_roles.hasMany(db.admin_users, {foreignKey: 'ar_role_id', targetKey: 'ar_role_id'});
db.users.hasOne(db.user_profile, {foreignKey: 'u_id', targetKey: 'u_id'});
db.user_profile.belongsTo(db.users, {foreignKey: 'u_id', targetKey: 'u_id'});
db.users.hasOne(db.user_social_ext, {foreignKey: 'u_id', targetKey: 'u_id'});
db.user_social_ext.belongsTo(db.users, {foreignKey: 'u_id', targetKey: 'u_id'});




db.user_profile.hasMany(db.post_comment, {foreignKey: 'pc_commenter_uid', targetKey: 'u_id'});
db.post_comment.belongsTo(db.user_profile, {foreignKey: 'pc_commenter_uid', targetKey: 'u_id'});
db.brands_budget.belongsTo(db.brands, {foreignKey: 'cr_co_id', targetKey: 'cr_co_id'});
db.brands.hasMany(db.brands_budget, {foreignKey: 'cr_co_id', targetKey: 'cr_co_id'});


db.user_profile.hasMany(db.user_content_post, {foreignKey: 'ucpl_u_id', targetKey: 'u_id'});
db.user_content_post.belongsTo(db.user_profile, {foreignKey: 'ucpl_u_id', targetKey: 'u_id'});
// fan following
db.user_profile.hasMany(db.user_fan_following, {foreignKey: 'faf_to', targetKey: 'u_id'});
db.user_profile.hasMany(db.user_fan_following, {foreignKey: 'faf_by', targetKey: 'u_id'});
db.user_fan_following.belongsTo(db.user_profile, {as:'following',foreignKey: 'faf_to', targetKey: 'u_id'});
db.user_fan_following.belongsTo(db.user_profile, { as:'follower',foreignKey: 'faf_by', targetKey: 'u_id'});




db.users.hasMany(db.user_content_post, {foreignKey: 'ucpl_u_id', targetKey: 'u_id'});

db.user_content_post.hasMany(db.post_comment, {foreignKey: 'ucpl_id', targetKey: 'ucpl_id'});
db.user_content_post.hasMany(db.post_user_reactions, {foreignKey: 'ucpl_id', targetKey: 'ucpl_id'});

db.contest_task.hasMany(db.user_content_post, {foreignKey: 'ta_task_id', targetKey: 'ct_id'});
db.tasks.hasMany(db.user_content_post, {foreignKey: 'ta_task_id', targetKey: 'ta_task_id'});

db.user_content_post.belongsTo(db.contest_task, {as:'contestPosts',foreignKey: 'ta_task_id', targetKey: 'ct_id'});
db.user_content_post.belongsTo(db.tasks, {as:'taskPosts',foreignKey: 'ta_task_id', targetKey: 'ta_task_id'});
db.migrator = migrator;
db.seeder = seeder;
module.exports = db;
