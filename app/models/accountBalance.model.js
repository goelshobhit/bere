module.exports = (sequelize, Sequelize) => {
    const account_balance  = sequelize.define("account_balance", {
        ac_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ac_user_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
        },
        ac_balance: {
            type: Sequelize.DataTypes.INTEGER,
            default: 0,
        },
		ac_balance_stars: {
            type: Sequelize.DataTypes.INTEGER,
            default: 0,
        },
        ac_account_no: {
            type: Sequelize.DataTypes.STRING,
        }
    }, {
        createdAt: 'ac_created_at',
        updatedAt: 'ac_updated_at',
        freezeTableName: true,
        tableName: 'account_balance',
        underscored: true
    }); 
	
    return account_balance;
};
  