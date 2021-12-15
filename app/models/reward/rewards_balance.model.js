module.exports = (sequelize, Sequelize) => {
  const rewards_balance = sequelize.define("rewards_balance", {
    rewards_balance_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    rewards_balance_owner_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    rewards_balance_taskid: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    rewards_balance_type: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    rewards_balance_task_name: {
      type: Sequelize.STRING(255)
    },
    rewards_balance: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER
    },
    rewards_award_token_bal: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER
    },
    rewards_award_stars_bal: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER
    },
    rewards_award_energy_bal: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER
    },
    rewards_award_coins_bal: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER
    },
    rewards_award_booster_bal: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER
    },
    rewards_award_card_bal: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      freezeTableName: true,
      tableName: 'rewards_balance',
      underscored: true
  });
  return rewards_balance;
}