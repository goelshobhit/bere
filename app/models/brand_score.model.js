module.exports = (sequelize, Sequelize) => {
  const brand_score = sequelize.define("brand_score", {
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
    brandscore_task_reach_score: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    brandscore_task_comments_score: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    brandscore_task_pics_count_score: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    brandscore_task_video_count_score: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    brandscore_task_likes_count_score: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    brandscore_task_hashtag_name_score: {
      allowNull: false,
      type: Sequelize.STRING(255)
    },
    brandscore_task_tot_tickets_count_score: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    brandscore_task_name: {
      allowNull: false,
      type: Sequelize.STRING(255)
    },
    brandscore_task_award_lock_count_score: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    brandscore_task_award_limit_count: {
      type: Sequelize.INTEGER
    },
    brandscore_score_total_count: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    riddim_reach: {
      type: Sequelize.INTEGER
    },
    riddim_engagment: {
      type: Sequelize.INTEGER
    },
    share_off_riddim: {
      type: Sequelize.INTEGER
    },
    post_deletion: {
      type: Sequelize.INTEGER
    },
    brand_vote: {
      type: Sequelize.INTEGER
    },
    video_uploaded: {
      type: Sequelize.STRING(255)
    },
    score_decrease_del_post: {
      type: Sequelize.INTEGER
    },
    brand_score_created_at: {
      allowNull: false,
      type: Sequelize.DATE
    },
    brand_score_updated_at: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, {
      createdAt: 'brand_score_created_at',
      updatedAt: 'brand_score_updated_at',
      freezeTableName: true,
      tableName: 'brand_score',
      underscored: true
  });
  return brand_score;
}