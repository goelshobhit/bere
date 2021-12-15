module.exports = (sequelize, Sequelize) => {
  const rewards_request = sequelize.define("rewards_request", {
    rewards_request_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    rewards_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    rewards_timestamp: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    rewards_user_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    rewards_event_owner_id: {
      type: Sequelize.INTEGER
    },
    rewards_request_token: {
      type: Sequelize.INTEGER
    },
    rewards_request_stars: {
      type: Sequelize.INTEGER
    },
    rewards_request_energy: {
      type: Sequelize.INTEGER
    },
    rewards_request_coins: {
      type: Sequelize.INTEGER
    },
    rewards_request_booster: {
      type: Sequelize.INTEGER
    },
    rewards_request_card: {
      type: Sequelize.INTEGER
    },
    rewards_event_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    rewards_event_type: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    rewards_event_request_id: {
      allowNull: false,
      type: Sequelize.STRING(50)
    }
  }, {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      freezeTableName: true,
      tableName: 'rewards_request',
      underscored: true
  });
  return rewards_request;
}