module.exports = (sequelize, Sequelize) => {
  const brandscore_engagement_type = sequelize.define("brandscore_engagement_type", {
    engagement_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    engagement_type: {
      type: Sequelize.STRING(255),
      allowNull: false
    }
  }, {
      createdAt: 'et_created_at',
      updatedAt: 'et_updated_at',
      freezeTableName: true,
      tableName: 'brandscore_engagement_type',
      underscored: true
  });
  return brandscore_engagement_type;
}