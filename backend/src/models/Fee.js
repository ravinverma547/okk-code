const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['PAID', 'PARTIAL', 'PENDING', 'OVERDUE'], default: 'PENDING' },
    transactionId: { type: String },
    paymentDate: { type: Date },
    installmentNumber: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
