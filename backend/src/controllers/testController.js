const testService = require('../services/testService');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Create a new test
 */
const createTest = asyncHandler(async (req, res) => {
    const test = await testService.createTest(req.body);
    
    // Emit event
    const io = req.app.get('io');
    io.emit('new_test', { title: test.title });

    sendResponse(res, 201, 'Test created successfully', test);
});

/**
 * @desc    Submit test result for a student
 */
const submitResult = asyncHandler(async (req, res) => {
    const { testId, studentId, marks } = req.body;
    const test = await testService.submitResult(testId, studentId, marks);
    
    sendResponse(res, 200, 'Result submitted successfully', test);
});

/**
 * @desc    Get top performing students
 */
const getLeaderboard = asyncHandler(async (req, res) => {
    const leaderboard = await testService.getLeaderboard();
    
    // Emit event (optional, maybe on update)
    const io = req.app.get('io');
    io.emit('leaderboard_updated', leaderboard.slice(0, 3));

    sendResponse(res, 200, 'Leaderboard retrieved', leaderboard);
});

module.exports = { createTest, submitResult, getLeaderboard };
