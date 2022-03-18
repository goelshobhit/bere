module.exports = (sequelize, Sequelize) => {
    const shipping_confirmation = sequelize.define("shipping_confirmation", {
		sc_id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        task_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        shipping_stage: {               
            type: Sequelize.INTEGER,
            allowNull: false
        },
        shipping_stage_description: {
            type: Sequelize.STRING(255)
        },
        shipping_stage_description_id: {
            type: Sequelize.INTEGER
        },
        product_img: {
            type: Sequelize.STRING(255)
        },
        free_text_descripton: {
            type: Sequelize.STRING(255)
        }
    }, {
        createdAt: 'sc_created_at',
        updatedAt: 'sc_updated_at',
        freezeTableName: true,
        tableName: 'shipping_confirmation',
        underscored: true
    });
    return shipping_confirmation;
};