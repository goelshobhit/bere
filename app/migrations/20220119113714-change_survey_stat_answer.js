'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    
    await queryInterface.changeColumn(
      'survey_stats',
      'srq_answer',
      {
		type: 'INTEGER USING CAST("srq_answer" as INTEGER)'
      }
    )
    return queryInterface.renameColumn('survey_stats', 'srq_answer', 'srq_answer_id')
  },

  down: (queryInterface, Sequelize) => {
  }
};
