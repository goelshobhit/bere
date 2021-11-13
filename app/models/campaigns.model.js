module.exports = (sequelize, Sequelize) => {
    const Campaigns = sequelize.define("campaign", {
        cp_campaign_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		cp_campaign_pid: {
            type: Sequelize.STRING(255)
        },
        cr_co_id: {
            type: Sequelize.INTEGER
        },
        cp_campaign_name: {
            type: Sequelize.STRING(50)
        },
        cp_campaign_desc: {
            type: Sequelize.TEXT
        },
        cp_campaign_tier: {
            type: Sequelize.STRING(50)
        },
        cp_campaign_time_completion: {
            type: Sequelize.INTEGER
        },
        cp_campaign_completion_rewards: {
            type:Sequelize.INTEGER
        },
        cp_campaign_aud: {
            type: Sequelize.STRING(50)
        },
        cp_campaign_visiblity: {
            type: Sequelize.STRING(50)
        },
        cp_campaign_total_budget: {
            type: Sequelize.INTEGER
        },
        cp_campaign_winner_token: {
            type: Sequelize.INTEGER
        },
        cp_campaign_start_date: {
            type: Sequelize.DATE
        },
        cp_campaign_end_date: {
            type: Sequelize.DATE
        },
		cp_campaign_token_earned: {
            type: Sequelize.INTEGER,
			defaultValue: 0
        },
		cp_campaign_after_coins_spent: {
            type: Sequelize.BOOLEAN
        },
		cp_campaign_status: {
            type: Sequelize.INTEGER,
			defaultValue: 0
        },
		cp_campaign_target_reach: {
			type: Sequelize.STRING(50)
		},
		cp_campaign_type: {
            type: Sequelize.STRING(50)
        },
		cp_campaign_banner: {
            type: Sequelize.STRING(50),
			defaultValue: 'OFF'
        }
    }, {
        createdAt: 'cp_created_at',
        updatedAt: 'cp_updated_at',
        freezeTableName: true,
        tableName: 'campaign',
        underscored: true
    });
    return Campaigns;
};