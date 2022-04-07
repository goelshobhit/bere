"use strict";
const tableName = "bonus_item";
const columnName = "bonus_item_giveaway_type";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [];
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        promises.push(queryInterface.addColumn(tableName, columnName, {
          type: Sequelize.INTEGER         
        }));
      }
      if (!tableDefinition['brand_task']) {
        promises.push(queryInterface.addColumn(tableName, 'brand_task', {
          type: Sequelize.INTEGER   
        }));
      }
      if (!tableDefinition['number_of_tasks_available']) {
        promises.push(queryInterface.addColumn(tableName, 'number_of_tasks_available', {
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
