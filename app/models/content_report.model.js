module.exports = (sequelize, Sequelize) => {
  const Content_report = sequelize.define("content_report", {
    content_report_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    content_report_cat_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    content_report_name: {
      allowNull: false,
      type: Sequelize.STRING(255)
    },
    content_report_type: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    content_report_type_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    content_report_owner_id: {
      type: Sequelize.INTEGER
    },
    content_report_reporter_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    content_report_timestamp: {
      allowNull: false,
      type: Sequelize.STRING(255)
    },
    content_report_reason: {
      allowNull: false,
      type: Sequelize.STRING(255)
    }
  }, {
      createdAt: 'content_created_at',
      updatedAt: 'content_updated_at',
      freezeTableName: true,
      tableName: 'content_report',
      underscored: true
  });
  return Content_report;
}