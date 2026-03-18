const logger = require('../utils/logger');

const initSockets = (io) => {
    io.on('connection', (socket) => {
        logger.info(`New Client Connected: ${socket.id}`);

        socket.on('disconnect', () => {
            logger.info('Client Disconnected');
        });
    });

    logger.info('Socket.io Listeners Initialized');
};

module.exports = initSockets;
