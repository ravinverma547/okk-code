const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000
});
app.use('/api/', limiter);

// Socket.io injection
app.set('io', io);

const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const feeRoutes = require('./routes/feeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const testRoutes = require('./routes/testRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const enrollmentRequestRoutes = require('./routes/enrollmentRequestRoutes');
const initSockets = require('./sockets/socketHandler');
const initCronJobs = require('./cron/jobs');

// Initialize Sockets
initSockets(io);

// Initialize Cron Jobs
initCronJobs(io);

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/fees', feeRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/tests', testRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/performance', performanceRoutes);
app.use('/api/v1/notices', noticeRoutes);
app.use('/api/v1/course-requests', enrollmentRequestRoutes);

// Health Check
app.get('/health', (req, res) => {
    require('./utils/apiResponse')(res, 200, 'SMS Backend is running');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = { app, httpServer, io };
