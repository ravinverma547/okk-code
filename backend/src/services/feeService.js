const feeRepository = require('../repositories/feeRepository');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

class FeeService {

    async createFee(feeData) {
        const fee = await feeRepository.create({
            ...feeData,
            totalAmount: feeData.amount || feeData.totalAmount // support both for compatibility during transition
        });
        logger.info(`Fee record created for student: ${fee.student}`);
        return fee;
    }

    async getStudentFees(studentId) {
        return await feeRepository.findByStudent(studentId);
    }

    async recordPayment(feeId, paidAmount, transactionId) {
        try {
            const fee = await feeRepository.findById(feeId);

            if (!fee) throw new Error('Fee record not found');
            if (fee.status === 'PAID') throw new Error('Fee already fully paid');
            if (paidAmount <= 0) throw new Error('Invalid payment amount');

            const newPaidAmount = (fee.paidAmount || 0) + Number(paidAmount);
            let newStatus = 'PARTIAL';
            
            if (newPaidAmount >= fee.totalAmount) {
                newStatus = 'PAID';
            }

            const updatedFee = await feeRepository.update(
                feeId,
                {
                    status: newStatus,
                    paidAmount: newPaidAmount,
                    transactionId,
                    paymentDate: new Date()
                }
            );

            logger.info(`Payment recorded for fee ${feeId}. Status: ${newStatus}`, { transactionId, paidAmount });

            return updatedFee;

        } catch (error) {
            logger.error(`Payment recording failed for fee: ${feeId}`, error);
            throw error;
        }
    }

    async updateStatus(feeId, status) {
        const updateData = { status };
        
        // If marking as PAID manually, ensure paidAmount matches totalAmount
        if (status === 'PAID') {
            const fee = await feeRepository.findById(feeId);
            if (fee) {
                updateData.paidAmount = fee.totalAmount;
                updateData.paymentDate = new Date();
            }
        } else if (status === 'PENDING') {
            updateData.paidAmount = 0;
            updateData.paymentDate = null;
        }

        return await feeRepository.update(feeId, updateData);
    }

    async getAllFees() {
        return await feeRepository.findAll();
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
                totalAmount: amount,
                installmentNumber: i + 1,
                status: 'PENDING',
                dueDate
            });
        }

        return await feeRepository.createMany(installments);
    }
}

module.exports = new FeeService();