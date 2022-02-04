module.exports = (sequelize, Sequelize) => {
    const user_content_post = sequelize.define("user_content_post", {
        ucpl_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ta_task_id: {
			type: Sequelize.INTEGER
        },
        ucpl_u_id: {
			type: Sequelize.INTEGER
        },
        ucpl_content_type: {
            type: Sequelize.JSONB
        },
        ucpl_content_id: {
            type: Sequelize.STRING(50)
        },
		ucpl_content_data: {
            type: Sequelize.JSONB
        },
		ucpl_content_likes_count: {
            type: Sequelize.INTEGER,
			default:0
        },
		ucpl_content_hearts: {
            type: Sequelize.INTEGER,
			default:0
        },
		ucpl_content_stars: {
            type: Sequelize.INTEGER,
			default:0
        },
		ucpl_content_comments: {
            type: Sequelize.TEXT
        },
		ucpl_content_hashtags: {
            type: Sequelize.STRING(150)
        },
		ucpl_commentor_uid: {
            type: Sequelize.INTEGER,
			default:0
        },
		ucpl_instagram_select: {
            type: Sequelize.INTEGER,
			default:0
        },
		ucpl_status: {
            type: Sequelize.INTEGER,
			default:0
        },
        ucpl_user_fav: {
            type: Sequelize.JSONB,
			default:[]
        },
        ucpl_not_interested: {
            type: Sequelize.JSONB,
			default:[]
        },
        ucpl_reaction_counter: {
            type: Sequelize.INTEGER,
			default:0
        },
        upcl_brand_details: {
            type: Sequelize.JSONB,
			default:[]
        },
		ucpl_added_by:{
			type: Sequelize.INTEGER,
			default:0  // 0 added by Admin and 1 for customer
		},
		is_autotakedown:{
            type: Sequelize.INTEGER,
			default: 0
        },
        custom_hashtags: {
            type: Sequelize.STRING(255)
        },
        caption: {
            type: Sequelize.TEXT
        },
        video_response: {
            type: Sequelize.STRING(255)
        }
    }, {
        createdAt: 'ucpl_created_at',
        updatedAt: 'ucpl_updated_at',
        freezeTableName: true,
        tableName: 'user_content_post',
        underscored: true
    });
    return user_content_post;
}