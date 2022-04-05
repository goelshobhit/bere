"use strict";
const tableName = "task";
const columnName = "reward_type";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        return queryInterface.addColumn(tableName, columnName, {
          type: Sequelize.INTEGER         // 1 tokens- fixed per entry ,2 = available presents (token value here) ,3 = available chests (token value here ), 4 = Contest (tokens to winner only)
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
