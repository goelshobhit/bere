'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('content_report_moderate', {
      fields: ['content_report_id'],
      type: 'foreign key',
      name: 'content_report_moderate_content_report_id_fkey', // optional
      references: {
        table: 'content_report',
        field: 'content_report_id'
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
