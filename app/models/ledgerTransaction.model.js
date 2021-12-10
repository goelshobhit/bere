const crypto = require('crypto');
module.exports = (sequelize, Sequelize) => {
    const ledger_transactions = sequelize.define("ledger_transactions", {
        trx_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        trx_account_no : {
			type: Sequelize.STRING(50)
        },
        trx_user_id : {
			type: Sequelize.INTEGER,
			allowNull: false,
        },
        trx_unique_id: {
            type: Sequelize.STRING(50),//Generate unique transaction id- Postid+userid+date/time
			allowNull: false,
        },
        trx_type: {
            type: Sequelize.INTEGER  //0=debit, 1=credit
        },
		trx_coins: {
            type: Sequelize.INTEGER, //Coins(credit/debit)
			defaultValue:0
        },
		trx_stars: {
            type: Sequelize.INTEGER, //stars(credit/debit)
			defaultValue:0
        },
        trx_date_timestamp:{
            type: Sequelize.DATE
        },
        trx_source:{
            type: Sequelize.JSONB
        },
		trx_approval_status:{
			type: Sequelize.INTEGER, // 0=approve, 1=reject, 2=inprogress, 3=cancel
		},
		trx_description:{
            type: Sequelize.TEXT
        },
		trx_currency_converation_amount:{  
            type: Sequelize.STRING(50)  //Amount debited by user(amount)-m 20$
        },
		trx_conversion_rate:{
			type: Sequelize.STRING(20)  //This is current conversation of 100 coins(coins)- 1$
		},
		trx_withdraw_destination:{
			type: Sequelize.INTEGER  // 0=Riddim,1=braintree,2=Paypal
		}
    }, {
        createdAt: 'trx_created_at',
        updatedAt: 'trx_updated_at',
        freezeTableName: true,
        tableName: 'ledger_transactions',
        underscored: true
    });
	
    return ledger_transactions;
}