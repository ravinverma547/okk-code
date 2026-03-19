const express = require('express');
const router = express.Router();
const { createCourse, getCourses, enrollStudent, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const { courseSchema } = require('../validators/schemas');

router.route('/')
    .post(protect, authorize('ADMIN'), validate(courseSchema.create), createCourse)
    .get(protect, getCourses);

router.route('/:id')
    .put(protect, authorize('ADMIN'), updateCourse)
    .delete(protect, authorize('ADMIN'), deleteCourse);

router.post('/enroll', protect, authorize('ADMIN'), enrollStudent);

module.exports = router;
