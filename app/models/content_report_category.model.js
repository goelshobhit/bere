module.exports = (sequelize, Sequelize) => {
  const content_report_category = sequelize.define("content_report_category", {
    content_report_cat_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    content_report_cat_autotakedown: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    content_report_cat_name: {
      allowNull: false,
      type: Sequelize.STRING(255)
    },
    content_report_cat_hide: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    content_report_cat_usr_hide: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    content_report_cat_us: {
      allowNull: false,
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'crc_created_at',
      updatedAt: 'crc_updated_at',
      freezeTableName: true,
      tableName: 'content_report_category',
      underscored: true
  });
  return content_report_category;
}