module.exports = (sequelize, Sequelize) => {
    const videoAdsSubmit = sequelize.define("video_ads_submit", {
        video_ads_submit_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		u_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        video_ads_submit_watch_timestamp: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        video_ads_submit_watch_completion: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        video_ads_submit_timestamp: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        video_ads_submit_reward_ack: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    }, {
        createdAt: 'vas_created_at',
        updatedAt: 'vas_updated_at',
        freezeTableName: true,
        tableName: 'video_ads_submit',
        underscored: true
    });
    return videoAdsSubmit;
};