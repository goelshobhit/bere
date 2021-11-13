'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.changeColumn(
      'user_social_engage_ext',
      'ucpl_content_id',
      {
		type: 'TEXT USING CAST("ucpl_content_id" as TEXT)'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
  }
};
