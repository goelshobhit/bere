module.exports = (sequelize, Sequelize) => {
    const notify_grp = sequelize.define("notify_grp", {
        notify_trig_grp_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		notify_grp_name:{
            type: Sequelize.TEXT,
            allowNull: false,
		},
        notify_grp_description:{
            type: Sequelize.TEXT,
            allowNull: false,
		},
        notify_grp_deliv_method: {
			type: Sequelize.INTEGER
        },
        notify_trig_grp_sentdate: {
			type: Sequelize.TEXT
        }
    }, {
        createdAt: 'ng_created_at',
        updatedAt: 'ng_updated_at',
        freezeTableName: true,
        tableName: 'notify_grp', 
        underscored: true
    });
    return notify_grp;
}
