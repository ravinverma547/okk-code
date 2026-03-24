const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    enrollmentDate: { type: Date, default: Date.now },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'AT_RISK'], default: 'ACTIVE' },
    performanceScore: { type: Number, default: 0 },
    attendancePercentage: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
