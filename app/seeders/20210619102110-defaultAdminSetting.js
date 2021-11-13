"use strict";
const crypto = require("crypto");
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("admin_setting", [
      {
        ad_id: 1,
        ad_conversion_rate: 1,
        ad_min_withdraw_limit: 10,
        ad_max_withdraw_limit: 100,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("admin_setting", null, {});
  }
};
