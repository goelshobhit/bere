module.exports = (sequelize, Sequelize) => {
    const mini_task = sequelize.define("mini_task", {
		mini_task_id: {
            primaryKey: true,                                                                                                                                                         
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        mini_task_object_type: {
            type: Sequelize.INTEGER,    //1=image, 2=video, 3=contest, 4=brand_name, 5==xxx  
            allowNull: false,
        },
        mini_task_qty: {
            type: Sequelize.INTEGER
        },
        mini_task_time_state: {     // 0 = timer is off, 1 - timer is on
            type: Sequelize.STRING
        },
        mini_task_reward_type: {    //1 = presents, 2=stars, 3 = coins
            type: Sequelize.INTEGER
        },
        mini_task_image_url: {
            type: Sequelize.STRING(255)
        },
        mini_task_reward_amount: {
            type: Sequelize.DECIMAL(10, 2)
        },
        mini_task_status: {
            type: Sequelize.INTEGER // 0 for inactive   1 for active
        },
        mini_task_app_placement_page: {
            type: Sequelize.STRING(255)
        },
        mini_task_increase_in_hardness: {
            type: Sequelize.INTEGER // 1, 2,3,4
        },
        mini_task_hardness: {
            type: Sequelize.INTEGER, // 0 if not hardness, 1 if have hardness
            defaultValue: 0
        },
        mini_task_hardness_action_description: {
            type: Sequelize.TEXT
        },
        mini_tasks_hardness_action: {
            type: Sequelize.JSONB 
        }
    }, {
        createdAt: 'mt_created_at',
        updatedAt: 'mt_updated_at',
        freezeTableName: true,
        tableName: 'mini_task',
        underscored: true
    });
    return mini_task;
};