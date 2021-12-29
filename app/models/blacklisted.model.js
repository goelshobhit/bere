module.exports = (sequelize, Sequelize) => {
    const blacklisted = sequelize.define("blacklisted", {
        blacklisted_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		keyword:{
			type: Sequelize.TEXT,
            allowNull: false,
		},
		table_name:{
			type: Sequelize.TEXT,
			allowNull: false,
		}
    }, {
        createdAt: 'bl_created_at',
        updatedAt: 'bl_updated_at',
        freezeTableName: true,
        tableName: 'blacklisted',
        underscored: true
    });
    return blacklisted;
}