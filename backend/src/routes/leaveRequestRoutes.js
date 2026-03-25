const express = require('express');
const router = express.Router();
const { 
    applyLeave, 
    getLeaveRequests, 
    updateLeaveStatus 
} = require('../controllers/leaveRequestController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', authorize('STUDENT'), applyLeave);
router.get('/', getLeaveRequests);
router.patch('/:id/status', authorize('ADMIN', 'TEACHER'), updateLeaveStatus);

module.exports = router;
