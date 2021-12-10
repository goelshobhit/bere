'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('survey', {
      fields: ['sr_brand_id'],
      type: 'foreign key',
      name: 'survey_sr_brand_id_fkey', // optional
      references: {
        table: 'co_reg',
        field: 'cr_co_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
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
