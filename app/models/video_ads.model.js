module.exports = (sequelize, Sequelize) => {
    const VideoAds = sequelize.define("video_ads", {
		video_ads_id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        cr_co_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        video_ads_name: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        video_ads_url: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        video_ads_timestamp: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        video_ads_lenght_secs: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        video_ads_status: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        video_ads_public: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        video_ads_brand_tier: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        video_ads_campaign_type: {
            type:Sequelize.INTEGER,
            allowNull: false,
        },
        video_ads_budget: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        video_budget_left: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        video_tokens_given: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        video_stars_given: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        video_tokens_given_value: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        video_stars_given_value: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    }, {
        createdAt: 'va_created_at',
        updatedAt: 'va_updated_at',
        freezeTableName: true,
        tableName: 'video_ads',
        underscored: true
    });
    return VideoAds;
};