module.exports = (sequelize, Sequelize) => {
    const page_location = sequelize.define("page_location", {
		page_id: {
            primaryKey: true,                                                                                                                                                         
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        page_name: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        page_description: {
            type: Sequelize.TEXT
        },
        page_image_path: {
            type: Sequelize.STRING
        }
    }, {
        createdAt: 'pl_created_at',
        updatedAt: 'pl_updated_at',
        freezeTableName: true,
        tableName: 'page_location',
        underscored: true
    });
    return page_location;
};