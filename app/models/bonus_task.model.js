module.exports = (sequelize, Sequelize) => {
  const bonus_task = sequelize.define("bonus_task", {
    bonus_task_brand_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    bonus_task_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_task_usr_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_task_caption1: {
      type: Sequelize.STRING(255)
    },
    bonus_task_caption2: {
      type: Sequelize.STRING(255)
    },
    bonus_task_caption3: {
      type: Sequelize.STRING(255)
    },
    bonus_task_own_caption: {
      type: Sequelize.STRING(255)
    },
    bonus_task_title: {
      type: Sequelize.STRING(255)
    },
    bonus_task_summary_content: {
      type: Sequelize.STRING(255)
    },
    bonus_task_image_url: {
      type: Sequelize.STRING(255)
    },
    bonus_task_video_url: {
      type: Sequelize.STRING(255)
    },
    bonus_task_completion_date: {
      type: Sequelize.STRING(255)
    },
    bonus_task_entry_date: {
      type: Sequelize.STRING(255)
    },
    bonus_task_hashtag: {
      type: Sequelize.STRING(255)
    }
  }, {
      createdAt: 'bonus_task_created_at',
      updatedAt: 'bonus_task_updated_at',
      freezeTableName: true,
      tableName: 'bonus_task',
      underscored: true
  });
  return bonus_task;
}