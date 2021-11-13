module.exports = (sequelize, Sequelize) => {
    const budget_history = sequelize.define("budget_history", {
        bud_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
			autoIncrement: true
        },
        u_id: {
			type: Sequelize.INTEGER
        },
        ta_task_id: {
			type: Sequelize.INTEGER
        },
		bud_budget: {
			type: Sequelize.INTEGER
        },
		bud_heart: {
			type: Sequelize.INTEGER
        },
		bud_available: {
			type: Sequelize.INTEGER
        }		
    }, {
        createdAt: 'bud_created_at',
        updatedAt: 'bud_updated_at',
        freezeTableName: true,
        tableName: 'budget_history',
        underscored: true
    });
    return budget_history;
}