module.exports = (sequelize, Sequelize) => {
    const tickets_distribution = sequelize.define("tickets_distribution", {
		tickets_distribution_id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        tickets_distribution_user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        tickets_distribution_user_tickets_earned: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        tickets_distribution_random_number_algo: {               //0 or 1
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        createdAt: 'td_created_at',
        updatedAt: 'td_updated_at',
        freezeTableName: true,
        tableName: 'tickets_distribution',
        underscored: true
    });
    return tickets_distribution;
};