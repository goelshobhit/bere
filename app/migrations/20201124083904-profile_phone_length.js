'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.changeColumn(
      'user_profile',
      'u_phone',
      {type: Sequelize.STRING(15)}
    )
  },

  down: (queryInterface, Sequelize) => {
  }
};
