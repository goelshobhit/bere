"use strict";
const tableName = "user_login";
const columnName = "u_email_verify_status";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const columnType = Sequelize.BOOLEAN;
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        return queryInterface.addColumn(tableName, columnName, { type:columnType,defaultValue: false});
      } else {
        return Promise.resolve();
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(tableName, columnName);
  }
};
