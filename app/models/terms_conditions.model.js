module.exports = (sequelize, Sequelize) => {
    const terms_conditions = sequelize.define("terms_conditions", {
		id: {
            primaryKey: true,                                                                                                                                                         
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
        }
    }, {
        createdAt: 'tc_created_at',
        updatedAt: 'tc_updated_at',
        freezeTableName: true,
        tableName: 'terms_conditions',
        underscored: true
    });
    return terms_conditions;
};