'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.renameColumn(
      'user_social_engage_ext',
      'usee_u_content_id','ucpl_content_id'
    )
  },

  down: (queryInterface, Sequelize) => {
  }
};
