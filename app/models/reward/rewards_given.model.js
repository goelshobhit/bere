module.exports = (sequelize, Sequelize) => {
  const rewards_given = sequelize.define("rewards_given", {
    rewards_given_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    rewards_request_id: {
      type: Sequelize.INTEGER
    },
    rewards_event_id: {
      type: Sequelize.INTEGER
    },
    rewards_event_type: {
      type: Sequelize.STRING(50)
    },
    rewards_award_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    rewards_award_type: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    rewards_award_user_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    rewards_award_name: {
      type: Sequelize.STRING(255)
    },
    rewards_award_token: {
      type: Sequelize.INTEGER
    },
    rewards_award_stars: {
      type: Sequelize.INTEGER
    },
    rewards_award_energy: {
      type: Sequelize.INTEGER
    },
    rewards_award_coins: {
      type: Sequelize.INTEGER
    },
    rewards_award_booster: {
      type: Sequelize.INTEGER
    },
    rewards_award_card: {
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      freezeTableName: true,
      tableName: 'rewards_given',
      underscored: true
  });
  return rewards_given;
}