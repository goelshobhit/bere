const { INTEGER } = require("sequelize");
const { STRING } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const category = sequelize.define("category", {
		category_id: {
            primaryKey: true,                                                                                                                                                         
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        category_name: {
            type: STRING,
            allowNull: false
        },
        category_type: {
            type: STRING,    // default post
            defaultValue: 'POST'
        },
        category_status: {
            type: INTEGER,
            defaultValue: 1
        }
    }, {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        freezeTableName: true,
        tableName: 'category',
        underscored: true
    });
    return category;
};