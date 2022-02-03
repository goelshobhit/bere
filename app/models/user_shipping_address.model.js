module.exports = (sequelize, Sequelize) => {
    const user_shipping_address = sequelize.define("user_shipping_address", {
		usr_shipping_address_id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        usr_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        usr_shipping_address: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        usr_default_shipping_address: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        createdAt: 'sa_created_at',
        updatedAt: 'sa_updated_at',
        freezeTableName: true,
        tableName: 'user_shipping_address',
        underscored: true
    });
    return user_shipping_address;
};