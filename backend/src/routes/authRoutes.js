const express = require('express');
const router = express.Router();
const { registerUser, registerStudentPublic, loginUser, getUserProfile, createAdmin, getAllAdmins, promoteToAdmin } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { authSchema } = require('../validators/schemas');

router.post('/register', protect, authorize('ADMIN'), validate(authSchema.register), registerUser);
router.post('/register/student', validate(authSchema.register), registerStudentPublic);
router.post('/login', validate(authSchema.login), loginUser);
router.get('/profile', protect, getUserProfile);

// Admin Management (Restricted)
router.post('/admins', protect, authorize('ADMIN'), validate(authSchema.register), createAdmin);
router.get('/admins', protect, authorize('ADMIN'), getAllAdmins);
router.put('/promote/:userId', protect, authorize('ADMIN'), promoteToAdmin);

module.exports = router;
