"use strict";
const tableName = "contest_task";
const columnName = "ct_winner_token";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const columnType = Sequelize.STRING;
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
