"use strict";
const tableName = "user_social_ext";
const columnName = "show_twitter";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const columnType = Sequelize.BOOLEAN;
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        return queryInterface.addColumn(tableName, columnName, { type:columnType,defaultValue: true});
      } else {
        return Promise.resolve();
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(tableName, columnName);
  }
};
