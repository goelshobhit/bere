'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.changeColumn(
      'task',
      'ta_end_date',
      {
		type: 'TIMESTAMP USING CAST("ta_end_date" as TIMESTAMP)'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
  }
};
