module.exports = params => {
    const db = require("../models");
    const NotifyTrigger = db.notify_trig;
    const NotifySent = db.notify_trig_sent;
    const NotifyEvent = db.notify_event;
    const audit_log = db.audit_log
    const logger = require("../middleware/logger");
    const auth = require("../middleware/auth");
    var router = require("express").Router();
    const {app, io} = params;
  var pushService = (function() {
      var connections = {};
      return {
          registerUser: function(userId, connectionId) {
              if (connections[userId] === undefined) {
                  connections[userId] = {};
              }
              connections[userId][connectionId] = null;
              console.log('Connection ' + connectionId + ' has been obtained by user ' + userId);
          },
          registerSocket: function(userId, connectionId, socket) {
              if (connections[userId] != null && connections[userId][connectionId] == null) {
                  socket.userId = userId;
                  socket.connectionId = connectionId;
                  connections[userId][connectionId] = socket;
                  console.log('Socket has been established using connection ' + connectionId + ' and  user ' + userId);
                  return true;
              } else {
                  console.log('Cannot register a socket using connection ' + connectionId + ' and  user ' + userId);
                  return false;
              }
          },
          removeConnection: function(socket) {
              var userId = socket.userId;
              var connectionId = socket.connectionId;
              if (userId && connectionId && connections[userId] && connections[userId][connectionId]) {
                  console.log('Socket has been removed data are user ' + userId + ' and connection: ' + connectionId + '***');
                  delete connections[socket.connectionId];
              }
          },
          pushMessage: function(userId, notifyTrigger, notifyEvent) {
              const {notify_trig_msg: message} = notifyTrigger;
              var userConnections = connections[userId];
              if (userConnections) {
                  for (var connectionId in  userConnections) {
                      if (userConnections.hasOwnProperty(connectionId)) {
                          var socket = userConnections[connectionId];
                          if (socket != null) {
                              const { notify_event_usrOptOut } = notifyEvent;
                              if(notify_event_usrOptOut !== 1) {
                                socket.emit('message', message);
                              }
                              const notifyTrigSent = {
                                "notify_trig_id": notifyTrigger.notify_trig_id,
                                "notify_event_id": notifyTrigger.notify_event_id,
                                "notify_method": notifyTrigger.notify_method,
                                "notify_type": notifyTrigger.notify_type,
                                "notify_trig_pushalert": notifyTrigger.notify_trig_pushalert,
                                "notify_trig_msg": notifyTrigger.notify_trig_msg,
                                "notify_trig_grp_id": notifyTrigger.notify_trig_grp_id,
                                "notify_group_name": notifyTrigger.notify_group_name,
                                "notify_send_date": notifyTrigger.notify_send_date,
                                "notify_ack": notifyTrigger.notify_ack,
                                "notify_trig_status": notifyTrigger.notify_trig_status,
                                "notify_trig_push_id": notifyTrigger.notify_trig_push_id,
                                "cr_co_id": notifyTrigger.cr_co_id
                            }
                              NotifySent.create(notifyTrigSent).then(data => {
                                audit_log.saveAuditLog(userId,'add','todayTimeStamp',data.notify_sent_trig_id,data.dataValues);
                            }).catch(err => {
                                logger.log("error", "Some error occurred while creating the Notify Trigger=" + err);
                            })
                          }
                      }
                  }
              }
          }
      }
  }());
  io.on('connection', function(socket) {
    socket.on('register', message => {
        const json = JSON.parse(message);
        const {userId, connectionId} = json;
        pushService.registerSocket(userId, connectionId, socket);
    });
    socket.on('disconnect', function() {
        pushService.removeConnection(socket);
    });
  });
  /**
   * @swagger
   * /api/socket/register:
   *   post:
   *     tags:
   *       - Socket Server
   *     description: Register to receive notifications
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Register to receive notifications
   *       422:
   *         description: validation errors
   *       500:
   *         description: Internal server error
   *       401:
   *          description: Unauthorized
   *          content:
   *              application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                          message:
   *                              type: string
   *                              example: Authorisation Required
   */  
router.post('/socket/register',auth, function(req, res) {
    var userId=req.header(process.env.UKEY_HEADER || "x-api-key");
    const max = 9999999;
    const min = 0;
    var connectionId = Math.floor(Math.random() * (max - min) + min)
    if (userId && connectionId) {
        pushService.registerUser(userId, connectionId);
        res.status(200).send({
            data: {userId, connectionId}
        });
    } else {
        res.status(400).send('Bad Request');
    }
});
  /**
   * @swagger
   * /api/socket/push/{notifyEventId}:
   *   post:
   *     parameters:
   *         - name: notifyEventId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Socket Server
   *     description: Trigger a notification
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Trigger a notification
   *       422:
   *         description: validation errors
   *       500:
   *         description: Internal server error
   *       401:
   *          description: Unauthorized
   *          content:
   *              application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                          message:
   *                              type: string
   *                              example: Authorisation Required
   */  
router.post('/socket/push/:notifyEventId',auth, async function(req, res) {
    var userId=req.header(process.env.UKEY_HEADER || "x-api-key");
    const notifyEventId = parseInt(req.params.notifyEventId);
    if (userId && notifyEventId) {
        var options = {
            where: {
                notify_event_id: notifyEventId
            }
        };
        const notifyTrigger = await NotifyTrigger.findOne(options);
        if(!notifyTrigger){
            res.status(500).send({
                message: "Notify Trigger not found"
            });
            return
        }
        const notifyEvent = await NotifyEvent.findOne(options);
        if(!notifyEvent){
            res.status(500).send({
                message: "Notify Event not found"
            });
            return
        }
        pushService.pushMessage(userId, notifyTrigger, notifyEvent);
        res.send();
    }
    else {
        res.status(400).send('Bad Request');
    }
  });
  app.use("/api", router);
};