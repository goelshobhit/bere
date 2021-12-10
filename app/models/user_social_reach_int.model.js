module.exports = (sequelize, Sequelize) => {
    const user_social_reach_int = sequelize.define("user_social_reach_int", {
        usri_u_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
			autoIncrement: true
        },
        usri_u_followers: {
			type: Sequelize.INTEGER
        },
        usri_u_following: {
			type: Sequelize.INTEGER
        },
        usri_u_reach_type: {
			type: Sequelize.INTEGER
        }			
    }, {
        createdAt: 'usri_u_created_at',
        updatedAt: 'usri_u_updated_at',
        freezeTableName: true,
        tableName: 'user_social_reach_int',
        underscored: true
    });
    return user_social_reach_int;
}