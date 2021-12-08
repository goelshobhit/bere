module.exports = (sequelize, Sequelize) => {
  const bonus_sm_share = sequelize.define("bonus_sm_share", {
    bonus_sm_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    bonus_sm_name: {
      type: Sequelize.STRING(255)
    },
    bonus_sm_share_user_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_sm_share_timestamp: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    bonus_sm_share_ack: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    bonus_sm_share_url: {
      type: Sequelize.STRING(255)
    }
  }, {
      createdAt: 'bonus_sm_created_at',
      updatedAt: 'bonus_sm_updated_at',
      freezeTableName: true,
      tableName: 'bonus_sm_share',
      underscored: true
  });
  return bonus_sm_share;
}