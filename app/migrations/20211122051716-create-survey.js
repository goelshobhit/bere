'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('survey', {
      sr_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sr_brand_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sr_title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      sr_description: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      sr_hashtags: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      sr_color: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sr_startdate_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      sr_enddate_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      sr_created_date_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      sr_updated_date_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      sr_status: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('survey');
  }
};