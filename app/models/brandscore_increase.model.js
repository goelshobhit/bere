module.exports = (sequelize, Sequelize) => {
  const brandscore_increase = sequelize.define("brandscore_increase", {
    brandscore_increase_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    brand_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    user_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    event_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    event_type: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    event_hashtag: {
      allowNull: false,
      type: Sequelize.STRING(255)
    },
    event_engagement_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    platform_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    brandscore_user_score_increase: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
      createdAt: 'bi_created_at',
      updatedAt: 'bi_updated_at',
      freezeTableName: true,
      tableName: 'brandscore_increase',
      underscored: true
  });
  return brandscore_increase;
}