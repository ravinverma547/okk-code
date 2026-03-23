const authService = require('../services/authService');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    
    const adminCount = await User.countDocuments({ role: 'ADMIN' });
    
    if (adminCount === 0) {
        req.body.role = 'ADMIN';
    } else if (!req.user || req.user.role !== 'ADMIN') {
        res.status(403);
        throw new Error('Only admins can register new users');
    }

    const user = await authService.registerUser(req.body);
    sendResponse(res, 201, 'User registered successfully', user);
});

/**
 * @desc    Register a new student (Public)
 * @route   POST /api/v1/auth/register/student
 * @access  Public
 */
const registerStudentPublic = asyncHandler(async (req, res) => {
    const studentService = require('../services/studentService');
    const generateToken = require('../utils/generateToken');
    
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        studentId: `STU${Date.now().toString().slice(-6)}`,
        courses: []
    };
    
    const result = await studentService.registerStudent(data);
    const token = generateToken(result.user._id);
    
    sendResponse(res, 201, 'Student registered successfully', {
        _id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        studentProfile: result.student._id,
        token
    });
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

/**
 * @desc    Create a new admin (Admin only)
 * @route   POST /api/v1/auth/admins
 * @access  Private/Admin
 */
const createAdmin = asyncHandler(async (req, res) => {
    const adminData = { ...req.body, role: 'ADMIN' };
    const admin = await authService.registerUser(adminData);
    sendResponse(res, 201, 'New Admin created successfully', admin);
});

/**
 * @desc    Get all admins
 * @route   GET /api/v1/auth/admins
 * @access  Private/Admin
 */
const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await require('../models/User').find({ role: 'ADMIN' }).select('-password');
    sendResponse(res, 200, 'Admins retrieved successfully', admins);
});

/**
 * @desc    Promote a user to Admin
 * @route   PUT /api/v1/auth/promote/:userId
 * @access  Private/Admin
 */
const promoteToAdmin = asyncHandler(async (req, res) => {
    const User = require('../models/User');
    const user = await User.findById(req.params.userId);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.role === 'ADMIN') {
        res.status(400);
        throw new Error('User is already an Admin');
    }

    user.role = 'ADMIN';
    await user.save();

    sendResponse(res, 200, 'User promoted to Admin successfully', {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    });
});

module.exports = { registerUser, registerStudentPublic, loginUser, getUserProfile, createAdmin, getAllAdmins, promoteToAdmin };
