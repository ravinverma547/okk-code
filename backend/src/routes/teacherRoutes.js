const express = require('express');
const router = express.Router();
const {
    registerTeacher,
    getTeachers,
    getTeacherById,
    getMyTeacherProfile,
    updateTeacher,
    assignCourse,
    removeCourse
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

// My Profile (Teacher specific)
router.get('/profile/me', authorize('TEACHER'), getMyTeacherProfile);

// Admin Only Routes
router.post('/register', authorize('ADMIN'), registerTeacher);
router.get('/', authorize('ADMIN'), getTeachers);
router.post('/assign-course', authorize('ADMIN'), assignCourse);
router.post('/remove-course', authorize('ADMIN'), removeCourse);

router.route('/:id')
    .get(authorize('ADMIN', 'TEACHER'), getTeacherById)
    .put(authorize('ADMIN'), updateTeacher);

module.exports = router;
