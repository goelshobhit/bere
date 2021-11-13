'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  queryInterface.removeConstraint('task_hashtag', 'task_hashtag_ta_task_id_fkey')
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
