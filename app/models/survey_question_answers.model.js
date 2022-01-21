module.exports = (sequelize, Sequelize) => {
  const survey = sequelize.define("survey_question_answers", {
    srq_answer_id: {
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
    answer: {
      allowNull: false,
      type: Sequelize.TEXT
    }
  }, {
      createdAt: 'srqa_created_at',
      updatedAt: 'srqa_updated_at',
      freezeTableName: true,
      tableName: 'survey_question_answers',
      underscored: true
  });
  return survey;
}