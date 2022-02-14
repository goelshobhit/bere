module.exports = (sequelize, Sequelize) => {
  const bonus_task_user_state = sequelize.define("bonus_task_user_state", {
    btus_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    bonus_task_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_task_usr_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    usr_state: {
      type: Sequelize.INTEGER
    }
  }, {
      createdAt: 'btus_created_at',
      updatedAt: 'btus_updated_at',
      freezeTableName: true,
      tableName: 'bonus_task_user_state',
      underscored: true
  });
  return bonus_task_user_state;
}