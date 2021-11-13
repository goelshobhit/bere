module.exports = (sequelize, Sequelize) => {
    const mail_templates = sequelize.define("mail_templates", {
        mt_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		mt_name:{
			type: Sequelize.STRING(50)
		},
        mt_subject: {
			type: Sequelize.STRING(100)
        },
        mt_body: {
			type: Sequelize.TEXT
        }
    }, {
        createdAt: 'mt_created_at',
        updatedAt: 'mt_updated_at',
        freezeTableName: true,
        tableName: 'mail_templates',
        underscored: true
    });
    return mail_templates;
}