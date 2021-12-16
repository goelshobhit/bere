module.exports = (sequelize, Sequelize) => {
  const rewards_event_request = sequelize.define("rewards_event_request", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    rewards_event_request_id: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    user_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    rewards_event_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    rewards_event_type: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    status: {
      allowNull: false,
      defaultValue: '0',
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      freezeTableName: true,
      tableName: 'rewards_event_request',
      underscored: true
  });
  return rewards_event_request;
}