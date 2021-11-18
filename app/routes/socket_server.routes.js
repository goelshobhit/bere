module.exports = params => {
    const db = require("../models");
    const NotifyTrigger = db.notify_trig;
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
          pushMessage: function(userId, message) {
              var userConnections = connections[userId];
              if (userConnections) {
                  for (var connectionId in  userConnections) {
                      if (userConnections.hasOwnProperty(connectionId)) {
                          var socket = userConnections[connectionId];
                          if (socket != null) {
                              socket.emit('message', message);
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
   * /api/socket/{userId}/register:
   *   post:
   *     parameters:
   *         - name: userId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
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
router.post('/socket/:userId/register', function(req, res) {
    const userId = parseInt(req.params.userId);
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
   * /api/socket/{userId}/{notifyEventId}/push:
   *   post:
   *     parameters:
   *         - name: userId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
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
router.post('/socket/:userId/:notifyEventId/push', async function(req, res) {
    const userId = parseInt(req.params.userId);
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
        pushService.pushMessage(userId, notifyTrigger.notify_trig_msg);
        res.send();
    }
    else {
        res.status(400).send('Bad Request');
    }
  });
  app.use("/api", router);
};