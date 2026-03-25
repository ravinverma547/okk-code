const LeaveRequest = require('../models/LeaveRequest');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Apply for leave
 * @route   POST /api/v1/leave-requests
 * @access  Private (Student)
 */
const applyLeave = asyncHandler(async (req, res) => {
    const { startDate, endDate, reason } = req.body;

    const leaveRequest = await LeaveRequest.create({
        student: req.user._id,
        studentProfile: req.user.studentProfile._id || req.user.studentProfile,
        startDate,
        endDate,
        reason
    });

    sendResponse(res, 201, 'Leave application submitted successfully', leaveRequest);
});

/**
 * @desc    Get all leave requests (Admin/Teacher) or own requests (Student)
 * @route   GET /api/v1/leave-requests
 * @access  Private
 */
const getLeaveRequests = asyncHandler(async (req, res) => {
    let query = {};
    if (req.user.role === 'STUDENT') {
        query.student = req.user._id;
    }

    const requests = await LeaveRequest.find(query)
        .populate('student', 'name email')
        .sort('-createdAt');

    sendResponse(res, 200, 'Leave requests retrieved successfully', requests);
});

/**
 * @desc    Update leave request status
 * @route   PATCH /api/v1/leave-requests/:id/status
 * @access  Private (Admin/Teacher)
 */
const updateLeaveStatus = asyncHandler(async (req, res) => {
    const { status, adminRemarks } = req.body;
    const leaveRequest = await LeaveRequest.findById(req.params.id);

    if (!leaveRequest) {
        res.status(404);
        throw new Error('Leave request not found');
    }

    leaveRequest.status = status;
    if (adminRemarks) leaveRequest.adminRemarks = adminRemarks;

    await leaveRequest.save();
    sendResponse(res, 200, `Leave request ${status.toLowerCase()} successfully`, leaveRequest);
});

module.exports = {
    applyLeave,
    getLeaveRequests,
    updateLeaveStatus
};
