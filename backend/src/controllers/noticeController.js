const Notice = require('../models/Notice');
const asyncHandler = require('express-async-handler');

// @desc    Get all active notices
// @route   GET /api/notices
// @access  Private
const getNotices = asyncHandler(async (req, res) => {
    let query = { isActive: true };
    
    // Students should only see notices for ALL or STUDENT
    if (req.user.role === 'STUDENT') {
        query.audience = { $in: ['ALL', 'STUDENT'] };
    }

    const notices = await Notice.find(query).sort({ createdAt: -1 }).populate('createdBy', 'name');
    res.json(notices);
});

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Private
const getNoticeById = asyncHandler(async (req, res) => {
    const notice = await Notice.findById(req.params.id).populate('createdBy', 'name');
    if (notice) {
        res.json(notice);
    } else {
        res.status(404);
        throw new Error('Notice not found');
    }
});

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private/Admin
const createNotice = asyncHandler(async (req, res) => {
    const { title, content, audience, expiryDate } = req.body;

    const notice = await Notice.create({
        title,
        content,
        audience,
        expiryDate,
        createdBy: req.user._id
    });

    if (notice) {
        res.status(201).json(notice);
    } else {
        res.status(400);
        throw new Error('Invalid notice data');
    }
});

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private/Admin
const updateNotice = asyncHandler(async (req, res) => {
    const notice = await Notice.findById(req.params.id);

    if (notice) {
        notice.title = req.body.title || notice.title;
        notice.content = req.body.content || notice.content;
        notice.audience = req.body.audience || notice.audience;
        notice.expiryDate = req.body.expiryDate || notice.expiryDate;
        notice.isActive = req.body.isActive !== undefined ? req.body.isActive : notice.isActive;

        const updatedNotice = await notice.save();
        res.json(updatedNotice);
    } else {
        res.status(404);
        throw new Error('Notice not found');
    }
});

// @desc    Delete/Deactivate a notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
const deleteNotice = asyncHandler(async (req, res) => {
    const notice = await Notice.findById(req.params.id);

    if (notice) {
        // Soft delete for safety, or hard delete if preferred. Let's do hard delete for now.
        await Notice.deleteOne({ _id: notice._id });
        res.json({ message: 'Notice removed' });
    } else {
        res.status(404);
        throw new Error('Notice not found');
    }
});

module.exports = {
    getNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice
};
