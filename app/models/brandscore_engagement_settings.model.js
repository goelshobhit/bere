module.exports = (sequelize, Sequelize) => {
  const brandscore_engagement_settings = sequelize.define("brandscore_engagement_settings", {
    bes_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    engagement_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    engagement_level: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    brand_score: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
      createdAt: 'bes_created_at',
      updatedAt: 'bes_updated_at',
      freezeTableName: true,
      tableName: 'brandscore_engagement_settings',
      underscored: true
  });
  return brandscore_engagement_settings;
}