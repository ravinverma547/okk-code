const express = require('express');
const router = express.Router();
const { markAttendance, getAttendanceHistory } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('ADMIN', 'TEACHER'), markAttendance);
router.get('/student/:studentId', protect, getAttendanceHistory);

module.exports = router;
