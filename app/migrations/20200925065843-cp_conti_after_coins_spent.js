"use strict";
const tableName = "campaign";
const columnName = "cp_conti_after_coins_spent";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const columnType = Sequelize.BOOLEAN;
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
