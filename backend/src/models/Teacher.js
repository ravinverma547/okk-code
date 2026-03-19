const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacherId: { type: String, required: true, unique: true },
    phone: { type: String },
    subjects: [{ type: String }],
    qualification: { type: String },
    experience: { type: String },
    assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
