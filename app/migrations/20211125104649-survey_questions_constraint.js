'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('survey_questions', {
      fields: ['sr_id'],
      type: 'foreign key',
      name: 'survey_questions_sr_id_fkey', // optional
      references: {
        table: 'survey',
        field: 'sr_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
