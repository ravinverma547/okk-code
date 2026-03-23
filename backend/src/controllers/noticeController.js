const Notice = require('../models/Notice');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

const getNotices = asyncHandler(async (req, res) => {
    const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
    sendResponse(res, 200, 'Notices retrieved successfully', notices);
});

const getNoticeById = asyncHandler(async (req, res) => {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
        res.status(404);
        throw new Error('Notice not found');
    }
    sendResponse(res, 200, 'Notice retrieved successfully', notice);
});

const createNotice = asyncHandler(async (req, res) => {
    const data = { ...req.body, createdBy: req.user._id };
    const notice = await Notice.create(data);
    sendResponse(res, 201, 'Notice created successfully', notice);
});

const updateNotice = asyncHandler(async (req, res) => {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendResponse(res, 200, 'Notice updated successfully', notice);
});

const deleteNotice = asyncHandler(async (req, res) => {
    await Notice.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, 'Notice deleted successfully');
});

module.exports = {
    getNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice
};
