const express = require('express');
const router = express.Router();
const { createTest, submitResult, getLeaderboard } = require('../controllers/testController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/', protect, authorize('ADMIN'), createTest);
router.post('/submit', protect, authorize('ADMIN'), submitResult);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
