module.exports = (sequelize, Sequelize) => {
  const bonus_ticket_rule = sequelize.define("bonus_ticket_rule", {
    bonus_tickets_rules_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    bonus_tickets_rule_name: {
      allowNull: false,
      type: Sequelize.STRING
    }
  }, {
      createdAt: 'bonus_tickets_rule_created_at',
      updatedAt: 'bonus_tickets_rule_updated_at',
      freezeTableName: true,
      tableName: 'bonus_ticket_rule',
      underscored: true
  });
  return bonus_ticket_rule;
}