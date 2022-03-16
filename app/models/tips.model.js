module.exports = (sequelize, Sequelize) => {
    const tips = sequelize.define("tips", {
		id: {
            primaryKey: true,                                                                                                                                                         
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        heading: {
            type: Sequelize.TEXT
        },
        sub_heading: {
            type: Sequelize.TEXT
        },
        description: {
            type: Sequelize.TEXT
        },
        image: {
            type: Sequelize.STRING
        }
    }, {
        createdAt: 'tips_created_at',
        updatedAt: 'tips_updated_at',
        freezeTableName: true,
        tableName: 'tips',
        underscored: true
    });
    return tips;
};