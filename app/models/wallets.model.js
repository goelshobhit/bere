const { nanoid } = require("nanoid");
module.exports = (sequelize, Sequelize) => {
  const WalletSchema = sequelize.define(
    "user_wallets",
    {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        defaultValue: nanoid(10),
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userEmail: {
        type: Sequelize.STRING,
      },
      wallet_ids: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
      freezeTableName: true,
      tableName: "user_wallets",
      underscored: true,
    }
  );

  return WalletSchema;
};
