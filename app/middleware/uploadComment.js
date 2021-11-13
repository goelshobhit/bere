const util = require("util");
const path = require("path");
const multer = require("multer");
const appConfig = require("../config/config.js");
const env = process.env.NODE_ENV || "development";
var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, appConfig[env].FILE_UPLOAD_DIR);
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg","image/jpg"];

    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid type. Only accept png/jpeg/jpg.`;
      return callback(message, null);
    }

    var filename = `${Date.now()}-comments-${file.originalname}`;
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage }).array("comment_file", 2);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
