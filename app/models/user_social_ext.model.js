const crypto = require('crypto');
module.exports = (sequelize, Sequelize) => {
    const user_social_ext = sequelize.define("user_social_ext", {
        u_id :{
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        use_u_facebook_link: {
			type: Sequelize.STRING(100)
        },
        use_u_instagram_link: {
			type: Sequelize.STRING(100)
        },
        use_u_twitter_link: {
            type: Sequelize.STRING(100)
        },
		use_u_pinterest_link: {
            type: Sequelize.STRING(100)
        },
		use_u_snapchat_link: {
            type: Sequelize.STRING(100)
        },
		use_u_tiktok_link: {
            type: Sequelize.STRING(100)
        },
		use_u_facebook_followers_count:{
		type: Sequelize.INTEGER,
		default:0
		},
		use_u_instagram_followers_count:{
		type: Sequelize.INTEGER,
		default:0
		},
		use_u_twitter_followers_count:{
		type: Sequelize.INTEGER,
		default:0
		},
		use_u_pinterest_followers_count:{
		type: Sequelize.INTEGER,
		default:0
		},
		use_u_snapchat_followers_count:{
		type: Sequelize.INTEGER,
		default:0
		},
		use_u_tiktok_followers_count:{
		type: Sequelize.INTEGER,
		default:0
		},
		use_u_platform_followers_count:{
		type: Sequelize.INTEGER,
		default:0
		},
		show_facebook:{
		type: Sequelize.BOOLEAN,
		default: true
		},
		show_instagram:{
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
		},
		show_snapchat:{
		type: Sequelize.BOOLEAN,
		default: true
		},
		show_tiktok:{
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