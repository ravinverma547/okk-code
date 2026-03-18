const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: String }, // e.g., "6 Months"
    fees: { type: Number, required: true },
    batch: { type: String, required: true }, // e.g., "Morning A"
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
