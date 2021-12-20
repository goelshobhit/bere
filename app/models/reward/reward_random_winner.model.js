module.exports = (sequelize, Sequelize) => {
  const reward_random_winner = sequelize.define("reward_random_winner", {
    random_winner_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    Random_winner_usrid: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    Random_winner_event_name: {
      allowNull: false,
      type: Sequelize.STRING(100)
    },
    Random_winner_selected: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    Random_winner_event_id: {
      type: Sequelize.INTEGER
    },
    Random_winner_admin_id: {
      type: Sequelize.INTEGER
    },
    Randon_winner_ack: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      freezeTableName: true,
      tableName: 'reward_random_winner',
      underscored: true
  });
  return reward_random_winner;
}