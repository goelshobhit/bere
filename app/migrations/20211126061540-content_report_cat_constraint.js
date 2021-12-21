'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('content_report', {
      fields: ['content_report_cat_id'],
      type: 'foreign key',
      name: 'content_report_cat_id_fkey', // optional
      references: {
        table: 'content_report_category',
        field: 'content_report_cat_id'
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
