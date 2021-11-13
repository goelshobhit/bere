"use strict";
const tableName = "user_login";
const columnName = "u_salt";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const columnType = Sequelize.TEXT;
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
