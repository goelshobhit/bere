module.exports = (sequelize, Sequelize) => {
    const post_report = sequelize.define("post_report", {
        pr_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		ucpl_id:{
			type: Sequelize.INTEGER
		},
        u_id: {
			type: Sequelize.INTEGER
        },
        pr_report: {
			type: Sequelize.JSONB
        },
		pr_report_type: {
			type: Sequelize.STRING
        }
    }, {
        createdAt: 'pr_created_at',
        updatedAt: 'pr_updated_at',
        freezeTableName: true,
        tableName: 'post_report',
        underscored: true
    });
    return post_report;
}