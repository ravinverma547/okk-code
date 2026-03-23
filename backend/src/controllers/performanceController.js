const performanceService = require('../services/performanceService');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Add a student performance record
 * @route   POST /api/v1/performance
 * @access  Private/Admin
 */
const addPerformance = asyncHandler(async (req, res) => {
    const record = await performanceService.addRecord(req.body);
    sendResponse(res, 201, 'Performance record added', record);
});

/**
 * @desc    Get performance history for a student
 * @route   GET /api/v1/performance/student/:studentId
 * @access  Private
 */
const getStudentPerformance = asyncHandler(async (req, res) => {
    const records = await performanceService.getStudentPerformance(req.params.studentId);
    sendResponse(res, 200, 'Student performance history retrieved', records);
});

/**
 * @desc    Get all performance records for analytics
 * @route   GET /api/v1/performance
 * @access  Private/Admin
 */
const getAllPerformance = asyncHandler(async (req, res) => {
    const records = await performanceService.getAllPerformance();
    sendResponse(res, 200, 'All performance records retrieved', records);
});

module.exports = { addPerformance, getStudentPerformance, getAllPerformance };
