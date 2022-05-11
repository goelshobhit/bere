const { INTEGER } = require("sequelize");
const { STRING } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const help_support = sequelize.define("help_support", {
		help_support_id: {
            primaryKey: true,                                                                                                                                                         
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    }, {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
        tableName: 'help_support',
        underscored: true
    });
    return help_support;
};