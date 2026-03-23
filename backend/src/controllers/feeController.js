const feeService = require('../services/feeService');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Create a new fee record
 */
const createFee = asyncHandler(async (req, res) => {
    const fee = await feeService.createFee(req.body);
    sendResponse(res, 201, 'Fee record created', fee);
});

/**
 * @desc    Get fees for a specific student
 */
const getStudentFees = asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    
    // Authorization check: Student can only see their own fees
    const studentProfileId = req.user.studentProfile?._id || req.user.studentProfile;
    if (req.user.role === 'STUDENT' && studentProfileId?.toString() !== studentId) {
        res.status(403);
        throw new Error('Not authorized to view these fees');
    }

    const fees = await feeService.getStudentFees(studentId);
    sendResponse(res, 200, 'Fees retrieved', fees);
});

/**
 * @desc    Process fee payment
 */
const payFee = asyncHandler(async (req, res) => {
    const { transactionId, amount } = req.body;
    const fee = await feeService.recordPayment(req.params.id, amount, transactionId);
    
    // Emit event
    const io = req.app.get('io');
    io.emit('fee_paid', { feeId: fee._id, amount: amount || fee.totalAmount });

    sendResponse(res, 200, 'Payment successful', fee);
});

/**
 * @desc    Update fee status manually
 */
const updateFeeStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const fee = await feeService.updateStatus(req.params.id, status);
    sendResponse(res, 200, 'Fee status updated', fee);
});

/**
 * @desc    Get all fee records
 * @route   GET /api/v1/fees/all
 * @access  Private/Admin
 */
const getAllFees = asyncHandler(async (req, res) => {
    const fees = await feeService.getAllFees();
    sendResponse(res, 200, 'All fees retrieved', fees);
});

module.exports = { createFee, getStudentFees, payFee, getAllFees, updateFeeStatus };
