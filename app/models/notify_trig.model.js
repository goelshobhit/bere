module.exports = (sequelize, Sequelize) => {
    const notify_trig = sequelize.define("notify_trig", {
        notify_trig_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		notify_event_id:{
			type: Sequelize.TEXT,
            allowNull: false,
		},
		notify_method:{
			type: Sequelize.TEXT,
			allowNull: false,
		},
		notify_type:{
			type: Sequelize.TEXT,
			allowNull: false,
		},
		notify_trig_pushalert:{
			type: Sequelize.TEXT,
			allowNull: false,
		},
		notify_trig_msg:{
			type: Sequelize.TEXT,
			allowNull: false,
		},
		notify_trig_group_id:{
			type: Sequelize.TEXT,
		},
		notify_group_name:{
			type: Sequelize.TEXT,
			allowNull: false,
		},
		notify_send_date:{
			type: Sequelize.DATE,
		},
		notify_ack:{
			type: Sequelize.DATE,
			allowNull: false,
		},
		notify_trig_status:{
			type: Sequelize.DATE,
			allowNull: false,
		},
		notify_push_id:{
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		brand_id:{
			type: Sequelize.INTEGER,
			allowNull: false,
		}
    }, {
        createdAt: 'nt_created_at',
        updatedAt: 'nt_updated_at',
        freezeTableName: true,
        tableName: 'notify_trig',
        underscored: true
    });
    return notify_trig;
}