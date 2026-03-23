const performanceService = require('../services/performanceService');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

const addPerformance = asyncHandler(async (req, res) => {
    const record = await performanceService.addRecord(req.body);
    sendResponse(res, 201, 'Performance record added successfully', record);
});

const getStudentPerformance = asyncHandler(async (req, res) => {
    const records = await performanceService.getStudentPerformance(req.params.studentId);
    sendResponse(res, 200, 'Student performance retrieved', records);
});

const getAllPerformance = asyncHandler(async (req, res) => {
    const records = await performanceService.getAllPerformance();
    sendResponse(res, 200, 'All performance records retrieved', records);
});

module.exports = { addPerformance, getStudentPerformance, getAllPerformance };
