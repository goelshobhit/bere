module.exports = (sequelize, Sequelize) => {
  const bonus_ticket_rules = sequelize.define("bonus_ticket_rules", {
    bonus_ticket_rules_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },                                        
    bonus_ticket_rule_name: {
      allowNull: false,
      type: Sequelize.STRING(255)
    },
    bonus_ticket_how_it_works: {
      type: Sequelize.STRING(255)
    },
    bonus_ticket_cashout_rules: {
      type: Sequelize.STRING(255)
    }
  }, {
      createdAt: 'bonus_ticket_rules_created_at',
      updatedAt: 'bonus_ticket_rules_updated_at',
      freezeTableName: true,
      tableName: 'bonus_ticket_rules',
      underscored: true
  });
  return bonus_ticket_rules;
}