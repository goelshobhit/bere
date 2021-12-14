module.exports = (sequelize, Sequelize) => {
  const content_report_moderate = sequelize.define("content_report_moderate", {
    crm_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    content_report_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    content_report_autotakedown: {
      type: Sequelize.INTEGER
    },
    content_report_hide_from_user: {
      type: Sequelize.INTEGER
    },
    crm_desc: {
      type: Sequelize.TEXT
    }
  }, {
      createdAt: 'crm_created_at',
      updatedAt: 'crm_updated_at',
      freezeTableName: true,
      tableName: 'content_report_moderate',
      underscored: true
  });
  return content_report_moderate;
}