module.exports = (sequelize, Sequelize) => {
    const AdditionalInfoData = sequelize.define("addition_info_data", {
        ad_info_data_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ad_info_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true
        },
        ad_info_data_name: {
            type: Sequelize.STRING(50)
        },
        ad_info_data_description: {
            type: Sequelize.STRING(50)
        },
        ad_info_data_image: {
            type: Sequelize.TEXT
        },
    }, {
        createdAt: 'ad_info_data_created_at',
        updatedAt: 'ad_info_data_updated_at',
        freezeTableName: true,
        tableName: 'addition_info_data',
        underscored: true
    });
    return AdditionalInfoData;
};
  