const courseRepository = require('../repositories/courseRepository');
const studentRepository = require('../repositories/studentRepository');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

class CourseService {
    async createCourse(courseData) {
        const course = await courseRepository.create(courseData);
        logger.info(`Course created: ${course.title}`);
        return course;
    }

    async getAllCourses() {
        return await courseRepository.findAll();
    }

    async enrollStudent(courseId, studentId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const course = await courseRepository.addStudentToCourse(courseId, studentId, { session });
            await studentRepository.update(studentId, { $addToSet: { courses: courseId } }, { session });
            
            await session.commitTransaction();
            logger.info(`Student ${studentId} enrolled in course ${courseId}`);
            return course;
        } catch (error) {
            await session.abortTransaction();
            logger.error(`Enrollment failed for student ${studentId} in course ${courseId}`, error);
            throw error;
        } finally {
            session.endSession();
        }
    }
}

module.exports = new CourseService();
