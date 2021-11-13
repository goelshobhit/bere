'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.changeColumn(
      'user_profile',
      'u_status',
      {
		type: 'TEXT USING CAST("u_status" as TEXT)'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
  }
};
