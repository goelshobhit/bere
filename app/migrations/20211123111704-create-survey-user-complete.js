'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('survey_user_complete', {
      su_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sr_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      sr_uid: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      sr_completion_date: {
        type: Sequelize.DATE
      },
      sr_usr_restriction: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      su_created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      su_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('survey_user_complete');
  }
};