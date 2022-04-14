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
    bonus_item_description: {
      type: Sequelize.TEXT
    },
    bonus_item_icons: {
      type: Sequelize.TEXT
    },
    bonus_product_images: {
      type: Sequelize.TEXT
    },
    bonus_item_dollar_value: {
      type: Sequelize.DECIMAL(10,2)
    },
    user_token_value_not_accepting: {
      type: Sequelize.INTEGER
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
    },
    bonus_item_is_active: {
      defaultValue: true,
      type: Sequelize.BOOLEAN
    },
    bonus_item_giveaway_type: {
      type: Sequelize.INTEGER   //2 = level 2, 3 = level 3, 4 = brand prize set, 5= task specific 
    },
    brand_task: {         // 1= on, 0 = off
      type: Sequelize.BOOLEAN
    },
    number_of_tasks_available: {
      type: Sequelize.INTEGER
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