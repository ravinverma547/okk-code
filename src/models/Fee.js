const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['PAID', 'PENDING', 'OVERDUE'], default: 'PENDING' },
    transactionId: { type: String },
    paymentDate: { type: Date },
    installmentNumber: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
