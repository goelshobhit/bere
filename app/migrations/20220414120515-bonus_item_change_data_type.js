'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.changeColumn(
      'bonus_item',
      'brand_task',
      {type: 'BOOLEAN USING CAST("brand_task" as BOOLEAN)'}
    )
  },

  down: (queryInterface, Sequelize) => {
  }
};
