const { createLogger, format, transports } = require("winston");
const { combine, timestamp } = format;
const appConfig = require("../config/config.js");
const env = process.env.NODE_ENV || "development";
const logger = createLogger({
  level: "info",
  format: combine(format.json(), format.colorize(), timestamp()),
  transports: [
    new transports.Console({
      format: combine(format.splat(), format.colorize(), timestamp())
    }),
	new transports.File({ filename: appConfig[env].FILE_UPLOAD_DIR+'/errors.log', level: 'error' }),
    new transports.File({ filename: appConfig[env].FILE_UPLOAD_DIR+'/combinedlog.log' })
  ],
  exceptionHandlers: [
    new transports.Console({
      format: combine(format.splat(), format.colorize(), timestamp())
    })
  ]
});

module.exports = logger;
