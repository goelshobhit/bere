module.exports = (sequelize, Sequelize) => {
  const bonus_usr = sequelize.define("bonus_usr", {
    bu_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    bonus_usr_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_usr_riddim_level: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_usr_history_not_won: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_usr_followers_riddim: {
      allowNull: false,
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'bonus_usr_created_at',
      updatedAt: 'bonus_usr_updated_at',
      freezeTableName: true,
      tableName: 'bonus_usr',
      underscored: true
  });
  return bonus_usr;
}