module.exports = (sequelize, Sequelize) => {
    const brand_user_share = sequelize.define("brand_user_share", {
        bus_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        brand_id: {
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        is_brand_follow: {
            type: Sequelize.INTEGER
        },
        is_facebook_share: {
            type: Sequelize.INTEGER
        },
        is_twitter_share: {
            type: Sequelize.INTEGER
        },
        is_pinterest_share: {
            type: Sequelize.INTEGER
        },
        is_instagram_share: {
            type: Sequelize.INTEGER
        },
        is_tiktok_share: {
            type: Sequelize.INTEGER
        }
    }, {
        createdAt: 'bus_created_at',
        updatedAt: 'bus_updated_at',
        freezeTableName: true,
        tableName: 'brand_user_share',
        underscored: true
    });
    return brand_user_share;
};
  