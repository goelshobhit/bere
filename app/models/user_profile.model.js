const crypto = require('crypto');
module.exports = (sequelize, Sequelize) => {
    const user_profile = sequelize.define("user_profile", {
        u_id :{
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        u_display_name: {
			type: Sequelize.STRING(50)
        },
        u_f_name: {
			type: Sequelize.STRING(50)
        },
        u_l_name: {
           type: Sequelize.STRING(50)
        },
        u_dob_d: {
            type: Sequelize.INTEGER
        },
		u_dob_m: {
            type: Sequelize.INTEGER
        },
        u_dob_y:{
            type: Sequelize.INTEGER
        },
        u_gender:{
             type: Sequelize.INTEGER,
			 default:0
        },
        u_address:{
            type: Sequelize.STRING(100)
        },
        u_city:{
            type: Sequelize.STRING(50)
        },
        u_state:{
            type: Sequelize.STRING(50)
        },
        u_country:{
            type: Sequelize.STRING(50)
        },
        u_zipcode:{
            type: Sequelize.STRING(50)
        },
        u_prof_img_path:{
            type: Sequelize.STRING(50)
        },
        u_phone:{
            type: Sequelize.STRING(15)
        },
        u_status:{
            type: Sequelize.INTEGER,
			default:0
        },
        u_has_children:{
            type: Sequelize.BOOLEAN
        },
		u_child_age:{
			type: Sequelize.JSONB
		},
		u_edu_level:{
			 type: Sequelize.INTEGER
		},
		phone_otp:{
			 type: Sequelize.INTEGER
		},
		u_profession:{
			 type: Sequelize.INTEGER
		},
		u_property:{
			type: Sequelize.INTEGER
		},
		u_vehicle:{
			type: Sequelize.BOOLEAN
		},
		u_vin:{
			type: Sequelize.JSONB
		},
        u_hearts:{
			 type: Sequelize.INTEGER
		},
        u_budget:{
			 type: Sequelize.INTEGER
		},
        u_website:{
			 type: Sequelize.STRING(150)
		}		
    }, {
        createdAt: 'u_created_at',
        updatedAt: 'u_updated_at',
        freezeTableName: true,
        tableName: 'user_profile',
        underscored: true
    });
    return user_profile;
}