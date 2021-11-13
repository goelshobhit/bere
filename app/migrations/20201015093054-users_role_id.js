"use strict";
const tableName = "user_login";
const columnName = "ar_role_id";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const columnType = Sequelize.INTEGER;
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        return queryInterface.addColumn(tableName, columnName, { type:columnType,defaultValue: 0});
      } else {
        return Promise.resolve();
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(tableName, columnName);
  }
};
