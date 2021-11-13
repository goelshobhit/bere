module.exports = (sequelize, Sequelize) => {
    const post_comment = sequelize.define("post_comment", {
        pc_post_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		ucpl_id:{
			type: Sequelize.INTEGER,
		},
        pc_commenter_uid: {
			type: Sequelize.INTEGER
        },
        pc_comments: {
			type: Sequelize.TEXT
        },
        pc_comment_prof_img_url: {
            type: Sequelize.JSONB
        },
		pc_comment_unlikes: {
			type: Sequelize.INTEGER,
			default:0
        },
		pc_comment_likes: {
			type: Sequelize.INTEGER,
			default:0
        },
        pc_comment_id: {
			type: Sequelize.INTEGER
        },
        pc_comment_mid: {
			type: Sequelize.INTEGER
        }
    }, {
        createdAt: 'pc_created_at',
        updatedAt: 'pc_updated_at',
        freezeTableName: true,
        tableName: 'post_comment',
        underscored: true
    });
    return post_comment;
}