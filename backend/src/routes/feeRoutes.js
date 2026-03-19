const express = require('express');
const router = express.Router();
const { createFee, getStudentFees, payFee, getAllFees, updateFeeStatus } = require('../controllers/feeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/all', authorize('ADMIN'), getAllFees);
router.post('/', authorize('ADMIN'), createFee);
router.get('/student/:studentId', getStudentFees);
router.put('/:id/pay', authorize('ADMIN'), payFee);
router.put('/:id/status', authorize('ADMIN'), updateFeeStatus);

module.exports = router;
