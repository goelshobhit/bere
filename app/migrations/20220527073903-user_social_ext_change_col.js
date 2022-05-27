"use strict";
const tableName = "user_social_ext";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const promises = [];
    return queryInterface.describeTable(tableName).then(tableDefinition => {
      if (!tableDefinition['use_u_facebook_link']) {
        promises.push(queryInterface.renameColumn(
          tableName,
          'use_u_fb_link','use_u_facebook_link'
        ));
      }
      if (!tableDefinition['use_u_instagram_link']) {
        promises.push(queryInterface.renameColumn(
          tableName,
          'use_u_insta_link','use_u_instagram_link'
        ));
      }
      if (!tableDefinition['use_u_instagram_followers_count']) {
        promises.push(queryInterface.renameColumn(
          tableName,
          'use_u_insta_followers_count','use_u_instagram_followers_count'
        ));
      }
      if (!tableDefinition['use_u_facebook_followers_count']) {
        promises.push(queryInterface.renameColumn(
          tableName,
          'use_u_fb_followers_count','use_u_facebook_followers_count'
        ));
      }
      if (!tableDefinition['use_u_pinterest_followers_count']) {
        promises.push(queryInterface.renameColumn(
          tableName,
          'use_u_pinsterest_followers_count','use_u_pinterest_followers_count'
        ));
      }
      if (!tableDefinition['show_facebook']) {
        promises.push(queryInterface.renameColumn(
          tableName,
          'show_fb','show_facebook'
        ));
      }
      if (!tableDefinition['show_instagram']) {
        promises.push(queryInterface.renameColumn(
          tableName,
          'show_insta','show_instagram'
        ));
      }
      if (!tableDefinition['use_u_snapchat_link']) {
        promises.push(queryInterface.addColumn(tableName, 'use_u_snapchat_link', {
          type: Sequelize.STRING(100)   
        }));
      }
      if (!tableDefinition['use_u_tiktok_link']) {
        promises.push(queryInterface.addColumn(tableName, 'use_u_tiktok_link', {
          type: Sequelize.STRING(100)   
        }));
      }
      if (!tableDefinition['use_u_snapchat_followers_count']) {
        promises.push(queryInterface.addColumn(tableName, 'use_u_snapchat_followers_count', {
          type: Sequelize.INTEGER
        }));
      }
      if (!tableDefinition['use_u_tiktok_followers_count']) {
        promises.push(queryInterface.addColumn(tableName, 'use_u_tiktok_followers_count', {
          type: Sequelize.INTEGER
        }));
      }
      if (!tableDefinition['show_snapchat']) {
        promises.push(queryInterface.addColumn(tableName, 'show_snapchat', {
          type: Sequelize.BOOLEAN,
          defaultValue: true   
        }));
      }
      if (!tableDefinition['show_tiktok']) {
        promises.push(queryInterface.addColumn(tableName, 'show_tiktok', {
          type: Sequelize.BOOLEAN,
          defaultValue: true   
        }));
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

