const enrollmentRequestService = require('../services/enrollmentRequestService');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

const createRequest = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    const studentId = req.user.studentProfile;
    if (!studentId) {
        res.status(400);
        throw new Error('User does not have a student profile');
    }
    const request = await enrollmentRequestService.createRequest(studentId, courseId);
    sendResponse(res, 201, 'Enrollment request created', request);
});

const getRequests = asyncHandler(async (req, res) => {
    const filters = {};
    if (req.user.role === 'STUDENT') {
        filters.student = req.user.studentProfile;
    }
    const requests = await enrollmentRequestService.getAllRequests(filters);
    sendResponse(res, 200, 'Enrollment requests retrieved', requests);
});

const updateRequestStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const request = await enrollmentRequestService.updateRequestStatus(req.params.id, status);
    sendResponse(res, 200, `Request ${status.toLowerCase()} successfully`, request);
});

module.exports = { createRequest, getRequests, updateRequestStatus };
