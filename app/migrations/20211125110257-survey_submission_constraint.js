'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('survey_submissions', {
      fields: ['srs_sr_id'],
      type: 'foreign key',
      name: 'survey_submissions_srs_sr_id_fkey', // optional
      references: {
        table: 'survey',
        field: 'sr_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
