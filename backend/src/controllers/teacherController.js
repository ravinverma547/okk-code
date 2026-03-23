const teacherService = require('../services/teacherService');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

const registerTeacher = asyncHandler(async (req, res) => {
    const result = await teacherService.registerTeacher(req.body);
    sendResponse(res, 201, 'Teacher registered successfully', result);
});

const getTeachers = asyncHandler(async (req, res) => {
    const teachers = await teacherService.getAllTeachers(req.query);
    sendResponse(res, 200, 'Teachers retrieved successfully', teachers);
});

const getTeacherById = asyncHandler(async (req, res) => {
    const teacher = await teacherService.getTeacherById(req.params.id);
    sendResponse(res, 200, 'Teacher profile retrieved', teacher);
});

const getMyTeacherProfile = asyncHandler(async (req, res) => {
    const teacher = await teacherService.getTeacherByUserId(req.user._id);
    sendResponse(res, 200, 'Profile retrieved', teacher);
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
