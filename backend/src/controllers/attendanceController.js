const attendanceService = require('../services/attendanceService');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Mark attendance for a student
 */
const markAttendance = asyncHandler(async (req, res) => {
    const { studentId, date, status } = req.body;
    const attendance = await attendanceService.markAttendance(studentId, date, status);
    
    // Emit event
    const io = req.app.get('io');
    io.emit('attendance_marked', { studentId, status });

    sendResponse(res, 200, 'Attendance marked successfully', attendance);
});

/**
 * @desc    Get attendance history for a student
 */
const getAttendanceHistory = asyncHandler(async (req, res) => {
    const history = await attendanceService.getStudentAttendance(req.params.studentId);
    sendResponse(res, 200, 'Attendance history retrieved', history);
});

module.exports = { markAttendance, getAttendanceHistory };
