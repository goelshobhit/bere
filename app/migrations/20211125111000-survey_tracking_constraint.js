'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('survey_user_complete', {
      fields: ['sr_id'],
      type: 'foreign key',
      name: 'survey_user_complete_sr_id_fkey', // optional
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
