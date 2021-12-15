module.exports = (sequelize, Sequelize) => {
   const reward_count = sequelize.define("reward_count", {
        reward_count_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		reward_count_dist_id:{
            type: Sequelize.INTEGER,
            allowNull: false,
		},
        reward_count_dist_name: {
            type: Sequelize.TEXT,
        },
        reward_count_timestamp: {
			type: Sequelize.DATE,
        },
        reward_count_usr_id: {
			type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_count_no_of_rewards: {
            type: Sequelize.INTEGER,
        },
        reward_count_summary_url: {
            type: Sequelize.TEXT,
        }
    }, {
        createdAt: 'reward_count_created_at',
        updatedAt: 'reward_count_updated_at',
        freezeTableName: true,
        tableName: 'reward_count',
        underscored: true
    });
    return reward_count;
}