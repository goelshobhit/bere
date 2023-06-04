"use strict";
const tableName = "user_login";
const columnName = "u_email_otp";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(tableName, columnName, {
      type: Sequelize.INTEGER,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(tableName, columnName);
  },
};
