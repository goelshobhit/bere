module.exports = (sequelize, Sequelize) => {
  const brandscore_task = sequelize.define("brandscore_task", {
    brandscore_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    brandscore_brand_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    brandscore_task_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    brandscore_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    brandscore_task_reach_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    brandscore_task_comments_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    brandscore_task_pics_count: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    brandscore_task_video_count: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    brandscore_task_likes_count: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    brandscore_task_hashtag_name: {
      type: Sequelize.STRING(255)
    },
    brandscore_task_tot_tickets_count: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    brandscore_task_name: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    brandscore_task_award_unlock: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    brandscore_task_award_lock: {
      allowNull: false,
      defaultValue : 0,
      type: Sequelize.INTEGER
    },
    brandscore_task_award_limit_count: {
      type: Sequelize.INTEGER
    },
    brandscore_score_count: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    brandscore_task_created_at: {
      allowNull: false,
      type: Sequelize.DATE
    },
    brandscore_task_updated_at: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {
      createdAt: 'brandscore_task_created_at',
      updatedAt: 'brandscore_task_updated_at',
      freezeTableName: true,
      tableName: 'brandscore_task',
      underscored: true
  });
  return brandscore_task;
}