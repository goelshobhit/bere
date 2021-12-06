"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "co_reg",
        "is_autotakedown",
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "campaign",
        "is_autotakedown",
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "user_content_post",
        "is_autotakedown",
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "post_comment",
        "is_autotakedown",
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "task",
        "is_autotakedown",
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "post_report",
        "is_autotakedown",
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "contest_task",
        "is_autotakedown",
        {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "user_login",
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
      await queryInterface.removeColumn("co_reg", "is_autotakedown", { transaction });
      await queryInterface.removeColumn("campaign", "is_autotakedown", { transaction });
      await queryInterface.removeColumn("user_content_post", "is_autotakedown", { transaction });
      await queryInterface.removeColumn("post_comment", "is_autotakedown", { transaction });
      await queryInterface.removeColumn("task", "is_autotakedown", { transaction });
      await queryInterface.removeColumn("post_report", "is_autotakedown", { transaction });
      await queryInterface.removeColumn("contest_task", "is_autotakedown", { transaction });
      await queryInterface.removeColumn("user_login", "is_autotakedown", { transaction });
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