const util = require("util");
const multer = require("multer");
const appConfig = require("../config/config.js");
const env = process.env.NODE_ENV || "development";
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, appConfig[env].FILE_UPLOAD_DIR);
    },
    filename: (req, file, callback) => {
        const match = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/gif",
            "image/bmp",
            "image/webp",
            "image/heic",
            "image/heif",
            "audio/mp3",
            "audio/mpeg",
            "audio/wav",
            "audio/mp4",
            "audio/aac",
            "audio/amr",
            "audio/flac",
            "audio/ts",
            "audio/m4a",
            "audio/mkv",
            "audio/ogg",
            "video/mov",
            "video/mp4",      
            "video/3gp",
            "video/mkv",
            "video/webm",
            "video/m4v",
            "video/avi",
            "video/ts"
          ];

        if (match.indexOf(file.mimetype) === -1) {
            var message = `${file.originalname} is invalid type. Only accept image/video/audio.`;
            return callback(message, null);
        }
        var filename = `${Date.now()}-${file.originalname}`;
        callback(null, filename);
    }
});

var uploadFiles = multer({
    storage: storage
}).array("media_file", 4);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;