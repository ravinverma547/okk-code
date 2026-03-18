const express = require('express');
const router = express.Router();
const { registerStudent, getStudents, getStudentById } = require('../controllers/studentController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { studentSchema } = require('../validators/schemas');

router.post('/register', protect, authorize('ADMIN'), validate(studentSchema.register), registerStudent);

router.route('/')
    .get(protect, authorize('ADMIN'), getStudents);

router.route('/:id')
    .get(protect, getStudentById);

module.exports = router;
