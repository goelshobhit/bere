"use strict";
const tableName = "survey_submissions";
const columnName = "brand_id";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        return queryInterface.addColumn(tableName, columnName, {
          type: Sequelize.INTEGER
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
