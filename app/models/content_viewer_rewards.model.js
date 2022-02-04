module.exports = (sequelize, Sequelize) => {
    const content_viewer_rewards = sequelize.define("content_viewer_rewards", {
        cvr_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
			type: Sequelize.INTEGER
        },
        video_task_id: {
			type: Sequelize.STRING(255)
        },
        money_pouch_amount: {
            type: Sequelize.INTEGER
        },
        money_pouch_countdown: {
            type: Sequelize.INTEGER
        },
		total_video_watched: {
            type: Sequelize.INTEGER
        }
    }, {
        createdAt: 'cvr_created_at',
        updatedAt: 'cvr_updated_at',
        freezeTableName: true,
        tableName: 'content_viewer_rewards',
        underscored: true
    });
    return content_viewer_rewards;
}