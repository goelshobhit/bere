const path = require("path");
const { ConsoleTransportOptions } = require("winston/lib/winston/transports");
const comment_likesModel = require("../models/comment_likes.model");
require("dotenv").config({ path: __dirname + "/.env" });
const defaultUpload = path.join(
  path.dirname(require.main.filename) + "/uploads"
);
module.exports = {
  localhost: {
    // Database variables
    USER: process.env.PGUSER,
    PASSWORD: process.env.PGPASSWORD,
    DB: process.env.PGDATABASE,
    HOST: process.env.PGHOST,
    PORT: process.env.PGPORT,
    dialect: process.env.DIALECT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
	UKEY_HEADER: process.env.UKEY_HEADER || "x-api-key",
    TOKEN_HEADER: process.env.TOKEN_HEADER || "x-auth-token",
	FILE_UPLOAD_DIR: process.env.FILE_UPLOAD_DIR || defaultUpload
  },
  development: {
    // Database variables
    USER: process.env.PGUSER,
    PASSWORD: process.env.PGPASSWORD,
    DB: process.env.PGDATABASE,
    HOST: process.env.PGHOST,
    PORT: process.env.PGPORT,
    dialect: process.env.DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
	UKEY_HEADER: process.env.UKEY_HEADER || "x-api-key",
    TOKEN_HEADER: process.env.TOKEN_HEADER || "x-auth-token",
	FILE_UPLOAD_DIR: process.env.FILE_UPLOAD_DIR || defaultUpload
  },
  test: {
    // Database variables
    USER: process.env.PGUSER,
    PASSWORD: process.env.PGPASSWORD || "m7h8YnyDXSymN9yx",
    DB: process.env.PGDATABASE || "postgreuser",
    HOST: process.env.PGHOST || "localhost",
    PORT: process.env.PGPORT || 5432,
    dialect: process.env.DIALECT || "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
	UKEY_HEADER: process.env.UKEY_HEADER || "x-api-key",
    TOKEN_HEADER: process.env.TOKEN_HEADER || "x-auth-token",
	FILE_UPLOAD_DIR: process.env.FILE_UPLOAD_DIR || defaultUpload
  },
  production: {
    // Database variables
  USER: process.env.PGUSER,
    PASSWORD: process.env.PGPASSWORD || "m7h8YnyDXSymN9yx",
    DB: process.env.PGDATABASE || "postgreuser",
    HOST: process.env.PGHOST || "localhost",
    PORT: process.env.PGPORT || 5432,
    dialect: process.env.DIALECT || "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
	UKEY_HEADER: process.env.UKEY_HEADER || "x-api-key",
    TOKEN_HEADER: process.env.TOKEN_HEADER || "x-auth-token",
	FILE_UPLOAD_DIR: process.env.FILE_UPLOAD_DIR || defaultUpload
  }
};
