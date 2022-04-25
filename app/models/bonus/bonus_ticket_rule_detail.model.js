module.exports = (sequelize, Sequelize) => {
  const bonus_ticket_rule_detail = sequelize.define("bonus_ticket_rule_detail", {
    bonus_ticket_rule_detail_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },                                        
    bonus_ticket_rules_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },                                        
    bonus_ticket_rule_type: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_ticket_social_networks: {
      type: Sequelize.STRING(255)
    },
    bonus_rules: {
      type: Sequelize.JSONB
    }
  }, {
      createdAt: 'bonus_ticket_rule_detail_created_at',
      updatedAt: 'bonus_ticket_rule_detail_updated_at',
      freezeTableName: true,
      tableName: 'bonus_ticket_rule_detail',
      underscored: true
  });
  return bonus_ticket_rule_detail;
}