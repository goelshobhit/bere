module.exports = (sequelize, Sequelize) => {
    const tasks_json = sequelize.define("tasks_json", {
        tj_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tj_type: {
            type: Sequelize.STRING(50),
			allowNull: false,
        },
        tj_task_id: {
            type: Sequelize.STRING(50),
			allowNull: false,
        },
		tj_data: {
            type: Sequelize.JSONB,
            defaultValue: []
        },
        tj_status:{
            type: Sequelize.INTEGER,
			defaultValue: 0
        },
        is_autotakedown:{
            type: Sequelize.INTEGER,
			default: 0
        }
    }, {
        createdAt: 'tj_created_at',
        updatedAt: 'tj_updated_at',
        freezeTableName: true,
        tableName: 'tasks_json',
        underscored: true
    });
    return tasks_json;
}