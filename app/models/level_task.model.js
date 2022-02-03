module.exports = (sequelize, Sequelize) => {
    const level_task = sequelize.define("level_task", {
		level_task_id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        brand_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        task_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        task_level: {               //1 Default 2-l2, 3=L2 
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue:1
        },
        task_price: {               
            type: Sequelize.INTEGER
        },
        task_banner_img: {
            type: Sequelize.STRING(255)
        },
        task_details: {
            type: Sequelize.STRING(255)
        }
    }, {
        createdAt: 'la_created_at',
        updatedAt: 'la_updated_at',
        freezeTableName: true,
        tableName: 'level_task',
        underscored: true
    });
    return level_task;
};