const EnrollmentRequest = require('../models/EnrollmentRequest');

class EnrollmentRequestRepository {
    async create(data) {
        return await EnrollmentRequest.create(data);
    }

    async findById(id) {
        return await EnrollmentRequest.findById(id).populate('student').populate('course');
    }

    async find(filters = {}) {
        return await EnrollmentRequest.find(filters).populate({
            path: 'student',
            populate: { path: 'user', select: 'name' }
        }).populate('course');
    }

    async update(id, updateData) {
        return await EnrollmentRequest.findByIdAndUpdate(id, updateData, { new: true });
    }
}

module.exports = new EnrollmentRequestRepository();
