module.exports = (sequelize, Sequelize) => {
  const survey = sequelize.define("survey_questions", {
    srq_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    sr_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    question: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    status: {
      allowNull: false,
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'srq_created_at',
      updatedAt: 'srq_updated_at',
      freezeTableName: true,
      tableName: 'survey_questions',
      underscored: true
  });
  return survey;
}