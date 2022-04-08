module.exports = (sequelize, Sequelize) => {
    const Contest_task = sequelize.define("contest_task", {
        ct_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ct_name: {
            type: Sequelize.STRING(50)
        },
        cp_campaign_id: {
            type: Sequelize.INTEGER
        },
        ct_type: {
            type: Sequelize.STRING(10)
        },
        reward_type: {                      //1: tokens- fixed per entry,2: available presents (token value here),3: available chests (token value here ),4: Contest (tokens to winner only)
            type: Sequelize.INTEGER
        },
        reward_center_id: {
            type: Sequelize.INTEGER
        },
        audience: {                         //1: public, 2: tier 2,3: tier3, 4: bonus task winner,5: specific group
            type: Sequelize.INTEGER
        },
        bonus_reward_type: {                //1: add prizes,2: bonus sets,3: single price,4: no bonus
            type: Sequelize.INTEGER
        },
        bonus_set_id: {
            type: Sequelize.INTEGER
        },
        tickets_per_task_submissions: {
            type: Sequelize.INTEGER
        },
        ct_media: {
            type: Sequelize.JSONB
        },
        ct_post_insp_image: {
            type: Sequelize.JSONB
        },
		ct_hashtag: {
            type: Sequelize.JSONB
        },
        ct_token_budget:{
            type: Sequelize.INTEGER
        },
        ct_budget_per_user:{
            type: Sequelize.INTEGER
        },
        ct_stars_per_user:{
            type: Sequelize.INTEGER
        },
        ct_energy_per_user:{
            type: Sequelize.INTEGER
        },
        ct_total_available:{
            type:Sequelize.INTEGER
        },
        ct_estimated_user:{
            type: Sequelize.INTEGER
        },
        ct_header_image: {
            type: Sequelize.STRING(50)
        },
        ct_do: {
            type: Sequelize.JSONB
        },
        ct_dont_do: {
            type: Sequelize.JSONB
        },
        ct_insta_question:{
            type: Sequelize.JSONB
        },
        ct_photos_required:{
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        ct_videos_required:{
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        ct_sound: {
            type: Sequelize.STRING
        },
        ct_mentioned:{
            type: Sequelize.JSONB
        },
        ct_start_date:{
            type: Sequelize.DATE
        },
        ct_end_date: {
            type: Sequelize.DATE
        },
		ct_status: {
            type: Sequelize.INTEGER
        },
		ct_desc: {
            type: Sequelize.TEXT
        },
		ct_oneline_summary: {
            type: Sequelize.STRING(50)
        },
		ct_contiue_spend_budget: {
            type: Sequelize.BOOLEAN
        },
		ct_bonus_rewards_benefits: {
            type: Sequelize.JSONB
        },
        ct_start_voting_date:{
            type: Sequelize.DATE
        },
        ct_end_voting_date:{
            type: Sequelize.DATE
        },
        ct_winner_date:{
            type: Sequelize.DATE
        },
		ct_winner_token:{
            type: Sequelize.STRING(50)
        },
		is_autotakedown:{
            type: Sequelize.INTEGER,
			default: 0
        }
    }, {
        createdAt: 'ct_created_at',
        updatedAt: 'ct_updated_at',
        freezeTableName: true,
        tableName: 'contest_task',
        underscored: true
    });
    return Contest_task;
}