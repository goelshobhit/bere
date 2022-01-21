'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.changeColumn(
      'survey_submissions',
      'srs_srq_answer',
      {
		type: 'JSONB USING CAST("srs_srq_answer" as JSONB)'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
  }
};
