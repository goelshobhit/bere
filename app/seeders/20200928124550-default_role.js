"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("admin_roles", [
      {
        ar_name: "Admin",
        ar_action:`["user/add","user/view","user/all","user/update","user/delete","role/view","role/add","role/update","role/delete","role/all","brand/view","brand/add", "brand/update","brand/all", "brand/delete","campaign/view","campaign/add","campaign/update","campaign/delete","campaign/all","task/view","task/add","task/update","task/delete","task/all"]`,
        ar_status: 1,
        ar_created_at: new Date(),
        ar_updated_at: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("admin_roles", null, {});
  }
};
