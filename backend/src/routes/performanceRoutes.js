const express = require('express');
const router = express.Router();
const { addPerformance, getStudentPerformance, getAllPerformance } = require('../controllers/performanceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', authorize('ADMIN', 'TEACHER'), addPerformance);
router.get('/student/:studentId', getStudentPerformance);
router.get('/', authorize('ADMIN', 'TEACHER'), getAllPerformance);

module.exports = router;
