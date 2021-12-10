'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.changeColumn(
      'post_comment',
      'pc_comment_prof_img_url',
      {
		type: 'JSONB USING CAST("pc_comment_prof_img_url" as JSONB)'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
  }
};
