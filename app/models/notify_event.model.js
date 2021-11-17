module.exports = (sequelize, Sequelize) => {
    const notify_event = sequelize.define("notify_event", {
        notify_event_id :{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
		notify_event_name:{
			type: Sequelize.INTEGER,
            allowNull: false,
		},
        notify_event_type: {
			type: Sequelize.INTEGER,
            allowNull: false,
        },
        cr_co_id: {
			type: Sequelize.INTEGER,
            allowNull: false,
        },
        notify_event_date: {
			type: Sequelize.DATE,
            allowNull: false,
        },
        notify_event_usrid: {
			type: Sequelize.INTEGER,
            allowNull: false,
        },
        notify_event_usrOptin: {
			type: Sequelize.INTEGER,
            allowNull: false,
        },
        notify_event_usrOptOut: {
			type: Sequelize.INTEGER,
            allowNull: false,
        },
        notify_event_usrOptOut_date: {
			type: Sequelize.INTEGER,
            allowNull: false,
        }
    }, {
        createdAt: 'ne_created_at',
        updatedAt: 'ne_updated_at',
        freezeTableName: true,
        tableName: 'notify_event',
        underscored: true
    });
    return notify_event;
}