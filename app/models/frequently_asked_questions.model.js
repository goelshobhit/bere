module.exports = (sequelize, Sequelize) => {
    const frequently_asked_questions = sequelize.define("frequently_asked_questions", {
		faq_id: {
            primaryKey: true,                                                                                                                                                         
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        faq_question: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        faq_answer: {
            type: Sequelize.TEXT,
            allowNull: false,
        }
    }, {
        createdAt: 'faq_created_at',
        updatedAt: 'faq_updated_at',
        freezeTableName: true,
        tableName: 'frequently_asked_questions',
        underscored: true
    });
    return frequently_asked_questions;
};