module.exports = (sequelize, Sequelize) => {
    const Tasks = sequelize.define("task", {
        ta_task_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ta_name: {
            type: Sequelize.STRING(50)
        },
        cp_campaign_id: {
            type: Sequelize.INTEGER
        },
        ta_type: {
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
        ta_media: {
            type: Sequelize.JSONB
        },
        ta_post_insp_image: {
            type: Sequelize.JSONB
        },
		ta_hashtag: {
            type: Sequelize.JSONB
        },
        ta_token_budget:{
            type: Sequelize.INTEGER
        },
        ta_budget_per_user:{
            type: Sequelize.INTEGER
        },
        ta_stars_per_user:{
            type: Sequelize.INTEGER
        },
        ta_total_available:{
            type:Sequelize.INTEGER
        },
        ta_estimated_user:{
            type: Sequelize.INTEGER
        },
        ta_header_image: {
            type: Sequelize.STRING(50)
        },
        ta_do: {
            type: Sequelize.JSONB
        },
        ta_dont_do: {
            type: Sequelize.JSONB
        },
        ta_insta_question:{
            type: Sequelize.JSONB
        },
        ta_photos_required:{
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        ta_videos_required:{
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        ta_sound: {
            type: Sequelize.STRING
        },
        ta_mentioned:{
            type: Sequelize.JSONB
        },
        ta_start_date:{
            type: Sequelize.DATE
        },
        ta_end_date: {
            type: Sequelize.DATE
        },
		ta_status: {
            type: Sequelize.INTEGER
        },
		ta_desc: {
            type: Sequelize.TEXT
        },
		ta_oneline_summary: {
            type: Sequelize.STRING(50)
        },
		ta_contiue_spend_budget: {
            type: Sequelize.BOOLEAN
        },
		ta_bonus_rewards_benefits: {
            type: Sequelize.JSONB
        },
		ta_remaining_budget: {
            type: Sequelize.INTEGER
        },
		is_autotakedown:{
            type: Sequelize.INTEGER,
			default: 0
        }
    }, {
        createdAt: 'ta_created_at',
        updatedAt: 'ta_updated_at',
        freezeTableName: true,
        tableName: 'task',
        underscored: true
    });
    return Tasks;
}