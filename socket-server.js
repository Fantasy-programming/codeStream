'use strict';

const socketIO = require('socket.io');

module.exports = function (server) {
    const io = socketIO(server);
    io.on('connection', function (socket) {
        socket.on('joinRoom', function (data) {
            socket.room = data.room;
            socket.join(data.room);
        });
        socket.on('new-message', function (data) {
            io.to(socket.room).emit('new-message', data);
        });

        socket.on('disconnect', function () {
            socket.leave(socket.room);
        });
    });
};