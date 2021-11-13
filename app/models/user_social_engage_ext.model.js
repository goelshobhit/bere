module.exports = (sequelize, Sequelize) => {
    const user_social_engage_ext = sequelize.define("user_social_engage_ext", {
        usee_u_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
			autoIncrement: true
        },
        ucpl_content_id: {
			type: Sequelize.INTEGER
        },
        usee_u_content_type: {
			type: Sequelize.INTEGER
        },
        usee_u_content_owner_uid: {
			type: Sequelize.INTEGER
        },
		usee_u_content_post: {
		type: Sequelize.INTEGER
		},
		usee_u_content_post_hashtag: {
		type: Sequelize.INTEGER
		},
        usee_u_social_post_id: {
		type: Sequelize.TEXT
		}		
    }, {
        createdAt: 'usee_u_created_at',
        updatedAt: 'usee_u_updated_at',
        freezeTableName: true,
        tableName: 'user_social_engage_ext',
        underscored: true
    });
    return user_social_engage_ext;
}