module.exports = (sequelize, Sequelize) => {
  const bonus_set = sequelize.define("bonus_set", {
    bonus_set_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    bonus_set_brand_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_item_id: {
      allowNull: false,
      type: Sequelize.JSONB
    },
    bonus_set_item_name: {
      allowNull: false,
      type: Sequelize.STRING(255)
    },
    bonus_set_item_qty: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_tickets_rules_ids: {
      type: Sequelize.JSONB
    },
    bonus_set_duration: {
      defaultValue: 30,
      type: Sequelize.INTEGER
    },
    bonus_set_icons: {
      type: Sequelize.TEXT
    },
    bonus_set_images: {
      type: Sequelize.TEXT
    },
    bonus_set_start_date:{
      type: Sequelize.DATE
    },
    bonus_set_default:{
      type: Sequelize.INTEGER
   },
    bonus_set_item_timestamp: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    bonus_set_status: {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  }, {
      createdAt: 'bonus_set_created_at',
      updatedAt: 'bonus_set_updated_at',
      freezeTableName: true,
      tableName: 'bonus_set',
      underscored: true
  });
  return bonus_set;
}