const mongoose = require('mongoose');
const studentRepository = require('../repositories/studentRepository');
const userRepository = require('../repositories/userRepository');
const logger = require('../utils/logger');
const User = require('../models/User');

class StudentService {
    async registerStudent(data) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const userExists = await userRepository.findByEmail(data.email);
            if (userExists) throw new Error('User email already exists');

            // 1. Create User
            const userArray = await userRepository.createWithSession({
                name: data.name,
                email: data.email,
                password: data.password,
                role: 'STUDENT'
            }, session);
            const user = userArray[0];

            // 2. Create Student Profile
            const studentArray = await studentRepository.createWithSession({
                user: user._id,
                studentId: data.studentId,
                courses: data.courses || []
            }, session);
            const student = studentArray[0];

            // 3. Link back student profile to user (optional but good for performance)
            await User.findByIdAndUpdate(user._id, { studentProfile: student._id }, { session });

            await session.commitTransaction();
            logger.info(`Student registered successfully: ${user.email}`, { studentId: student.studentId });
            
            return { user, student };
        } catch (error) {
            await session.abortTransaction();
            logger.error(`Failed to register student: ${data.email}`, error);
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getAllStudents(query) {
        const { page = 1, limit = 10, search, course, status, minAttendance } = query;
        const filters = {};

        if (course) filters.courses = new mongoose.Types.ObjectId(course);
        if (status) filters.status = status;
        if (minAttendance) filters.attendancePercentage = { $gte: Number(minAttendance) };

        return await studentRepository.findAll(filters, { 
            page: Number(page), 
            limit: Number(limit),
            search 
        });
    }

    async getStudentById(id) {
        const student = await studentRepository.findById(id);
        if (!student) throw new Error('Student not found');
        return student;
    }

    async updateStudent(id, updateData) {
        const student = await studentRepository.update(id, updateData);
        // Trigger At-Risk check
        await this.checkAtRiskStatus(id);
        return student;
    }

    async checkAtRiskStatus(studentId) {
        const student = await studentRepository.findById(studentId);
        if (student.attendancePercentage < 75 && student.performanceScore < 40) {
            if (student.status !== 'AT_RISK') {
                await studentRepository.update(studentId, { status: 'AT_RISK' });
                logger.warn(`Student ${studentId} marked as AT_RISK`);
                // Emit socket event could be here if io was passed, but better in controller
            }
        } else if (student.status === 'AT_RISK') {
            await studentRepository.update(studentId, { status: 'ACTIVE' });
        }
    }
}

module.exports = new StudentService();
