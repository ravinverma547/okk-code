const mongoose = require('mongoose');

const enrollmentRequestSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
    appliedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('EnrollmentRequest', enrollmentRequestSchema);
