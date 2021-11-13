'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.changeColumn(
      'campaign',
      'cp_campaign_desc',
      {
		type: 'TEXT USING CAST("cp_campaign_desc" as TEXT)'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
  }
};
