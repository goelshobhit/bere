module.exports = (sequelize, Sequelize) => {
    const admin_setting  = sequelize.define("admin_setting", {
        ad_id: {
            type: Sequelize.INTEGER,			
            primaryKey: true
        },
        ad_conversion_rate: {
            type: Sequelize.DataTypes.INTEGER //This is current conversion rate of 100 coins(100=1$)
        },
        ad_min_withdraw_limit: {
            type: Sequelize.DataTypes.INTEGER //This is minimum limit which can be withdraw by user
        },
        ad_max_withdraw_limit: {
            type: Sequelize.DataTypes.INTEGER //This is maximum limit from where approval need from admin
        }
    }, {
        freezeTableName: true,
        tableName: 'admin_setting',
        underscored: true
    }); 
    return admin_setting;
};
  