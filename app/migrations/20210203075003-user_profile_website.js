"use strict";
const tableName = "user_profile";
const columnName = "u_website";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const columnType = Sequelize.STRING;
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
