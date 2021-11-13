"use strict";
const tableName = "user_profile";
const columnName = "phone_otp";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const columnType = Sequelize.INTEGER;
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        return queryInterface.addColumn(tableName, columnName, columnType);
      } else {
        return Promise.resolve();
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(tableName, columnName);
  }
};
