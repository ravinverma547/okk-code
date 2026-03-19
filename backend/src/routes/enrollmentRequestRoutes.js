const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/enrollmentRequestController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', authorize('STUDENT'), createRequest);
router.get('/', authorize('ADMIN', 'STUDENT', 'TEACHER'), getRequests);
router.patch('/:id/status', authorize('ADMIN'), updateRequestStatus);

module.exports = router;
