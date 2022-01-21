'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('survey_submissions', 'srs_srq_answer', 'srs_srq_answer_id')
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.renameColumn('survey_submissions', 'srs_srq_answer_id', 'srs_srq_answer')
  }
};
