module.exports = (sequelize, Sequelize) => {
    const post_user_reactions = sequelize.define("post_user_reactions", {
        pu_re_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		u_id:{
			type: Sequelize.INTEGER,
		},
        ucpl_id: {
			type: Sequelize.INTEGER
        },
        pu_re_text: {
			type: Sequelize.STRING(150)
        }
    }, {
        createdAt: 'pu_re_created_at',
        updatedAt: 'pu_re_updated_at',
        freezeTableName: true,
        tableName: 'post_user_reactions',
        underscored: true
    });
    return post_user_reactions;
}