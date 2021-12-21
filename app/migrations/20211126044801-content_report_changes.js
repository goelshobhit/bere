'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("content_report", "content_report_task_id", "content_report_type");
    await queryInterface.renameColumn("content_report", "content_report_content_id", "content_report_type_id");
    return queryInterface.changeColumn('content_report', 'content_report_type', {
      type: Sequelize.STRING(50)
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
