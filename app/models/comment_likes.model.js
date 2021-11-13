module.exports = (sequelize, Sequelize) => {
    const comment_likes = sequelize.define("comment_likes", {
        cl_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		cl_post_id:{
			type: Sequelize.INTEGER,
		},
        cl_commenter_uid: {
			type: Sequelize.INTEGER
        },
        cl_commenter_likes: {
			type: Sequelize.INTEGER
        }
    }, {
        createdAt: 'cl_created_at',
        updatedAt: 'cl_updated_at',
        freezeTableName: true,
        tableName: 'comment_likes',
        underscored: true
    });
    return comment_likes;
}