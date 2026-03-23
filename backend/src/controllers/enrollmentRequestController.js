const enrollmentRequestService = require('../services/enrollmentRequestService');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Create enrollment request
 */
const createRequest = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    if (!req.user.studentProfile) {
        res.status(400);
        throw new Error('Student profile not found. Please complete your profile first.');
    }
    const studentId = req.user.studentProfile._id || req.user.studentProfile;
    const request = await enrollmentRequestService.createRequest(studentId, courseId);
    sendResponse(res, 201, 'Request submitted successfully', request);
});

/**
 * @desc    Get all enrollment requests
 */
const getRequests = asyncHandler(async (req, res) => {
    let filters = {};
    if (req.user.role === 'STUDENT') {
        if (!req.user.studentProfile) {
            return sendResponse(res, 200, 'No requests found (No profile)', []);
        }
        const studentId = req.user.studentProfile?._id || req.user.studentProfile;
        filters = { student: studentId };
    }
    const requests = await enrollmentRequestService.getAllRequests(filters);
    sendResponse(res, 200, 'Requests retrieved', requests);
});

/**
 * @desc    Update request status (Accept/Reject)
 */
const updateRequestStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const request = await enrollmentRequestService.updateRequestStatus(req.params.id, status);
    sendResponse(res, 200, `Request ${status.toLowerCase()} successfully`, request);
});

module.exports = { createRequest, getRequests, updateRequestStatus };
