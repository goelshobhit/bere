module.exports = (sequelize, Sequelize) => {
    const Brands = sequelize.define("brand", {
        cr_co_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cr_co_name: {
            type: Sequelize.STRING(50)
        },
        cr_co_address: {
            type: Sequelize.STRING(100)
        },
        cr_co_city: {
            type: Sequelize.STRING(50)
        },
        cr_co_state: {
            type: Sequelize.STRING(50)
        },
        cr_co_country: {
            type: Sequelize.STRING(50)
        },
        cr_co_pincode: {
            type: Sequelize.STRING(50)
        },
        cr_co_phone: {
            type: Sequelize.STRING(15)
        },
        cr_co_handle: {
            type: Sequelize.STRING(50)
        },
        cr_co_email: {
            type: Sequelize.STRING(50)
        },
        cr_co_logo_path: {
            type: Sequelize.STRING(50)
        },
        cr_co_fb_handle: {
            type: Sequelize.STRING(50)
        },
        cr_co_tw_handle: {
            type: Sequelize.STRING(50)
        },
        cr_co_pint_handle: {
            type: Sequelize.STRING(50) //0 offline 1 online
        },
        cr_co_insta_handle: {
            type: Sequelize.STRING(50) //0 offline 1 online
        },
        cr_co_desc_short: {
            type: Sequelize.STRING(50) //0 offline 1 online
        },
        cr_co_desc_long: {
            type: Sequelize.TEXT //0 offline 1 online
        },
        cr_co_website: {
            type: Sequelize.STRING(50) //0 offline 1 online
        },
        cr_co_contact_pers: {
            type: Sequelize.STRING(50) //0 offline 1 online
        },
        cr_co_contact_pers_dept: {
            type: Sequelize.STRING(50) //0 offline 1 online
        },
        cr_co_contact_pers_phone_ext: {
            type: Sequelize.STRING(12) //0 offline 1 online
        },
        cr_co_contact_pers_email: {
            type: Sequelize.STRING(50) //0 offline 1 online
        },
        cr_co_contact_pers_title: {
            type: Sequelize.STRING(25) //0 offline 1 online
        },
        cr_co_contact_pers_industry: {
            type: Sequelize.STRING(50) //0 offline 1 online
        },
        cr_co_other_categories: {
            type: Sequelize.JSONB //0 offline 1 online
        },
        cr_co_status: {
            type: Sequelize.INTEGER //0 offline 1 online
        },
        cr_co_cover_img_path: {
            type: Sequelize.STRING(50) //0 offline 1 online
        },
        cr_co_total_token: {
            type: Sequelize.INTEGER //0 offline 1 online
        },
        cr_co_token_spent: {
            type: Sequelize.INTEGER //0 offline 1 online
        },
		cr_co_alias: {
            type: Sequelize.STRING(10) //0 offline 1 online
        },
		is_autotakedown:{
            type: Sequelize.INTEGER,
			default: 0
        }
    }, {
        createdAt: 'cr_co_created_at',
        updatedAt: 'cr_co_updated_at',
        freezeTableName: true,
        tableName: 'co_reg',
        underscored: true
    });
    return Brands;
};
  