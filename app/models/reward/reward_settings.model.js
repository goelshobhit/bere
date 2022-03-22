module.exports = (sequelize, Sequelize) => {
  const reward_settings = sequelize.define("reward_settings", {
    reward_settings_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    token_value_in_usd: {
      type: Sequelize.INTEGER
    },
    star_value_in_tokens: {
      type: Sequelize.INTEGER
    },
    key_value_in_tokens: {
      type: Sequelize.INTEGER
    },
    booster_value_in_tokens: {
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'rs_created_at',
      updatedAt: 'rs_updated_at',
      freezeTableName: true,
      tableName: 'reward_settings',
      underscored: true
  });
  return reward_settings;
}