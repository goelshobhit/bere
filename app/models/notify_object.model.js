module.exports = (sequelize, Sequelize) => {
    const notify_object = sequelize.define("notify_object", {
        notify_object_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		notify_object_name:{
            type: Sequelize.TEXT,
            allowNull: false,
		},
        notify_object_description:{
            type: Sequelize.TEXT,
            allowNull: true,
		},
        notify_object_task_id: {
			type: Sequelize.INTEGER,
            allowNull: true,
        },
    }, {
        createdAt: 'no_created_at',
        updatedAt: 'no_updated_at',
        freezeTableName: true,
        tableName: 'notify_object', 
        underscored: true
    });
    return notify_object;
}
