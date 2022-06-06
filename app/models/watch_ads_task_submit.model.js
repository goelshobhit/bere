module.exports = (sequelize, Sequelize) => {
    const watchAdsSubmit = sequelize.define("watch_ads_task_submit", {
        watch_ads_task_submit_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        watch_ads_task_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
		u_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        submit_watch_timestamp: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        submit_watch_completion: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        submit_timestamp: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        submit_reward_ack: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    }, {
        createdAt: 'wats_created_at',
        updatedAt: 'wats_updated_at',
        freezeTableName: true,
        tableName: 'watch_ads_task_submit',
        underscored: true
    });
    return watchAdsSubmit;
};