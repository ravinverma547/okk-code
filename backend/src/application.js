const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const feeRoutes = require('./routes/feeRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const enrollmentRequestRoutes = require('./routes/enrollmentRequestRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();

// Request Logger (Debug Logs)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
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
app.use('/api/v1/attendance', attendanceRoutes);

// Test Route
app.get('/api/v1/test', (req, res) => {
    res.status(200).json({ success: true, message: 'Test API is working properly in production' });
});

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'SMS Backend is running' });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
