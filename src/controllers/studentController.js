const studentService = require('../services/studentService');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Register a new student (User + Profile)
 * @route   POST /api/v1/students/register
 * @access  Private/Admin
 */
const registerStudent = asyncHandler(async (req, res) => {
    const result = await studentService.registerStudent(req.body);
    
    // Emit real-time event
    const io = req.app.get('io');
    io.emit('new_student', { name: result.user.name, id: result.student.studentId });

    sendResponse(res, 201, 'Student registered successfully', result);
});

/**
 * @desc    Get all students (with Pagination & Search)
 * @route   GET /api/v1/students
 * @access  Private/Admin
 */
const getStudents = asyncHandler(async (req, res) => {
    const result = await studentService.getAllStudents(req.query);
    sendResponse(res, 200, 'Students retrieved successfully', result);
});

/**
 * @desc    Get student by ID
 * @route   GET /api/v1/students/:id
 * @access  Private
 */
const getStudentById = asyncHandler(async (req, res) => {
    const student = await studentService.getStudentById(req.params.id);
    sendResponse(res, 200, 'Student profile retrieved', student);
});

module.exports = { registerStudent, getStudents, getStudentById };
