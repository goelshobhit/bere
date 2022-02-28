const { isNull } = require("util");

module.exports = (sequelize, Sequelize) => {
    const brand_task_closed = sequelize.define("brand_task_closed", {
        btc_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        brand_id: {
            type: Sequelize.INTEGER
        },
        task_id: {
            type: Sequelize.INTEGER,
            defaultValue: null
        },
        brand_task_closed: {
            type: Sequelize.INTEGER
        },
        brand_task_create_date: {
            type: Sequelize.DATE
        },
        brand_task_closed_date: {
            type: Sequelize.DATE
        }
    }, {
        createdAt: 'btc_created_at',
        updatedAt: 'btc_updated_at',
        freezeTableName: true,
        tableName: 'brand_task_closed',
        underscored: true
    });
    return brand_task_closed;
};
  