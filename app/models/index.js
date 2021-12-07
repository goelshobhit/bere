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
db.brands = require("./brands.model")(sequelize, Sequelize);
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
db.bonus_ticket = require("./bonus_ticket.model")(sequelize, Sequelize);
db.bonus_ticket_rules = require("./bonus_ticket_rules.model")(sequelize, Sequelize);
db.bonus_task = require("./bonus_task.model")(sequelize, Sequelize);
db.bonus_rewards = require("./bonus_rewards.model")(sequelize, Sequelize);
db.users.hasMany(db.bonus_ticket, {foreignKey: 'u_id', targetKey: 'bonus_ticket_usrid'});
db.bonus_ticket.belongsTo(db.users, {foreignKey: 'bonus_ticket_usrid', targetKey: 'u_id'});

//notification templates
db.notify_grp = require("./notify_grp.model")(sequelize, Sequelize);
db.notify_event = require("./notify_event.model")(sequelize, Sequelize);
db.notify_trig = require("./notify_trig.model")(sequelize, Sequelize);
db.notify_trig_sent = require("./notify_trig_sent.model")(sequelize, Sequelize);
// video ads templates
db.video_ads = require("./video_ads.model")(sequelize, Sequelize);
db.video_ads_submit = require("./video_ads_submit.model")(sequelize, Sequelize);
//email tempaltes 
db.mail_templates=require("./mail_templates.model")(sequelize,Sequelize);
db.user_feedback=require("./user_feedback.model")(sequelize,Sequelize);
//wallet db tables 
db.ledger_transactions=require("./ledgerTransaction.model")(sequelize,Sequelize);
db.account_balance=require("./accountBalance.model")(sequelize,Sequelize);
db.admin_setting=require("./adminSetting.model")(sequelize,Sequelize);
db.search_results = require("./search_results.model")(sequelize, Sequelize);
db.search_objects = require("./search_objects.model")(sequelize, Sequelize);
db.survey = require("./survey.model")(sequelize, Sequelize);
db.survey_questions = require("./survey_questions.model")(sequelize, Sequelize);
db.survey_submissions = require("./survey_submissions.model")(sequelize, Sequelize);
db.survey_stats = require("./survey_stats.model")(sequelize, Sequelize);
db.survey_user_complete = require("./survey_user_complete.model")(sequelize, Sequelize);
db.content_report = require("./content_report.model")(sequelize, Sequelize);
db.content_report_category = require("./content_report_category.model")(sequelize, Sequelize);
db.content_report_user = require("./content_report_user.model")(sequelize, Sequelize);
db.content_report_moderate = require("./content_report_moderate.model")(sequelize, Sequelize);
db.bonus_usr = require("./bonus_usr.model")(sequelize, Sequelize);
db.bonus_sm_share = require("./bonus_sm_share.model")(sequelize, Sequelize);
db.bonus_item = require("./bonus_item.model")(sequelize, Sequelize);
db.bonus_set = require("./bonus_set.model")(sequelize, Sequelize);

//Relations
db.brands.hasMany(db.video_ads, {foreignKey: 'cr_co_id', targetKey: 'cr_co_id'});
db.video_ads.belongsTo(db.brands, {foreignKey: 'cr_co_id', targetKey: 'cr_co_id'});
db.notify_trig.hasMany(db.notify_trig_sent, {foreignKey: 'notify_trig_id', targetKey: 'notify_trig_id'});
db.notify_trig_sent.belongsTo(db.notify_trig, {foreignKey: 'notify_trig_id', targetKey: 'notify_trig_id'});
db.brands.hasMany(db.notify_event, {foreignKey: 'cr_co_id', targetKey: 'cr_co_id'});
db.notify_event.belongsTo(db.brands, {foreignKey: 'cr_co_id', targetKey: 'cr_co_id'});
db.brands.hasMany(db.notify_trig, {foreignKey: 'cr_co_id', targetKey: 'cr_co_id'});
db.notify_trig.belongsTo(db.brands, {foreignKey: 'cr_co_id', targetKey: 'cr_co_id'})
db.notify_event.hasMany(db.notify_trig, {foreignKey: 'notify_event_id', targetKey: 'notify_event_id'});
db.notify_trig.belongsTo(db.notify_event, {foreignKey: 'notify_event_id', targetKey: 'notify_event_id'});
db.notify_grp.hasMany(db.notify_trig, {foreignKey: 'notify_trig_grp_id', targetKey: 'notify_trig_grp_id'});
db.notify_trig.belongsTo(db.notify_grp, {foreignKey: 'notify_trig_grp_id', targetKey: 'notify_trig_grp_id'});
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
db.survey.belongsTo(db.brands, {foreignKey: 'sr_brand_id', targetKey: 'cr_co_id'});
db.brands.hasMany(db.survey, {foreignKey: 'sr_brand_id', targetKey: 'cr_co_id'});
db.survey_questions.belongsTo(db.survey, {foreignKey: 'sr_id', targetKey: 'sr_id'});
db.survey.hasMany(db.survey_questions, {foreignKey: 'sr_id', targetKey: 'sr_id'});

db.survey_submissions.belongsTo(db.survey, {foreignKey: 'srs_sr_id', targetKey: 'sr_id'});
db.survey.hasMany(db.survey_submissions, {foreignKey: 'srs_sr_id', targetKey: 'sr_id'});

db.survey_stats.belongsTo(db.survey, {foreignKey: 'sr_id', targetKey: 'sr_id'});
db.survey.hasMany(db.survey_stats, {foreignKey: 'sr_id', targetKey: 'sr_id'});
db.content_report.belongsTo(db.content_report_category, {foreignKey: 'content_report_cat_id', targetKey: 'content_report_cat_id'});
db.content_report_category.hasMany(db.content_report, {foreignKey: 'content_report_cat_id', targetKey: 'content_report_cat_id'});

db.content_report_user.belongsTo(db.content_report, {foreignKey: 'content_report_id', targetKey: 'content_report_id'});
db.content_report.hasMany(db.content_report_user, {foreignKey: 'content_report_id', targetKey: 'content_report_id'});

db.content_report_user.belongsTo(db.content_report_category, {foreignKey: 'content_report_cat_id', targetKey: 'content_report_cat_id'});
db.content_report_category.hasMany(db.content_report_user, {foreignKey: 'content_report_cat_id', targetKey: 'content_report_cat_id'});

db.content_report.hasOne(db.content_report_moderate, {foreignKey: 'content_report_id', targetKey: 'content_report_id'});
db.content_report_moderate.belongsTo(db.content_report, {foreignKey: 'content_report_id', targetKey: 'content_report_id'});
db.user_profile.belongsTo(db.bonus_usr, {foreignKey: 'u_id', targetKey: 'bonus_usr_id'});
db.bonus_usr.hasOne(db.user_profile, {foreignKey: 'u_id', targetKey: 'bonus_usr_id'});


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
db.users.hasMany(db.notify_trig_sent, {foreignKey: 'u_id', targetKey: 'u_id'});
db.notify_trig_sent.belongsTo(db.users, {foreignKey: 'u_id', targetKey: 'u_id'});
db.user_content_post.hasMany(db.post_comment, {foreignKey: 'ucpl_id', targetKey: 'ucpl_id'});
db.user_content_post.hasMany(db.post_user_reactions, {foreignKey: 'ucpl_id', targetKey: 'ucpl_id'});

db.contest_task.hasMany(db.user_content_post, {foreignKey: 'ta_task_id', targetKey: 'ct_id'});
db.tasks.hasMany(db.user_content_post, {foreignKey: 'ta_task_id', targetKey: 'ta_task_id'});

db.user_content_post.belongsTo(db.contest_task, {as:'contestPosts',foreignKey: 'ta_task_id', targetKey: 'ct_id'});
db.user_content_post.belongsTo(db.tasks, {as:'taskPosts',foreignKey: 'ta_task_id', targetKey: 'ta_task_id'});
db.brands.hasMany(db.bonus_item, {foreignKey: 'bonus_item_brand_id', targetKey: 'cr_co_id'});
db.bonus_item.belongsTo(db.brands, {foreignKey: 'bonus_item_brand_id', targetKey: 'cr_co_id'});
db.brands.hasMany(db.bonus_set, {foreignKey: 'bonus_set_brand_id', targetKey: 'cr_co_id'});
db.bonus_set.belongsTo(db.brands, {foreignKey: 'bonus_set_brand_id', targetKey: 'cr_co_id'});
db.migrator = migrator;
db.seeder = seeder;
module.exports = db;
