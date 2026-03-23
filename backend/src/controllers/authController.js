const authService = require('../services/authService');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const user = await authService.registerUser(req.body);
    sendResponse(res, 201, 'User registered successfully', user);
});

/**
 * @desc    Auth user & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    sendResponse(res, 200, 'Login successful', user);
});

/**
 * @desc    Get user profile
 * @route   GET /api/v1/auth/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await authService.getUserProfile(req.user._id);
    sendResponse(res, 200, 'Profile retrieved', user);
});

const registerStudentPublic = asyncHandler(async (req, res) => {
    const user = await authService.registerStudentPublic(req.body);
    sendResponse(res, 201, 'Student registered successfully', user);
});

const createAdmin = asyncHandler(async (req, res) => {
    const user = await authService.createAdmin(req.body);
    sendResponse(res, 201, 'Admin created successfully', user);
});

const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await authService.getAllAdmins();
    sendResponse(res, 200, 'Admins retrieved successfully', admins);
});

const promoteToAdmin = asyncHandler(async (req, res) => {
    const user = await authService.promoteToAdmin(req.params.userId);
    sendResponse(res, 200, 'User promoted to ADMIN', user);
});

module.exports = { registerUser, loginUser, getUserProfile, registerStudentPublic, createAdmin, getAllAdmins, promoteToAdmin };
