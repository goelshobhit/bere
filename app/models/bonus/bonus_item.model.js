module.exports = (sequelize, Sequelize) => {
  const bonus_item = sequelize.define("bonus_item", {
    bonus_item_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    bonus_item_brand_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_item_name: {
      allowNull: false,
      type: Sequelize.STRING(255)
    },
    bonus_item_qty: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_item_remaining_qty: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_item_timestamp: {
      allowNull: false,
      type: Sequelize.STRING(50)
    }
  }, {
      createdAt: 'bonus_item_created_at',
      updatedAt: 'bonus_item_updated_at',
      freezeTableName: true,
      tableName: 'bonus_item',
      underscored: true
  });
  return bonus_item;
}