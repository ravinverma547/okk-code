const Course = require('../models/Course');

class CourseRepository {
    async create(courseData) {
        return await Course.create(courseData);
    }

    async findById(id) {
        return await Course.findById(id).populate('students');
    }

    async findAll() {
        return await Course.find();
    }

    async addStudentToCourse(courseId, studentId, options = {}) {
        return await Course.findByIdAndUpdate(
            courseId,
            { $addToSet: { students: studentId } },
            { new: true, ...options }
        );
    }

    async update(id, updateData) {
        return await Course.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await Course.findByIdAndDelete(id);
    }
}

module.exports = new CourseRepository();
