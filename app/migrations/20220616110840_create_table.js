module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("user_wallets", {
      id: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      wallet_address: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      userEmail: {
        type: Sequelize.STRING,
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
