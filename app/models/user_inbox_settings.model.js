module.exports = (sequelize, Sequelize) => {
    const user_inbox_settings = sequelize.define("user_inbox_settings", {
        user_inbox_settings_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		u_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
		},
        settings_data:{
            type: Sequelize.JSONB,
            allowNull: true,
		}
    }, {
        createdAt: 'uis_created_at',
        updatedAt: 'uis_updated_at',
        freezeTableName: true,
        tableName: 'user_inbox_settings', 
        underscored: true
    });
    return user_inbox_settings;
}
