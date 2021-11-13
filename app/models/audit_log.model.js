module.exports = (sequelize, Sequelize) => {
    const AuditLog  = sequelize.define("audit_log ", {
        al_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        al_userId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
          },
        al_actionId: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
          },
        al_actionType: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
          },
        al_table: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
          },
        al_prevValues: {    
            type: Sequelize.DataTypes.JSONB,
            default:[]
          },
        al_newValues: {
            type: Sequelize.DataTypes.JSONB,
            allowNull: false,
          }
    }, {
        createdAt: 'al_created_at',
        updatedAt: 'al_updated_at',
        freezeTableName: true,
        tableName: 'audit_log',
        underscored: true
    });    
    AuditLog.saveAuditLog= function(userId,action,tbl,actionId,newValues,prevValues=[]) {      
      AuditLog.create({
        al_userId: userId,
        al_actionType: action,
        al_actionId: actionId,
        al_table: tbl,
        al_prevValues: prevValues,
        al_newValues: newValues
      });
    }
    return AuditLog;
};
  