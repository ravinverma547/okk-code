const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
const connectDB = require('./src/config/db');
require('./src/config/env');
const socketIO = require('./src/sockets/socketHandler');
require('./src/cron/jobs');

const { errorHandler, notFound } = require('./src/middlewares/errorMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const feeRoutes = require('./src/routes/feeRoutes');
const performanceRoutes = require('./src/routes/performanceRoutes');
const noticeRoutes = require('./src/routes/noticeRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const teacherRoutes = require('./src/routes/teacherRoutes');
const enrollmentRequestRoutes = require('./src/routes/enrollmentRequestRoutes');

const app = express();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/fees', feeRoutes);
app.use('/api/v1/performance', performanceRoutes);
app.use('/api/v1/notices', noticeRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/course-requests', enrollmentRequestRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'SMS Backend is running' });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

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

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
});
