const attendanceService = require('../services/attendanceService');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Mark attendance for a student
 * @route   POST /api/v1/attendance
 * @access  Private/Admin/Teacher
 */
const markAttendance = asyncHandler(async (req, res) => {
    const { studentId, date, status } = req.body;
    const result = await attendanceService.markAttendance(studentId, date, status);
    sendResponse(res, 201, 'Attendance marked successfully', result);
});

/**
 * @desc    Get attendance history for a student
 * @route   GET /api/v1/attendance/student/:studentId
 * @access  Private
 */
const getAttendanceHistory = asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const result = await attendanceService.getStudentAttendance(studentId);
    sendResponse(res, 200, 'Attendance history retrieved successfully', result);
});

module.exports = { markAttendance, getAttendanceHistory };
