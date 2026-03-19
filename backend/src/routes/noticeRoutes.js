const express = require('express');
const router = express.Router();
const {
    getNotices,
    getNoticeById,
    createNotice,
    updateNotice,
    deleteNotice
} = require('../controllers/noticeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getNotices)
    .post(protect, authorize('ADMIN'), createNotice);

router.route('/:id')
    .get(protect, getNoticeById)
    .put(protect, authorize('ADMIN'), updateNotice)
    .delete(protect, authorize('ADMIN'), deleteNotice);

module.exports = router;
