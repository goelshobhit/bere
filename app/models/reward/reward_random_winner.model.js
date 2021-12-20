module.exports = (sequelize, Sequelize) => {
  const reward_random_winner = sequelize.define("reward_random_winner", {
    random_winner_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    random_winner_usrid: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    random_winner_reward_id: {
      type: Sequelize.INTEGER
    },
    random_winner_reward_name: {
      type: Sequelize.STRING(100)
    },
    random_winner_event_id: {
      type: Sequelize.INTEGER
    },
    random_winner_event_type: {
      type: Sequelize.STRING(50)
    },
    random_winner_selected: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    random_winner_admin_id: {
      type: Sequelize.INTEGER
    },
    randon_winner_ack: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'random_winner_created_at',
      updatedAt: 'random_winner_updated_at',
      freezeTableName: true,
      tableName: 'reward_random_winner',
      underscored: true
  });
  return reward_random_winner;
}