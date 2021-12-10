module.exports = (sequelize, Sequelize) => {
  const survey = sequelize.define("survey_user_complete", {
    su_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    sr_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    sr_uid: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    sr_completed: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    sr_completion_date: {
      type: Sequelize.DATE
    },
    sr_usr_restriction: {
      allowNull: false,
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'su_created_at',
      updatedAt: 'su_updated_at',
      freezeTableName: true,
      tableName: 'survey_user_complete',
      underscored: true
  });
  return survey;
}