'use strict';

const socketIO = require('socket.io');
const ot = require('ot');
const roomList = {};

module.exports = function(server) {
  const str = 'This is a Markdown heading \n\n' +
            'var i = i + 1;';

  const io = socketIO(server);
  io.on('connection', function(socket) {
    socket.on('joinRoom', function(data) {
      if (!roomList[data.room]) {
        const socketIOServer = new ot.EditorSocketIOServer(str, [], data.room, async function(_socket, cb) {
        try {
          const self = this;
          await Task.findByIdAndUpdate(data.room, {content: self.document})
          cb(true);
        } catch (err) {
            console.error(err);
            cb(false);
        }
        });
        roomList[data.room] = socketIOServer;
      }
      roomList[data.room].addClient(socket);
      roomList[data.room].setName(socket, data.username);

      socket.room = data.room;
      socket.join(data.room);
    });

    socket.on('new-message', function(data) {
      io.to(socket.room).emit('new-message', data);
    });

    socket.on('disconnect', function() {
      socket.leave(socket.room);
    });
  })
}

