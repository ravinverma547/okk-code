const express = require('express');
const router = express.Router();
const { createFee, getStudentFees, payFee } = require('../controllers/feeController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('ADMIN'), createFee);
router.get('/student/:studentId', protect, getStudentFees);
router.put('/:id/pay', protect, authorize('ADMIN'), payFee);

module.exports = router;
