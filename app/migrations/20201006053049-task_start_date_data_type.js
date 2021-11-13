'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.changeColumn(
      'task',
      'ta_start_date',
      {
		type: 'TIMESTAMP USING CAST("ta_start_date" as TIMESTAMP)'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
  }
};
