'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bonus_item', {
      bonus_item_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bonus_item_brand_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_item_name: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      bonus_item_qty: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_item_remaining_qty: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_item_timestamp: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      bonus_item_created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      bonus_item_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bonus_item');
  }
};