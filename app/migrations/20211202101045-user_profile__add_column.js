"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "user_profile",
        "is_autotakedown",
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "tasks_json",
        "is_autotakedown",
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        { transaction },
      );
      await transaction.commit();
      return Promise.resolve();
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      return Promise.reject(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("user_profile", "is_autotakedown", { transaction });
      await queryInterface.removeColumn("tasks_json", "is_autotakedown", { transaction });
      await transaction.commit();
      return Promise.resolve();
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      return Promise.reject(err);
    }
  },
};