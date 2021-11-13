module.exports = (sequelize, Sequelize) => {
    const user_fan_following = sequelize.define("user_fan_following", {
        u_faf_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
			autoIncrement: true
        },
        faf_to: {
			type: Sequelize.INTEGER
        },
        faf_by: {
			type: Sequelize.INTEGER
        }			
    }, {
        createdAt: 'faf_created_at',
        updatedAt: 'faf_updated_at',
        freezeTableName: true,
        tableName: 'user_fan_following',
        underscored: true
    });
    return user_fan_following;
}