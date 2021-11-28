module.exports = (sequelize, Sequelize) => {
  const content_report_category = sequelize.define("content_report_user", {
    content_report_user_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    content_report_uid: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    content_report_cat_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    content_report_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    content_report_type: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    content_report_type_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    cru_status: {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 1
    }
  }, {
      createdAt: 'cru_created_at',
      updatedAt: 'cru_updated_at',
      freezeTableName: true,
      tableName: 'content_report_user',
      underscored: true
  });
  return content_report_category;
}