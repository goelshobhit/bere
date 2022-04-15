module.exports = (sequelize, Sequelize) => {
  const bonus_ticket_details = sequelize.define("bonus_ticket_details", {
    btd_id: {
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    bonus_set_id: {
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER
    },
    event_id: {
      type: Sequelize.INTEGER
    },
    event_type: {
      type: Sequelize.STRING(50)
    },
    bonus_ticket_rules_id: {
      type: Sequelize.INTEGER
    },
    tickets_earned_for: {
      type: Sequelize.STRING(100)
    },
    tickets_earned: {
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'btd_created_at',
      updatedAt: 'btd_updated_at',
      freezeTableName: true,
      tableName: 'bonus_ticket_details',
      underscored: true
  });
  return bonus_ticket_details;
}