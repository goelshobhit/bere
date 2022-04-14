"use strict";
const tableName = "bonus_item";
const columnName = "bonus_item_dollar_value";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [];
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        promises.push(queryInterface.addColumn(tableName, columnName, {
          type: Sequelize.DECIMAL(10,2)         
        }));
      }
      if (!tableDefinition['bonus_item_is_active']) {
        promises.push(queryInterface.addColumn(tableName, 'bonus_item_is_active', {
          type: Sequelize.BOOLEAN,        
          defaultValue: true        
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
