const crypto = require('crypto');
module.exports = (sequelize, Sequelize) => {
    const user_social_ext = sequelize.define("user_social_ext", {
        u_id :{
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        use_u_fb_link: {
			type: Sequelize.STRING(100)
        },
        use_u_insta_link: {
			type: Sequelize.STRING(100)
        },
        use_u_twitter_link: {
            type: Sequelize.STRING(100)
        },
		use_u_pinterest_link: {
            type: Sequelize.STRING(100)
        },
		use_u_fb_followers_count:{
		type: Sequelize.INTEGER,
		default:0
		},
		use_u_insta_followers_count:{
		type: Sequelize.INTEGER,
		default:0
		},
		use_u_twitter_followers_count:{
		type: Sequelize.INTEGER,
		default:0
		},
		use_u_pinsterest_followers_count:{
		type: Sequelize.INTEGER,
		default:0
		},
		use_u_platform_followers_count:{
		type: Sequelize.INTEGER,
		default:0
		},
		show_fb:{
		type: Sequelize.BOOLEAN,
		default: true
		},
		show_insta:{
		type: Sequelize.BOOLEAN,
		default: true
		},
		show_twitter:{
		type: Sequelize.BOOLEAN,
		default: true
		},
		show_pinterest:{
		type: Sequelize.BOOLEAN,
		default: true
		}
    }, {
        createdAt: 'use_created_at',
        updatedAt: 'use_updated_at',
        freezeTableName: true,
        tableName: 'user_social_ext',
        underscored: true
    });
    return user_social_ext;
}