module.exports = (sequelize, Sequelize) => {
    const AdditionalInfoHeading = sequelize.define("addition_info_heading", {
        ad_info_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ad_info_name: {
            type: Sequelize.STRING(50)
        },
        ad_info_type_name: {
            type: Sequelize.STRING(50)
        }
    }, {
        createdAt: 'ad_info_created_at',
        updatedAt: 'ad_info_updated_at',
        freezeTableName: true,
        tableName: 'addition_info_heading',
        underscored: true
    });
    return AdditionalInfoHeading;
};
  