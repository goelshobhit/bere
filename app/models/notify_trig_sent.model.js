module.exports = (sequelize, Sequelize) => {
    const notify_trig_sent = sequelize.define("notify_trig_sent", {
        notify_sent_trig_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		u_id: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		notify_trig_id: {
			type: Sequelize.INTEGER
		},
		notify_event_id:{
			type: Sequelize.INTEGER,
		},
		notify_method:{
			type: Sequelize.TEXT,
		},
		notify_type:{
			type: Sequelize.TEXT,
		},
		notify_trig_pushalert:{
			type: Sequelize.TEXT,
		},
		notify_trig_msg:{
			type: Sequelize.TEXT,
			allowNull: false,
		},
		notify_trig_grp_id:{
			type: Sequelize.INTEGER,
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
		},
		notify_trig_status:{
			type: Sequelize.DATE,
		},
		notify_trig_push_id:{
			type: Sequelize.INTEGER
		},
		notify_object_id: {
			type: Sequelize.INTEGER,
		},
		cr_co_id:{
			type: Sequelize.INTEGER,
			allowNull: false,
		}
    }, {
        createdAt: 'nt_created_at',
        updatedAt: 'nt_updated_at',
        freezeTableName: true,
        tableName: 'notify_trig_sent',
        underscored: true
    });
    return notify_trig_sent;
}