module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("user_transactions", {
      id: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
      stripe_transaction_id: {
        type: Sequelize.STRING,
      },
      user_id: {
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
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
};
