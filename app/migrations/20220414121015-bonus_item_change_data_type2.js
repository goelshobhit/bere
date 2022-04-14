'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.changeColumn(
      'bonus_item',
      'bonus_item_is_active',
      {type: 'BOOLEAN USING CAST("bonus_item_is_active" as BOOLEAN)'}
    )
  },

  down: (queryInterface, Sequelize) => {
  }
};
