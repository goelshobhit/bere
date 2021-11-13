"use strict";
const tableName = "user_social_engage_ext";
const columnName = "usee_u_social_post_id";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const columnType = Sequelize.TEXT;
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
