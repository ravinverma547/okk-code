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

module.exports = { registerUser, loginUser, getUserProfile };
