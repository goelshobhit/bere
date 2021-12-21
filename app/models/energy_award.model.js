module.exports = (sequelize, Sequelize) => {
  const energy_award = sequelize.define("energy_award", {
    energy_award_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    energy_userid: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    energy_bal: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    energy_prev_bal: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    energy_credit: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    energy_timestamp: {
      type: Sequelize.STRING(100),
      allowNull: false,
    }
  }, {
      createdAt: 'energy_award_created_at',
      updatedAt: 'energy_award_updated_at',
      freezeTableName: true,
      tableName: 'energy_award',
      underscored: true
  });
  return energy_award;
}