module.exports = (sequelize, Sequelize) => {
   const reward_center_dist = sequelize.define("reward_center_dist", {
        reward_center_dist_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		reward_center_id:{
            type: Sequelize.INTEGER,
            allowNull: false,
		},
        reward_center_dist_status: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_name: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        reward_center_dist_one_freq: {
			type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_total_token: {
            type: Sequelize.INTEGER,
        },
        reward_center_dist_one_segment_id: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        reward_center_dist_one_name: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        reward_center_dist_one_stars: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_stars_name: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_stars_to_token: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_coins: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_coins_name: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_coins_to_token: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_keys: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_keys_name: {
            type: Sequelize.TEXT
        },
        reward_center_dist_one_keys_to_token: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_booster: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_booster_name: {
            type: Sequelize.TEXT
        },
        reward_center_dist_one_boster_to_token: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_card1_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_card2_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_card3_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_card4_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_card5_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_card6_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_card7_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_dist_one_card1_name: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_card2_name: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_card3_name: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_card4_name: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_card5_name: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_card6_name: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_card7_name: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_card1_value: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_card2_value: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_card3_value: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_card4_value: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_card5_value: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_card6_value: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_one_card7_value: {
            type: Sequelize.TEXT,
        },
        reward_center_dist_puzzle1_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        reward_center_distr_one_puzzle1_name: {
            type: Sequelize.TEXT,
        },
        reward_center_distr_one_puzzle1_value: {
            type: Sequelize.TEXT,
        },
        reward_center_spin_reward_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    }, {
        createdAt: 'reward_center_dist_created_at',
        updatedAt: 'reward_center_dist_updated_at',
        freezeTableName: true,
        tableName: 'reward_center_dist',
        underscored: true
    });
    return reward_center_dist;
}