module.exports = (sequelize, Sequelize) => {
    const user_level_task_action = sequelize.define("user_level_task_action", {
		user_level_task_action_id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        task_type: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        task_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        user_cta_action: {        //0 = decline- user clicked on decline. 1 user clicked on accept
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        user_cta_reasons: {     // 0 = default, 1 = Not interested in challenge, 2 - not interested in this product., 2= others
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue:0
        },
        task_user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    }, {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
        tableName: 'user_level_task_action',
        underscored: true
    });
    return user_level_task_action;
};