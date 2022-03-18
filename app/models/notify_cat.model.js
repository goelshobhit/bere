module.exports = (sequelize, Sequelize) => {
    const notify_cat = sequelize.define("notify_cat", {
        notify_trig_cat_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		notify_cat_name:{
            type: Sequelize.TEXT,
            allowNull: false,
		},
        notify_cat_description:{
            type: Sequelize.TEXT,
            allowNull: true,
		},
        notify_cat_deliv_method: {
			type: Sequelize.INTEGER
        },
    }, {
        createdAt: 'nc_created_at',
        updatedAt: 'nc_updated_at',
        freezeTableName: true,
        tableName: 'notify_cat', 
        underscored: true
    });
    return notify_cat;
}
