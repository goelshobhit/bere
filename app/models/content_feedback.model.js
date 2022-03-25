module.exports = (sequelize, Sequelize) => {
  const content_feedback = sequelize.define("content_feedback", {
    content_feedback_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    content_feedback_category_id: {   // category id based on post
      type: Sequelize.INTEGER
    },
    content_feedback_question_type: {   // 1 = single, 2= multiple, 3 = rating
      allowNull: false,
      type: Sequelize.INTEGER
    },
    content_feedback_question: {
      allowNull: false,
      type: Sequelize.STRING
    },
    content_feedback_answers: {
      type: Sequelize.JSONB
    }
  }, {
      createdAt: 'cf_created_at',
      updatedAt: 'cf_updated_at',
      freezeTableName: true,
      tableName: 'content_feedback',
      underscored: true
  });
  return content_feedback;
}