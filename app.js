const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const appConfig = require("./app/config/config.js");
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const common = require("./app/common.js");
const logger = require("./app/middleware/logger");
const helmet = require("helmet");
var hpp = require("hpp");
const morgan = require("morgan");
const https = require('http');
var fs = require("fs");
const socketIO = require('socket.io')
app.use(cors());
app.use(morgan("combined"));
app.use(helmet());
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
  apis: [__dirname + "/app/routes/*.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Social App api application." });
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
require("./app/routes/brand.routes")(app);
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
require("./app/routes/notify_event.routes")(app);
require("./app/routes/notify_trig.routes")(app);
require("./app/routes/notify_trig_sent.routes")(app);
require("./app/routes/video_ads.routes")(app);
require("./app/routes/video_ads_submit.routes")(app);
require("./app/routes/socket_server.routes")({app, io});
require("./app/routes/survey.routes")(app);
require("./app/routes/content_report.routes")(app);
server.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}.`)
});
common.mkdirpath(appConfig[env].FILE_UPLOAD_DIR);
common.mkdirpath('uploads/thumbnails');
