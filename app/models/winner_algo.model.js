module.exports = (sequelize, Sequelize) => {
    const winner_algo = sequelize.define("winner_algo", {
		winner_algo_id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        bonus_task_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        bonus_task_complete_time: {
            type: Sequelize.DATE
        },
        winner_user_id: {            
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        createdAt: 'wa_created_at',
        updatedAt: 'wa_updated_at',
        freezeTableName: true,
        tableName: 'winner_algo',
        underscored: true
    });
    return winner_algo;
};