const { Server } = require('socket.io');
const initSockets = require('./socketHandler');

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    initSockets(io);
    return io;
};
