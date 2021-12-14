'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('content_report_moderate', {
      crm_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content_report_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      content_report_autotakedown: {
        type: Sequelize.INTEGER
      },
      content_report_hide_from_user: {
        type: Sequelize.INTEGER
      },
      crm_desc: {
        type: Sequelize.TEXT
      },
      crm_created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      crm_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('content_report_moderate');
  }
};