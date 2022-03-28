module.exports = (sequelize, Sequelize) => {
    const content_feedback_settings = sequelize.define("content_feedback_settings", {
		cfs_id: {
            primaryKey: true,                                                                                                                                                         
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        popup_shown_user_percentage: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
        },
        popup_shown_days: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    }, {
        createdAt: 'cfs_created_at',
        updatedAt: 'cfs_updated_at',
        freezeTableName: true,
        tableName: 'content_feedback_settings',
        underscored: true
    });
    return content_feedback_settings;
};