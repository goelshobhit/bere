'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bonus_sm_share', {
      bonus_sm_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bonus_sm_name: {
        type: Sequelize.STRING(255)
      },
      bonus_sm_share_user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_sm_share_timestamp: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      bonus_sm_share_ack: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_sm_share_url: {
        type: Sequelize.STRING(255)
      },
      bonus_sm_created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      bonus_sm_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bonus_sm_share');
  }
};