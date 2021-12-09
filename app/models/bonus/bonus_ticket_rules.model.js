module.exports = (sequelize, Sequelize) => {
  const bonus_tickets_rules = sequelize.define("bonus_tickets_rules", {
    bonus_tickets_rules_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    bonus_tickets_rules: {
      type: Sequelize.STRING(255)
    },
    bonus_tickets_how_it_works: {
      type: Sequelize.STRING(255)
    },
    bonus_tickets_cashout_rules: {
      type: Sequelize.STRING(255)
    }
  }, {
      createdAt: 'bonus_tickets_rules_created_at',
      updatedAt: 'bonus_tickets_rules_updated_at',
      freezeTableName: true,
      tableName: 'bonus_tickets_rules',
      underscored: true
  });
  return bonus_tickets_rules;
}