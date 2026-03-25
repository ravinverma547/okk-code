const Fee = require('../models/Fee');
const Student = require('../models/Student');

class FeeRepository {
    async create(feeData) {
        return await Fee.create(feeData);
    }

    async createMany(fees) {
        return await Fee.insertMany(fees);
    }

    async findById(id) {
        return await Fee.findById(id);
    }

    async findByStudent(studentId) {
        return await Fee.find({ student: studentId }).sort({ dueDate: 1 });
    }

    async update(id, updateData, options = {}) {
        return await Fee.findByIdAndUpdate(id, updateData, { new: true, ...options });
    }

    async updateMany(filter, updateData) {
        return await Fee.updateMany(filter, updateData);
    }

    async getOverdueFees() {
        return await Fee.find({
            status: 'PENDING',
            dueDate: { $lt: new Date() }
        }).populate({
            path: 'student',
            populate: { path: 'user', select: 'name' }
        });
    }

    async getMonthlyRevenue() {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        return await Fee.aggregate([
            {
                $match: {
                    status: 'PAID',
                    paymentDate: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$paidAmount' }
                }
            }
        ]);
    }
    async findAll() {
        return await Fee.find().populate({
            path: 'student',
            populate: { path: 'user', select: 'name' }
        }).sort({ dueDate: -1 });
    }
}

module.exports = new FeeRepository();
