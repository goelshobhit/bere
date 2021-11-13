"use strict";
const tableName = "task";
const columnName = "ta_desc";

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
