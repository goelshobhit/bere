module.exports = (sequelize, Sequelize) => {
  const bonus_rewards = sequelize.define("bonus_rewards", {
    bonus_rewards_id: {
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_summary_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_rewards_bonus_setid: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_rewards_usrid: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_rewards_item_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_rewards_item_name: {
      type: Sequelize.STRING(255)
    },
    bonus_rewards_item_qty: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_rewards_item_delivery_date: {
      type: Sequelize.STRING(255)
    },
    bonus_rewards_item_confirmation_date: {
      type: Sequelize.STRING(255)
    },
    bonus_rewards_additional_task_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'bonus_rewards_created_at',
      updatedAt: 'bonus_rewards_updated_at',
      freezeTableName: true,
      tableName: 'bonus_rewards',
      underscored: true
  });
  return bonus_rewards;
}