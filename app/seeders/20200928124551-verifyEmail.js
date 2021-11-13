"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("mail_templates", [
      {
        mt_name: "verify_email",
        mt_subject: "Email Verify: link to verify email id",
        mt_body: "Welcome ,Please click verfiy link and verfiy email address <a href='[VLINK]'>verify now</a> ",
        mt_created_at: new Date(),
        mt_updated_at: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("mail_templates", null, {});
  }
};
