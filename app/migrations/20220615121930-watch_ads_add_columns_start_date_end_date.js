"use strict";
const tableName = "watch_ads_task";
const columnName = "start_date";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [];
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        promises.push(queryInterface.addColumn(tableName, columnName, {
          type: Sequelize.DATE       
        }));
      }
      if (!tableDefinition['end_date']) {
        promises.push(queryInterface.addColumn(tableName, 'end_date', {
          type: Sequelize.DATE
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
