module.exports = (sequelize, Sequelize) => {
    const user_preference = sequelize.define("user_preference", {
        up_u_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
			autoIncrement: true
        },
        up_u_cat_id: {
			type: Sequelize.STRING(100)
        },
        up_u_receive_offers: {
			type: Sequelize.BOOLEAN
        }		
    }, {
        createdAt: 'up_created_at',
        updatedAt: 'up_updated_at',
        freezeTableName: true,
        tableName: 'user_preference',
        underscored: true
    });
    return user_preference;
}