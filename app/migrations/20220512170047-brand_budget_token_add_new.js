"use strict";
const tableName = "co_budget";
const columnName = "token_value_in_usd";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [];
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        promises.push(queryInterface.addColumn(tableName, columnName, {
          type: Sequelize.INTEGER         
        }));
      }
      if (!tableDefinition['cr_bu_tokens']) {
        promises.push(queryInterface.addColumn(tableName, 'cr_bu_tokens', {
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
