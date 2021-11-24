module.exports = (sequelize, Sequelize) => {
  const survey = sequelize.define("survey_submissions", {
    srs_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    srs_sr_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    srs_uid: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    srs_srq_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    srs_srq_answer: {
      allowNull: false,
      type: Sequelize.TEXT
    },
    srs_rewards_star: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    srs_rewards_collection_date: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {
      createdAt: 'srs_created_date',
      updatedAt: 'srs_updated_date',
      freezeTableName: true,
      tableName: 'survey_submissions',
      underscored: true
  });
  return survey;
}