module.exports = (sequelize, Sequelize) => {
  const energy = sequelize.define("energy", {
    energy_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    energy_userid: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    energy_deduction: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    energy_bal: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    energy_award_timestamp: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    energy_award_future_timestamp: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    energy_taskid: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    energy_task_completion: {
      allowNull: false,
      default : 1,
      type: Sequelize.INTEGER,
    },
    energy_task_restriction: {
      allowNull: false,
      default : 0,
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'energy_created_at',
      updatedAt: 'energy_updated_at',
      freezeTableName: true,
      tableName: 'energy',
      underscored: true
  });
  return energy;
}