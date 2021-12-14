'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bonus_summary', {
      bonus_summary_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bonus_item_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_summary_name: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      bonus_summary_hashtag: {
        allowNull: false,
        type: Sequelize.JSONB
      },
      bonus_summary_timestamp: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      bonus_summary_start_timestamp: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      bonus_summary_entryclose_time: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      bonus_summary_end_date: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      bonus_summary_set_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_summary_set_items: {
        allowNull: false,
        type: Sequelize.JSONB
      },
      bonus_summary_set_items_qty: {
        allowNull: false,
        type: Sequelize.JSONB
      },
      bonus_summary_total_token: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_summary_total_stars: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_summary_stars_balance: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_summary_set_token_balance: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      bonus_summary_created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      bonus_summary_updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bonus_summary');
  }
};