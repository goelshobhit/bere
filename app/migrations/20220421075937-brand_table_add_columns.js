"use strict";
const tableName = "co_reg";
const columnName = "cr_co_snapchat_handle";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [];
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        promises.push(queryInterface.addColumn(tableName, columnName, {
          type: Sequelize.STRING(255)    
        }));
      }
      if (!tableDefinition['cr_co_tiktok_handle']) {
        promises.push(queryInterface.addColumn(tableName, 'cr_co_tiktok_handle', {
          type: Sequelize.STRING(255)   
        }));
      }
      if (!tableDefinition['cr_co_who_we_are_looking_for']) {
        promises.push(queryInterface.addColumn(tableName, 'cr_co_who_we_are_looking_for', {
          type: Sequelize.STRING(255)   
        }));
      }
      if (!tableDefinition['cr_co_restrictions']) {
        promises.push(queryInterface.addColumn(tableName, 'cr_co_restrictions', {
          type: Sequelize.STRING(255)   
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
