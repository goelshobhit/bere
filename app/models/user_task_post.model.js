module.exports = (sequelize, Sequelize) => {
    const user_task_posts = sequelize.define("user_task_posts", {
        ut_post_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ta_task_id: {
			type: Sequelize.INTEGER
        },
        u_id: {
			type: Sequelize.INTEGER
        },
        ut_post_media: {
            type: Sequelize.JSONB
        },
        ut_post_hashtags: {
            type: Sequelize.TEXT
        },
		ut_post_insta_answers: {
            type: Sequelize.JSONB
        },
        ut_post_insta_friends: {
            type: Sequelize.STRING(150)
        },
		ut_post_status: {
            type: Sequelize.INTEGER,
			default:0
        },
		ucpl_user_fav: {
            type: Sequelize.JSONB,
			default:[]
        },
        upcl_brand_details: {
            type: Sequelize.JSONB,
			default:[]
        }
    }, {
        createdAt: 'ut_created_at',
        updatedAt: 'ut_updated_at',
        freezeTableName: true,
        tableName: 'user_task_posts',
        underscored: true
    });
    return user_task_posts;
}