"use strict";
const tableName = "task";
const columnName = "ta_contiue_spend_budget";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const columnType = Sequelize.BOOLEAN;
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        return queryInterface.addColumn(tableName, columnName, {
		type: columnType
		});
      } else {
        return Promise.resolve();
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(tableName, columnName);
  }
};
