"use strict";
const tableName = "bonus_set";
const columnName = "bonus_set_start_date";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [];
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        promises.push(queryInterface.addColumn(tableName, columnName, {
          type: Sequelize.DATE         
        }));
      }
      if (!tableDefinition['bonus_set_default']) {
        promises.push(queryInterface.addColumn(tableName, 'bonus_set_default', {
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
