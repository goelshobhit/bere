const table_name='user_login'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(table_name, "username", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table_name, "country", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table_name, "state", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table_name, "city", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table_name, "job_title", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table_name, "bio", {
      type: Sequelize.TEXT, 
    });
    await queryInterface.addColumn(table_name, "referral_code", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn(table_name, "referral_link", {
      type: Sequelize.STRING,
    });
  },
  down: async(queryInterface, Sequelize) => {
     await queryInterface.removeColumn(table_name, "country");
     await queryInterface.removeColumn(table_name, "state");
     await queryInterface.removeColumn(table_name, "city");
     await queryInterface.removeColumn(table_name, "job_title");
     await queryInterface.removeColumn(table_name, "bio");
     await queryInterface.removeColumn(table_name, "referral_code");
     await queryInterface.removeColumn(table_name, "referral_link");
  }
};
