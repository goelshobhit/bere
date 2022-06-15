'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.changeColumn(
      'watch_ads_task',
      'task_name',
       {
        type: Sequelize.STRING(100)
    }
    )
  },

  down: (queryInterface, Sequelize) => {
  }
};
