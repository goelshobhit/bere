'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bonus_usr', {
      bu_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bonus_usr_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_usr_riddim_level: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_usr_history_not_won: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_usr_followers_riddim: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_usr_created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      bonus_usr_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bonus_usr');
  }
};