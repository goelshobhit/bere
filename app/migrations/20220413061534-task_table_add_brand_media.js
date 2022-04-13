"use strict";
const tableName = "task";
const columnName = "brand_id";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [];
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        promises.push(queryInterface.addColumn(tableName, columnName, {
          type: Sequelize.INTEGER         
        }));
      }
      if (!tableDefinition['media_type']) {
        promises.push(queryInterface.addColumn(tableName, 'media_type', {
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
