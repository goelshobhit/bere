module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("user_transactions", {
      id: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
      stripe_transactionId: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      wallet_id: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.FLOAT,
      },
      transaction_time: {
        type: Sequelize.DATE,
      },
    });
  },
};
