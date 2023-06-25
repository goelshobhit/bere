const { nanoid } = require("nanoid");
module.exports = (sequelize, Sequelize) => {
  const WalletSchema = sequelize.define(
    "user_transactions",
    {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: () => nanoid(10),
        allowNull: false,
      },
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
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
      freezeTableName: true,
      tableName: "user_transactions",
      underscored: true,
    }
  );

  return WalletSchema;
};
