module.exports = (sequelize, Sequelize) => {
    const watchAdsTask = sequelize.define("watch_ads_task", {
		watch_ads_task_id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        brand_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        task_name: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        task_url: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        task_timestamp: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        task_lenght_secs: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        task_status: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        task_public: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        brand_tier: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        campaign_type: {
            type:Sequelize.INTEGER,
            allowNull: false,
        },
        budget: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        budget_left: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        tokens_given: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        stars_given: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        tokens_given_value: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        stars_given_value: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        start_date:{
            type: Sequelize.DATE
        },
        end_date: {
            type: Sequelize.DATE
        },
        video_thumbnail: {
            type: Sequelize.STRING(255),
        },
        audience: {     //1: public, 2: tier 2,3: tier3, 4: bonus task winner,5: specific group
            type: Sequelize.INTEGER
        },
    }, {
        createdAt: 'wat_created_at',
        updatedAt: 'wat_updated_at',
        freezeTableName: true,
        tableName: 'watch_ads_task',
        underscored: true
    });
    return watchAdsTask;
};