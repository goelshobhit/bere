module.exports = (sequelize, Sequelize) => {
  const survey = sequelize.define("survey", {
    sr_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    sr_brand_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    sr_title: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    sr_description: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    sr_hashtags: {
      type: Sequelize.JSONB,
      allowNull: false,
    },
    sr_color: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    sr_startdate_time: {
      allowNull: false,
      type: Sequelize.DATE
    },
    sr_enddate_time: {
      allowNull: false,
      type: Sequelize.DATE
    },
    sr_created_date_time: {
      allowNull: false,
      type: Sequelize.DATE
    },
    sr_updated_date_time: {
      allowNull: false,
      type: Sequelize.DATE
    },
    sr_status: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    sr_usr_restriction: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    sr_stars_per_user: {
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'sr_created_date_time',
      updatedAt: 'sr_updated_date_time',
      freezeTableName: true,
      tableName: 'survey',
      underscored: true
  });
  return survey;
}