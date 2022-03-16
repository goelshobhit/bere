module.exports = (sequelize, Sequelize) => {
    const reward_center = sequelize.define("reward_center", {
        reward_center_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		reward_center_name:{
            type: Sequelize.TEXT,
		},
        reward_center_owner_id: {
			type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_location_id: {
			type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_reward_type: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_reward_trigger_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    }, {
        createdAt: 'reward_center_created_at',
        updatedAt: 'reward_center_updated_at',
        freezeTableName: true,
        tableName: 'reward_center',
        underscored: true
    });
    return reward_center;
}