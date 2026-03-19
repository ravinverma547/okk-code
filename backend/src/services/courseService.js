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

    async getCourseById(id) {
        return await courseRepository.findById(id);
    }

    async enrollStudent(courseId, studentId) {
        try {
            const course = await courseRepository.addStudentToCourse(courseId, studentId);
            await studentRepository.update(studentId, { $addToSet: { courses: courseId } });
            
            logger.info(`Student ${studentId} enrolled in course ${courseId}`);
            return course;
        } catch (error) {
            logger.error(`Enrollment failed for student ${studentId} in course ${courseId}`, error);
            throw error;
        }
    }

    async updateCourse(id, updateData) {
        return await courseRepository.update(id, updateData);
    }

    async deleteCourse(id) {
        return await courseRepository.delete(id);
    }
}

module.exports = new CourseService();
