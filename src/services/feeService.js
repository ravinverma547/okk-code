const feeRepository = require('../repositories/feeRepository');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

class FeeService {

    async createFee(feeData) {
        const fee = await feeRepository.create(feeData);
        logger.info(`Fee record created for student: ${fee.student}`);
        return fee;
    }

    async getStudentFees(studentId) {
        return await feeRepository.findByStudent(studentId);
    }

    async markAsPaid(feeId, transactionId) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const fee = await feeRepository.findById(feeId, { session });

            if (!fee) throw new Error('Fee record not found');
            if (fee.status === 'PAID') throw new Error('Fee already paid');
            if (fee.amount <= 0) throw new Error('Invalid fee amount');

            const updatedFee = await feeRepository.update(
                feeId,
                {
                    status: 'PAID',
                    transactionId,
                    paymentDate: new Date()
                },
                { session }
            );

            await session.commitTransaction();

            logger.info(`Fee ${feeId} marked as PAID`, { transactionId });

            return updatedFee;

        } catch (error) {
            await session.abortTransaction();
            logger.error(`Payment failed for fee: ${feeId}`, error);
            throw error;
        } finally {
            session.endSession();
        }
    }

    async checkOverdueFees() {
        const overdueFees = await feeRepository.getOverdueFees();

        // Bulk update (better performance)
        await feeRepository.updateMany(
            { _id: { $in: overdueFees.map(f => f._id) } },
            { status: 'OVERDUE' }
        );

        return overdueFees;
    }

    // ✅ Better installment logic (no mismatch)
    async calculateInstallments(studentId, totalAmount, numInstallments = 3) {

        const baseAmount = Math.floor(totalAmount / numInstallments);
        const remainder = totalAmount % numInstallments;

        const installments = [];
        const today = new Date();

        for (let i = 0; i < numInstallments; i++) {
            const dueDate = new Date();
            dueDate.setMonth(today.getMonth() + i);

            let amount = baseAmount;

            // adjust last installment
            if (i === numInstallments - 1) {
                amount += remainder;
            }

            installments.push({
                student: studentId,
                amount,
                dueDate,
                installmentNumber: i + 1,
                status: 'PENDING'
            });
        }

        return await feeRepository.createMany(installments);
    }
}

module.exports = new FeeService();