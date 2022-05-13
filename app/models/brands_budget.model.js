module.exports = (sequelize, Sequelize) => {
    const Brand_budget = sequelize.define("co_budget", {
        cr_bu_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cr_co_id: {
            type: Sequelize.INTEGER
        },
        cr_bu_amount: {
            type: Sequelize.STRING(100)
        },
        token_value_in_usd: {
            type: Sequelize.INTEGER
        },
        cr_bu_tokens: {
            type: Sequelize.INTEGER
        },
		cr_bu_note: {
            type: Sequelize.STRING(100)
        }
    }, {
        createdAt: 'cr_bu_created_at',
        updatedAt: 'cr_bu_updated_at',
        freezeTableName: true,
        tableName: 'co_budget',
        underscored: true
    });
    return Brand_budget;
};
  