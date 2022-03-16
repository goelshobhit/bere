module.exports = (sequelize, Sequelize) => {
    const task_caption = sequelize.define("task_caption", {
		task_caption_id: {
            primaryKey: true,                                                                                                                                                         
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        task_caption_hashtags: {
            type: Sequelize.JSONB,
            allowNull: false,
        },
        task_caption_user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        task_spots_available: {
            type: Sequelize.INTEGER
        },
        shared_social_media_id: {
            type: Sequelize.JSONB
        },
        task_caption_timestamp: {
            type: Sequelize.DATE
        },
        Task_caption_rules: {
            type: Sequelize.TEXT
        }
    }, {
        createdAt: 'tc_created_at',
        updatedAt: 'tc_updated_at',
        freezeTableName: true,
        tableName: 'task_caption',
        underscored: true
    });
    return task_caption;
};