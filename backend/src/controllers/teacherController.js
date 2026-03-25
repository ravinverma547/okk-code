const teacherService = require('../services/teacherService');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

const registerTeacher = asyncHandler(async (req, res) => {
    const teacher = await teacherService.registerTeacher(req.body);
    sendResponse(res, 201, 'Teacher registered successfully', teacher);
});

const getTeachers = asyncHandler(async (req, res) => {
    const result = await teacherService.getAllTeachers(req.query);
    sendResponse(res, 200, 'Teachers retrieved successfully', result);
});

const getTeacherById = asyncHandler(async (req, res) => {
    const teacher = await teacherService.getTeacherById(req.params.id);
    if (!teacher) {
        res.status(404);
        throw new Error('Teacher not found');
    }
    sendResponse(res, 200, 'Teacher retrieved successfully', teacher);
});

const getMyTeacherProfile = asyncHandler(async (req, res) => {
    const teacher = await teacherService.getTeacherByUserId(req.user._id);
    if (!teacher) {
        res.status(404);
        throw new Error('Teacher profile not found');
    }

    // Calculate unique students across all assigned courses
    const Student = require('../models/Student');
    const courseIds = teacher.assignedCourses.map(c => c._id || c);
    const studentCount = await Student.countDocuments({ courses: { $in: courseIds } });

    const responseData = {
        ...teacher.toObject(),
        studentCount
    };

    sendResponse(res, 200, 'Teacher profile retrieved successfully', responseData);
});

const updateTeacher = asyncHandler(async (req, res) => {
    const teacher = await teacherService.updateTeacher(req.params.id, req.body);
    sendResponse(res, 200, 'Teacher updated successfully', teacher);
});

const assignCourse = asyncHandler(async (req, res) => {
    const { teacherId, courseId } = req.body;
    const teacher = await teacherService.assignCourse(teacherId, courseId);
    sendResponse(res, 200, 'Course assigned successfully', teacher);
});

const removeCourse = asyncHandler(async (req, res) => {
    const { teacherId, courseId } = req.body;
    const teacher = await teacherService.removeCourse(teacherId, courseId);
    sendResponse(res, 200, 'Course removed successfully', teacher);
});

module.exports = {
    registerTeacher,
    getTeachers,
    getTeacherById,
    getMyTeacherProfile,
    updateTeacher,
    assignCourse,
    removeCourse
};
