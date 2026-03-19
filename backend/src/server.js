const app = require('./application.js');
const http = require('http');
const connectDB = require('./config/db');
require('./config/env');
const socketIO = require('./sockets');
require('./cron');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

const server = http.createServer(app);

// Socket.io initialization
const io = socketIO(server);
app.set('io', io);

server.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});
