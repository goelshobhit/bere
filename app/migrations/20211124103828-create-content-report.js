'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('content_report', {
      content_report_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content_report_cat_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      content_report_name: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      content_report_task_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      content_report_content_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      content_report_owner_id: {
        type: Sequelize.INTEGER
      },
      content_report_reporter_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      content_report_timestamp: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      content_report_reason: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      content_created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      content_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('content_report');
  }
};