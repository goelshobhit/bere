"use strict";
const tableName = "task";
const columnName = "tickets_per_task_submissions";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [];
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        promises.push(queryInterface.addColumn(tableName, columnName, {
          type: Sequelize.INTEGER         
        }));
      }
      if (!tableDefinition['ta_media']) {
        promises.push(queryInterface.addColumn(tableName, 'ta_media', {
          type: Sequelize.JSONB   
        }));
      }
      if (promises.length) {
        return Promise.all(promises);
      } else {
        return Promise.resolve();
      }
     
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(tableName, columnName);
  }
};
