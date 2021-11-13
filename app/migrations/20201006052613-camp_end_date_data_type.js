'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.changeColumn(
      'campaign',
      'cp_campaign_end_date',
      {
		type: 'TIMESTAMP USING CAST("cp_campaign_start_date" as TIMESTAMP)'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
  }
};
