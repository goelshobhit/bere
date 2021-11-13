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
        ta_hearts_per_user:{
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
    }, {
        createdAt: 'ta_created_at',
        updatedAt: 'ta_updated_at',
        freezeTableName: true,
        tableName: 'task',
        underscored: true
    });
    return Tasks;
}