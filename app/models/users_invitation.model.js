module.exports = (sequelize, Sequelize) => {
    const users_invitation = sequelize.define("users_invitation", {
		users_invitation_id: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER,
        },
        users_invitation_user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        users_invitation_page_id: {
            type: Sequelize.INTEGER
        },
        users_invitation_object_id: {            // This is the ID of the object that is the source of the referral.
           type: Sequelize.INTEGER
        },
        users_invitation_action_id: {            
            type: Sequelize.INTEGER
        },
        users_invitation_recipient_email: {            
            type: Sequelize.STRING(100)
        },
        users_invitation_recipient_mobile: {            
            type: Sequelize.STRING(50)
        },
        users_invitation_url: {            
            type: Sequelize.STRING(255)
        },
        users_invitation_recipient_user_id: {            
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        users_invitation_invitation_timestamp: {            
            type: Sequelize.DATE
        },
        users_invitation_received_acknowledgment_timestamp: {            
            type: Sequelize.DATE
        },
        users_invitation_status: {            // 0 for recipient has not accepted, 1 for user has not accepted.
            type: Sequelize.INTEGER
        },
        users_invitation_delivery_method: {            // 0 for in app, 1= email, 2, mobile, 3 - IOS
            type: Sequelize.INTEGER
        },
        users_invitation_rewards_id: {               // This is the ID of the rewards that are going to be given
            type: Sequelize.INTEGER
        },
        users_invitation_rewards_object_id: {        // This is the ID of the type of rewards that is going to be given by the rewards center. 
            type: Sequelize.INTEGER
        }
    }, {
        createdAt: 'ui_created_at',
        updatedAt: 'ui_updated_at',
        freezeTableName: true,
        tableName: 'users_invitation',
        underscored: true
    });
    return users_invitation;
};