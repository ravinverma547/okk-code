const Teacher = require('../models/Teacher');
const User = require('../models/User');

class TeacherRepository {
    async findAll(filters = {}, options = {}) {
        const { page = 1, limit = 10, search } = options;
        const skip = (page - 1) * limit;

        let query = { ...filters };

        if (search) {
            const matchingUsers = await User.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');
            const userIds = matchingUsers.map(u => u._id);

            query.$or = [
                { teacherId: { $regex: search, $options: 'i' } },
                { user: { $in: userIds } }
            ];
        }

        const teachers = await Teacher.find(query)
            .populate('user', '-password')
            .populate('assignedCourses')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Teacher.countDocuments(query);

        return { teachers, total, page, pages: Math.ceil(total / limit) };
    }

    async findById(id) {
        return await Teacher.findById(id)
            .populate('user', '-password')
            .populate('assignedCourses');
    }

    async findByUserId(userId) {
        return await Teacher.findOne({ user: userId })
            .populate('user', '-password')
            .populate('assignedCourses');
    }

    async create(teacherData, session = null) {
        if (session) {
            return await Teacher.create([teacherData], { session });
        }
        return await Teacher.create(teacherData);
    }

    async update(id, updateData) {
        return await Teacher.findByIdAndUpdate(id, updateData, { new: true })
            .populate('user', '-password')
            .populate('assignedCourses');
    }

    async delete(id) {
        return await Teacher.findByIdAndDelete(id);
    }
}

module.exports = new TeacherRepository();
