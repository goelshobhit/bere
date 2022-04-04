module.exports = (sequelize, Sequelize) => {
    const AppSuggestion = sequelize.define("app_suggestion", {
        app_suggestion_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        u_id: {
            type: Sequelize.INTEGER,
        },
        feedback_type_name: {
            type: Sequelize.TEXT,
        },
        feedback_in_detail: {
            type: Sequelize.TEXT,
        },
        feedback_images: {
            type: Sequelize.TEXT,
        }
    }, {
        createdAt: 'app_suggestion_created_at',
        updatedAt: 'app_suggestion_updated_at',
        freezeTableName: true,
        tableName: 'app_suggestion',
        underscored: true
    });
    return AppSuggestion;
};
  