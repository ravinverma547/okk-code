const mongoose = require('mongoose');
const Student = require('../models/Student');

class StudentRepository {
    async create(studentData) {
        return await Student.create(studentData);
    }

    async findById(id) {
        return await Student.findById(id).populate('user', '-password').populate('courses');
    }

    async findAll(filters = {}, options = {}) {
        const { page = 1, limit = 10, search } = options;
        const skip = (page - 1) * limit;
        
        let query = { ...filters };
        
        if (search) {
            const User = mongoose.model('User');
            // Find users matching search
            const matchingUsers = await User.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');
            const userIds = matchingUsers.map(u => u._id);

            query.$or = [
                { studentId: { $regex: search, $options: 'i' } },
                { user: { $in: userIds } }
            ];
        }

        const students = await Student.find(query)
            .populate('user', '-password')
            .populate('courses')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Student.countDocuments(query);
        
        return { students, total, page, pages: Math.ceil(total / limit) };
    }

    async createWithSession(studentData, session) {
        return await Student.create([studentData], { session });
    }

    async update(id, updateData, options = {}) {
        return await Student.findByIdAndUpdate(id, updateData, { new: true, ...options }).populate('user', '-password');
    }

    async delete(id) {
        return await Student.findByIdAndDelete(id);
    }
}

module.exports = new StudentRepository();
