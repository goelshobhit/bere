"use strict";
const tableName = "co_reg";
const columnName = "cr_co_alias";
module.exports = {
  up: (queryInterface, Sequelize) => {
    const columnType = Sequelize.STRING(10);
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
