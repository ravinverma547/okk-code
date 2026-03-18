const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { authSchema } = require('../validators/schemas');

router.post('/register', validate(authSchema.register), registerUser);
router.post('/login', validate(authSchema.login), loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
