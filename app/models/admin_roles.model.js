module.exports = (sequelize, Sequelize) => {
    const Admin_roles = sequelize.define("admin_roles", {
        ar_role_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ar_name: {
            type: Sequelize.STRING(50),
			allowNull: false,
        },
		ar_action: {
            type: Sequelize.JSONB
        },
        ar_status:{
            type: Sequelize.INTEGER,
			defaultValue: 0
        }
    }, {
        createdAt: 'ar_created_at',
        updatedAt: 'ar_updated_at',
        freezeTableName: true,
        tableName: 'admin_roles',
        underscored: true
    });
    return Admin_roles;
}