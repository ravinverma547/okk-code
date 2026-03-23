const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Initialize Express App
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);

// API Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const feeRoutes = require('./routes/feeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const testRoutes = require('./routes/testRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const enrollmentRequestRoutes = require('./routes/enrollmentRequestRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/fees', feeRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/tests', testRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/performance', performanceRoutes);
app.use('/api/v1/notices', noticeRoutes);
app.use('/api/v1/enrollment-requests', enrollmentRequestRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'SMS Backend is running' });
});

// Error Handling
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

module.exports = app;
