"use strict";
const tableName = "survey";
const columnName = "sr_hashtags";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      return queryInterface.changeColumn(tableName, columnName, {
        type: 'JSONB USING CAST("sr_hashtags" as JSONB)'
      });
    });
  },
  down: (queryInterface, Sequelize) => {
  }
};

