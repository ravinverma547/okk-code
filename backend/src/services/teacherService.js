const teacherRepository = require('../repositories/teacherRepository');
const userRepository = require('../repositories/userRepository');
const mongoose = require('mongoose');

class TeacherService {
    async registerTeacher(teacherData) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const { name, email, password, ...profileData } = teacherData;

            // Create User
            const user = await userRepository.create({
                name,
                email,
                password,
                role: 'TEACHER'
            }, { session });

            // Create Teacher Profile
            const teacher = await teacherRepository.create({
                user: user._id,
                teacherId: profileData.teacherId || `TCH${Date.now().toString().slice(-6)}`,
                ...profileData
            }, session);

            // Update User with Profile Ref
            await require('../models/User').findByIdAndUpdate(user._id, { teacherProfile: teacher[0]._id }, { session });

            await session.commitTransaction();
            return { user: user, teacher: teacher[0] };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getAllTeachers(query) {
        const { page, limit, search, status } = query;
        const filters = {};
        if (status) filters.status = status;

        return await teacherRepository.findAll(filters, { page, limit, search });
    }

    async getTeacherById(id) {
        return await teacherRepository.findById(id);
    }

    async getTeacherByUserId(userId) {
        return await teacherRepository.findByUserId(userId);
    }

    async updateTeacher(id, updateData) {
        return await teacherRepository.update(id, updateData);
    }

    async assignCourse(teacherId, courseId) {
        return await teacherRepository.update(teacherId, {
            $addToSet: { assignedCourses: courseId }
        });
    }

    async removeCourse(teacherId, courseId) {
        return await teacherRepository.update(teacherId, {
            $pull: { assignedCourses: courseId }
        });
    }
}

module.exports = new TeacherService();
