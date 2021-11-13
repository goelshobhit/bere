module.exports = (sequelize, Sequelize) => {
    const HashTags = sequelize.define("hashtag", {
        th_hashtag_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ta_task_id: {
            type: Sequelize.INTEGER
        },
		cp_campaign_id: {
            type: Sequelize.INTEGER
        },
        th_hashtag_values: {
            type: Sequelize.STRING(20)
        },
		th_type:{
			type: Sequelize.STRING(50)
		}
    }, {
        createdAt: 'th_created_at',
        updatedAt: 'th_updated_at',
        freezeTableName: true,
        tableName: 'task_hashtag',
        underscored: true
    });
    return HashTags;
}