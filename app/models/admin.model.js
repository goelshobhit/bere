const crypto = require('crypto');
module.exports = (sequelize, Sequelize) => {
    const Admin_users = sequelize.define("admin_users", {
        au_user_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        au_email: {
			type: Sequelize.STRING(50),
			allowNull: false,
			unique: 'uniqueadmin_users',
        },
        au_salt: {
			type: Sequelize.TEXT,
			allowNull: false,
        },
        au_password: {
            type: Sequelize.TEXT,
			allowNull: false,
        },
        au_name: {
            type: Sequelize.STRING(50),
			allowNull: false,
        },
		au_active_status: {
            type: Sequelize.INTEGER,
			defaultValue: 0
        },
        ar_role_id:{
            type: Sequelize.INTEGER,
			defaultValue: 0
        },
        au_is_deleted:{
            type: Sequelize.INTEGER,
			defaultValue: 0
        }
    }, {
        createdAt: 'au_created_at',
        updatedAt: 'au_updated_at',
        freezeTableName: true,
        tableName: 'admin_users',
        underscored: true
    });
Admin_users.generateSalt = function() {
    return crypto.randomBytes(16).toString('base64');
    }
Admin_users.encryptPassword = function(plainText, salt) {
    return crypto
        .createHash('RSA-SHA256')
        .update(plainText)
        .update(salt)
        .digest('hex');
    }
Admin_users.authenticate = async function(email) {
    const user =Admin_users.findOne({ attributes:["au_active_status","au_is_deleted","au_salt","au_password","au_user_id"],where: {au_email: email} });
    if(user){
      return user;
    }else{
      return false;
    }
} 
    return Admin_users;
}