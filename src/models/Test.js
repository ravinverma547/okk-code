const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    maxMarks: { type: Number, required: true },
    date: { type: Date, required: true },
    results: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        marksObtained: { type: Number, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
