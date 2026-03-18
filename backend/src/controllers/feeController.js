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
    const fees = await feeService.getStudentFees(req.params.studentId);
    sendResponse(res, 200, 'Fees retrieved', fees);
});

/**
 * @desc    Process fee payment
 */
const payFee = asyncHandler(async (req, res) => {
    const { transactionId } = req.body;
    const fee = await feeService.markAsPaid(req.params.id, transactionId);
    
    // Emit event
    const io = req.app.get('io');
    io.emit('fee_paid', { feeId: fee._id, amount: fee.amount });

    sendResponse(res, 200, 'Payment successful', fee);
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

module.exports = { createFee, getStudentFees, payFee, getAllFees };
