module.exports = (sequelize, Sequelize) => {
    const user_feedback= sequelize.define("user_feedback", {
        uf_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uf_subject: {
            type: Sequelize.STRING(50),
			allowNull: false,
        },
        uf_u_id: {
            type: Sequelize.INTEGER,
			allowNull: false,
        },
		uf_message: {
            type: Sequelize.TEXT
        },
        is_admin:{
            type: Sequelize.BOOLEAN,
			defaultValue: false
        },
		uf_id_reply:{
			type: Sequelize.INTEGER
		},
		uf_media:{
			type: Sequelize.TEXT
		}
    }, {
        createdAt: 'uf_created_at',
        updatedAt: 'uf_updated_at',
        freezeTableName: true,
        tableName: 'user_feedback',
        underscored: true
    });
    return user_feedback;
}