module.exports = (sequelize, Sequelize) => {
    const voting = sequelize.define("voting", {
		voting_id: {
            primaryKey: true,                                                                                                                                                         
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        voter_usr_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        voting_brand_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        voting_hashtag: {
            type: Sequelize.STRING
        },
        voting_indicator: {
            type: Sequelize.INTEGER
        },
        voter_nominator_img: {
            type: Sequelize.JSONB
        },
        voter_nominator_usr_id: {
            type: Sequelize.JSONB
        },
        voted: {
            type: Sequelize.INTEGER
        },
        voted_usr_top: {
            type: Sequelize.INTEGER
        },
        voter_stars: {
            type: Sequelize.INTEGER
        },
        usr_top1: {
            type: Sequelize.INTEGER
        },
        usr_top2: {
            type: Sequelize.INTEGER
        },
        usr_top3: {
            type: Sequelize.INTEGER
        },
        vote_main_instruction: {
            type: Sequelize.STRING
        },
        vote_sub_instruction: {
            type: Sequelize.STRING
        },
        Vote_rewards1_id: {
            type: Sequelize.INTEGER
        },
        Vote_rewards1_amount: {
            type: Sequelize.INTEGER
        },
        Vote_rewards2_id: {
            type: Sequelize.INTEGER
        },
        Vote_rewards2_amount: {
            type: Sequelize.INTEGER
        }
    }, {
        createdAt: 'vt_created_at',
        updatedAt: 'vt_updated_at',
        freezeTableName: true,
        tableName: 'voting',
        underscored: true
    });
    return voting;
};