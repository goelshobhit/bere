"use strict";
const tableName = "watch_ads_task";
const columnName = "video_thumbnail";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [];
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        promises.push(queryInterface.addColumn(tableName, columnName, {
          type: Sequelize.STRING       
        }));
      }
      if (!tableDefinition['audience']) {
        promises.push(queryInterface.addColumn(tableName, 'audience', {
          type: Sequelize.INTEGER
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
