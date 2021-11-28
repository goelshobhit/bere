'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('content_report_category', {
      content_report_cat_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content_report_cat_autotakedown: {
        type: Sequelize.INTEGER
      },
      content_report_cat_name: {
        type: Sequelize.STRING(255)
      },
      content_report_cat_hide: {
        type: Sequelize.INTEGER
      },
      content_report_cat_usr_hide: {
        type: Sequelize.INTEGER
      },
      crc_created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      crc_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('content_report_category');
  }
};