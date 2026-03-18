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
        
        const pipeline = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $match: filters
            }
        ];

        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { studentId: { $regex: search, $options: 'i' } },
                        { 'userDetails.name': { $regex: search, $options: 'i' } },
                        { 'userDetails.email': { $regex: search, $options: 'i' } }
                    ]
                }
            });
        }

        pipeline.push(
            { $sort: { createdAt: -1 } },
            {
                $facet: {
                    metadata: [{ $count: 'total' }],
                    data: [{ $skip: skip }, { $limit: limit }]
                }
            }
        );

        const result = await Student.aggregate(pipeline);
        const total = result[0].metadata[0]?.total || 0;
        const students = result[0].data;
        
        return { students, total, page, pages: Math.ceil(total / limit) };
    }

    async createWithSession(studentData, session) {
        return await Student.create([studentData], { session });
    }

    async update(id, updateData) {
        return await Student.findByIdAndUpdate(id, updateData, { new: true }).populate('user', '-password');
    }

    async delete(id) {
        return await Student.findByIdAndDelete(id);
    }
}

module.exports = new StudentRepository();
