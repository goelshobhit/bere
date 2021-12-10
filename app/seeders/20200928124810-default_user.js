"use strict";
const crypto = require("crypto");
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("admin_users", [
      {
        au_name: "admin",
        au_salt: "crypto64RSASHA256",
        au_email: "info@admin.com",
        au_password: crypto
          .createHash("RSA-SHA256")
          .update("123456")
          .update("crypto64RSASHA256")
          .digest("hex"),
        au_active_status: 1,
        au_is_deleted: 0,
        ar_role_id: 1,
        au_created_at: new Date(),
        au_updated_at: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("admin_users", null, {});
  }
};
