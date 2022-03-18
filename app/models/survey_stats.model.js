module.exports = (sequelize, Sequelize) => {
  const survey_stats = sequelize.define("survey_stats", {
    st_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    sr_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    srq_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    srq_answer_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    srq_answer_count: {
      allowNull: false,
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'st_created_at',
      updatedAt: 'st_updated_at',
      freezeTableName: true,
      tableName: 'survey_stats',
      underscored: true
  });
  return survey_stats;
}