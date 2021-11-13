"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("mail_templates", [
      {
        mt_name: "forget_password",
        mt_subject: "Forget Password: Request for new Passord",
        mt_body: "Dear [EMAIL] new password generated successfully.New Password is : [NEWPWD]",
        mt_created_at: new Date(),
        mt_updated_at: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("mail_templates", null, {});
  }
};
