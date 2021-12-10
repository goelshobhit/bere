"use strict";
const tableName = "user_content_post";
const columnName = "ucpl_user_fav";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const columnType = Sequelize.JSONB;
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
