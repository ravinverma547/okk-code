const courseService = require('../services/courseService');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Create a new course
 */
const createCourse = asyncHandler(async (req, res) => {
    const course = await courseService.createCourse(req.body);
    sendResponse(res, 201, 'Course created successfully', course);
});

/**
 * @desc    Get all courses
 */
const getCourses = asyncHandler(async (req, res) => {
    const courses = await courseService.getAllCourses();
    sendResponse(res, 200, 'Courses retrieved', courses);
});

/**
 * @desc    Enroll student in course
 */
const enrollStudent = asyncHandler(async (req, res) => {
    const { courseId, studentId } = req.body;
    const course = await courseService.enrollStudent(courseId, studentId);
    
    // Emit event
    const io = req.app.get('io');
    io.emit('course_enrolled', { courseId, studentId });

    sendResponse(res, 200, 'Student enrolled successfully', course);
});

/**
 * @desc    Update course
 */
const updateCourse = asyncHandler(async (req, res) => {
    const course = await courseService.updateCourse(req.params.id, req.body);
    sendResponse(res, 200, 'Course updated successfully', course);
});

/**
 * @desc    Delete course
 */
const deleteCourse = asyncHandler(async (req, res) => {
    await courseService.deleteCourse(req.params.id);
    sendResponse(res, 200, 'Course deleted successfully');
});

module.exports = { createCourse, getCourses, enrollStudent, updateCourse, deleteCourse };
