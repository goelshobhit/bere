"use strict";
const tableName = "co_reg";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [];
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (tableDefinition['cr_co_snapchat_handle']) {
        promises.push(queryInterface.changeColumn(
          'co_reg',
          'cr_co_snapchat_handle',
          {type: 'JSONB USING CAST("cr_co_snapchat_handle" as JSONB)'}
        ));
      }
      if (tableDefinition['cr_co_tiktok_handle']) {
        promises.push(queryInterface.changeColumn(
          'co_reg',
          'cr_co_tiktok_handle',
          {type: 'JSONB USING CAST("cr_co_tiktok_handle" as JSONB)'}
        ));
      }
      if (tableDefinition['cr_co_insta_handle']) {
        promises.push(queryInterface.changeColumn(
          'co_reg',
          'cr_co_insta_handle',
          {type: 'JSONB USING CAST("cr_co_insta_handle" as JSONB)'}
        ));
      }
      if (tableDefinition['cr_co_pint_handle']) {
        promises.push(queryInterface.changeColumn(
          'co_reg',
          'cr_co_pint_handle',
          {type: 'JSONB USING CAST("cr_co_pint_handle" as JSONB)'}
        ));
      }
      if (tableDefinition['cr_co_tw_handle']) {
        promises.push(queryInterface.changeColumn(
          'co_reg',
          'cr_co_tw_handle',
          {type: 'JSONB USING CAST("cr_co_tw_handle" as JSONB)'}
        ));
      }
      if (tableDefinition['cr_co_fb_handle']) {
        promises.push(queryInterface.changeColumn(
          'co_reg',
          'cr_co_fb_handle',
          {type: 'JSONB USING CAST("cr_co_fb_handle" as JSONB)'}
        ));
      }
      if (tableDefinition['cr_co_website']) {
        promises.push(queryInterface.changeColumn(
          'co_reg',
          'cr_co_website',
          {type: 'JSONB USING CAST("cr_co_website" as JSONB)'}
        ));
      }
      if (promises.length) {
        return Promise.all(promises);
      } else {
        return Promise.resolve();
      }
     
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(tableName, columnName);
  }
};
