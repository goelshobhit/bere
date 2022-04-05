"use strict";
const tableName = "contest_task";
const columnName = "reward_type";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [];
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition[columnName]) {
        promises.push(queryInterface.addColumn(tableName, columnName, {
          type: Sequelize.INTEGER         
        }));
      }
      if (!tableDefinition['reward_center_id']) {
        promises.push(queryInterface.addColumn(tableName, 'reward_center_id', {
          type: Sequelize.INTEGER        
        }));
      }
      if (!tableDefinition['audience']) {
        promises.push(queryInterface.addColumn(tableName, 'audience', {
          type: Sequelize.INTEGER       
        }));
      }
      if (!tableDefinition['bonus_reward_type']) {
        promises.push(queryInterface.addColumn(tableName, 'bonus_reward_type', {
          type: Sequelize.INTEGER         
        }));
      }
      if (!tableDefinition['bonus_set_id']) {
        promises.push(queryInterface.addColumn(tableName, 'bonus_set_id', {
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
