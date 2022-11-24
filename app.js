var cluster = require('cluster');
if (cluster.isMaster && 0) {
   var i = 0;
   for (i; i< 4; i++){
     cluster.fork();
   }
   cluster.on('exit', function(instance){
      console.log('NodeJs Cluster: Instance ' + instance.id + ' went into an incident now an another instance will be created.');
      cluster.fork();
   });
}
else {
const express = require("express");
const basicAuth = require('express-basic-auth');
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const appConfig = require("./app/config/config.js");
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const common = require("./app/common.js");
const logger = require("./app/middleware/logger");
//const helmet = require("helmet");
var hpp = require("hpp");
const morgan = require("morgan");
const https = require('http');
var fs = require("fs");
const socketIO = require('socket.io')
app.use(cors());
app.use(morgan("combined"));
//app.use(helmet());
const schedule = require('node-schedule');
// parse requests of content-type - application/json
app.use(bodyParser.json());
// set node environment
const env = process.env.NODE_ENV || "development";
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(hpp());
const db = require("./app/models");
const Tasks = db.tasks
async function setupDbSeederAndMigrations() {
  // check DB connection and log errors
  await db.sequelize
    .authenticate()
    .then(() => {
      console.log("info", "DB Connection has been established successfully.");
    })
    .catch(err => {
      console.log("error", "Unable to connect to the database ", err);
    });

  // Sync all defined models to the DB
  await db.sequelize.sync().then(
    () => {
      console.log("info", "Database Tables created");
    },
    error => {
      console.log("error", error);
    }
  );

  // run DB migrations, so that migration tracking table SequelizeMeta is created
  await db.migrator.up().then(
    () => {
      console.log("info", "Database migrations executed");
    },
    error => {
      console.log("error", "Error in running migrations ", error);
    }
  );

  // run seeders to populate the data into tables, make sure to run seeders
  // after the migrations
  await db.seeder.up().then(
    () => {
      console.log("info", "Database seeders executed");
    },
    error => {
      console.log("error", "Error in running seeders ", error);
    }
  );
}

// call the async function to setup DB
setupDbSeederAndMigrations();
// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Social App API",
      description: "REST APIs to interact with app of Social Application",
      contact: {
        name: "SocialApp",
        url: "https://earnki.com",
        email: "Info@earnki.com"
      },
      servers: [
        {
          url: "/"
        }
      ]
    },
    components: {
      securitySchemes: {
        authToken: {
          type: "apiKey",
          in: "header",
          name: process.env.TOKEN_HEADER || "x-auth-token"
        },
        apiKey: {
          type: "apiKey",
          in: "header",
          name: process.env.UKEY_HEADER || "x-api-key"
        }
      }
    },
    security: [
      {
        authToken: [],
        apiKey: []
      }
    ]
  },
  apis: [__dirname + "/app/routes/*.js",
   __dirname + "/app/routes/contentReport/*.js",
   __dirname + "/app/routes/bonus/*.js",
   __dirname + "/app/routes/reward/*.js"]
};
var options = {
  swaggerOptions: {
    docExpansion: "list"
  }
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
//app.use("/swagger-documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));
app.use("/swagger-documentation",basicAuth({
  users: {'social-app': 'info@123#'},
  challenge: true,
}), swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Social App api application." });
});
//global exception handler
process.on('uncaughtException', function (err) {
  console.log('Instance: This instance went into trouble and will be terminated then an another instance will be started');
  console.log('Instance: There is an uncaught exception', err);
});
// simple schedule for task 
const Op = db.Sequelize.Op;
const taskJson = db.tasks_json;
const Posts = db.user_content_post;
const Contest = db.contest_task
const job = schedule.scheduleJob('05 00 * * *',async function(){
   var todayDate=new Date();
   console.log("scheduleJob at :" +todayDate);
   logger.log("info", "scheduleJob at :" +todayDate);
   todayDate.toLocaleString('en-US', { timeZone: 'Asia/Calcutta' })
   var options = {
	   attributes:['ta_task_id'],
        where: {
			ta_task_id:2,
			ta_end_date: {
			  [Op.lte]: todayDate
			 }
			}
    };
    Tasks.findAll(options).then(result =>{
		var taskarray=result;
		var lngTemp=Object.keys(taskarray).length;
			for(i=0;i<lngTemp;i++)
			{
				var taskId=taskarray[i].dataValues.ta_task_id;
				taskJson.destroy({
					where:{
					tj_task_id:`${taskId}`,
					tj_type:'Single'
					}
				});
				Posts.update({
					ucpl_status:0,
					},{
					where:{
					ta_task_id:`${taskId}`,
					ucpl_content_type:1
					}
				});
				Tasks.update({
					ucpl_status:4,
					},{
					where:{
					ta_task_id:`${taskId}`
					}
				});
			}
	});
	var options = {
	   attributes:['ct_id'],
        where: {
			ct_status:2,
			ct_winner_date: {
			  [Op.lte]: todayDate
			 }
			}
    };
    Contest.findAll(options).then(result =>{
		var taskarray=result;
		var lngTemp=Object.keys(taskarray).length;
			for(i=0;i<lngTemp;i++)
			{
				var taskId=taskarray[i].dataValues.ct_id;
				taskJson.destroy({
					where:{
					tj_task_id:`${taskId}`,
					tj_type:'Contest'
					}
				});
				Posts.update({
					ucpl_status:0,
					},{
					where:{
					ta_task_id:`${taskId}`,
					ucpl_content_type: 2
					}
				});
				Contest.update({
					ct_status:4,
					},{
					where:{
					ct_id:`${taskId}`
					}
				});
			}
	});
	
});
//Set up the passport to do social login
// const passport = require('passport');
// app.use(passport.initialize());
// require("./app/middleware/socialLogin/passportFacebook")(passport);
// require("./app/middleware/socialLogin/passportInstagram")(passport);
// require("./app/middleware/socialLogin/passportSnapchat")(passport);
// require("./app/middleware/socialLogin/passportPinterest")(passport);
// const session = require("express-session");
// app.use(session({
//   secret: 'twitterSecret',
//   key: 'sid', cookie: { secure: true }}
// ));
// app.use(session({
//   secret: 'twitterSecret',
//   key: 'sid', cookie: { secure: false }}
// ));
// require("./app/middleware/socialLogin/passportTwitter")(passport);
// set port, listen for requests
// set port, listen for requests
const PORT = process.env.PORT || 3030;
const server = https.createServer({
  //key: fs.readFileSync('/etc/letsencrypt/live/earnki.com/privkey.pem'),
  //cert: fs.readFileSync('/etc/letsencrypt/live/earnki.com/fullchain.pem')
 }, app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});
require("./app/routes/app_suggestion.routes")(app);
require("./app/routes/brand.routes")(app);
require("./app/routes/brand_user.routes")(app);
require("./app/routes/campaign.routes")(app);
require("./app/routes/hashtag.routes")(app);
require("./app/routes/tasks.routes")(app);
require("./app/routes/admin.routes")(app);
require("./app/routes/roles.routes")(app);
require("./app/routes/users.routes")(app);
require("./app/routes/user_post.routes")(app);
require("./app/routes/comments.routes")(app);
require("./app/routes/comment_likes.routes")(app);
require("./app/routes/post_reaction.routes")(app);
require("./app/routes/post_report.routes")(app);
require("./app/routes/audit_log.routes")(app);
require("./app/routes/search.routes")(app);
require("./app/routes/notify_grp.routes")(app);
require("./app/routes/notify_object.routes")(app);
require("./app/routes/notify_cat.routes")(app);
require("./app/routes/notify_event.routes")(app);
require("./app/routes/notify_trig.routes")(app);
require("./app/routes/notify_trig_sent.routes")(app);
require("./app/routes/watch_ads_task.routes")(app);
require("./app/routes/watch_ads_task_submit.routes")(app);
require("./app/routes/socket_server.routes")({app, io});
require("./app/routes/survey.routes")(app);
require("./app/routes/bonus/bonus_user.routes")(app);
require("./app/routes/bonus/bonus_sm_share.routes")(app);
require("./app/routes/bonus/bonus_item.routes")(app);
require("./app/routes/bonus/bonus_item_set.routes")(app);
require("./app/routes/bonus/bonus_summary.routes")(app);
require("./app/routes/bonus/bonus_ticket_rules.routes")(app);
require("./app/routes/bonus/bonus_ticket.routes")(app);
require("./app/routes/bonus/bonus_task.routes")(app);
require("./app/routes/bonus/bonus_reward.routes")(app);
require("./app/routes/reward/reward_center.routes")(app);
require("./app/routes/reward/reward_center_dist.routes")(app);
require("./app/routes/reward/rewards_event_request.routes")(app);
require("./app/routes/reward/rewards_request.routes")(app);
require("./app/routes/reward/rewards_given.routes")(app);
require("./app/routes/reward/rewards_selection.routes")(app);
require("./app/routes/reward/reward_settings.routes")(app);
require("./app/routes/user_inbox_settings.routes")(app);
require("./app/routes/energy.routes")(app);
require("./app/routes/brand_score.routes")(app);
require("./app/routes/blacklisted.routes")(app);
require("./app/routes/contentReport/content_report_category.routes")(app);
require("./app/routes/contentReport/content_report.routes")(app);
require("./app/routes/level_task.routes")(app);
require("./app/routes/content_viewer_rewards.routes")(app);
require("./app/routes/voting.routes")(app);
require("./app/routes/tickets_distribution.routes")(app);
require("./app/routes/user_winner.routes")(app);
require("./app/routes/image_upload.routes")(app);
require("./app/routes/mini_task.routes")(app);
require("./app/routes/task_caption.routes")(app);
require("./app/routes/page_location.routes")(app);
require("./app/routes/faq.routes")(app);
require("./app/routes/tips.routes")(app);
require("./app/routes/terms_conditions.routes")(app);
require("./app/routes/autocomplete_place.routes")(app);
require("./app/routes/users_invitation.routes")(app);
// require("./app/routes/social_login.routes")({app, passport});
require("./app/routes/content_feedback_settings.routes")(app);
require("./app/routes/content_feedback.routes")(app);
require("./app/routes/category.routes")(app);
require("./app/routes/additional_info_data.routes")(app);
require("./app/routes/additional_info_heading.routes")(app);
require("./app/routes/help_support.routes")(app);
server.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}.`)
});
common.mkdirpath(appConfig[env].FILE_UPLOAD_DIR);
common.mkdirpath('uploads/thumbnails');
}