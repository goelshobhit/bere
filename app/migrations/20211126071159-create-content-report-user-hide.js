'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('content_report_user', {
      content_report_user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content_report_uid: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      content_report_cat_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      content_report_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      content_report_type: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      content_report_type_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      cru_status: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      cru_created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      cru_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('content_report_user');
  }
};