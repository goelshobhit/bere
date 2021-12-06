'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bonus_set', {
      bonus_set_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bonus_set_brand_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_item_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_set_item_name: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      bonus_set_item_qty: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_set_item_timestamp: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      bonus_set_status: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      bonus_set_created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      bonus_set_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bonus_set');
  }
};