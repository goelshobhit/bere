module.exports = (sequelize, Sequelize) => {
  const bonus_ticket = sequelize.define("bonus_ticket", {
    bonus_ticket_id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    bonus_summary_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_ticket_entry_timestamp: {
      type: Sequelize.STRING(255)
    },
    bonus_ticket_contest_start_timestamp: {
      type: Sequelize.STRING(255)
    },
    bonus_ticket_contest_end_timestamp: {
      type: Sequelize.STRING(255)
    },
    bonus_ticket_rules_id: {
      type: Sequelize.INTEGER
    },
    bonus_ticket_rules: {
      type: Sequelize.STRING(255)
    },
    bonus_ticket_usrid: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_ticket_entry1: {
      type: Sequelize.STRING(255)
    },
    bonus_ticket_winning: {
      type: Sequelize.STRING(255)
    },
    bonus_ticket_bonus_taskid: {
      allowNull: false,
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'bonus_ticket_created_at',
      updatedAt: 'bonus_ticket_updated_at',
      freezeTableName: true,
      tableName: 'bonus_ticket',
      underscored: true
  });
  return bonus_ticket;
}