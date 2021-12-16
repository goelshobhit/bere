module.exports = (sequelize, Sequelize) => {
  const rewards_credit = sequelize.define("rewards_credit", {
    rewards_credit_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    Rewards_credit_user_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    Rewards_credit_event_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    rewards_credit_approve_id: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER
    },
    rewards_credit_approve_timestamp: {
      type: Sequelize.STRING(50)
    },
    rewards_credit_transaction_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    rewards_credit_transaction_ack: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      freezeTableName: true,
      tableName: 'rewards_credit',
      underscored: true
  });
  return rewards_credit;
}