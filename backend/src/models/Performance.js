const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: String, required: true },
    marks: { type: Number, required: true },
    totalMarks: { type: Number, required: true, default: 100 },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['EXAM', 'ASSIGNMENT', 'QUIZ', 'ACTIVITY'], default: 'EXAM' },
    remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);
