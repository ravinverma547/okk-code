const Performance = require('../models/Performance');
const Student = require('../models/Student');
const logger = require('../utils/logger');

class PerformanceService {
    async addRecord(data) {
        const record = await Performance.create(data);
        
        // Update student's average score if needed (business logic)
        const student = await Student.findById(data.student);
        if (student) {
            const allRecords = await Performance.find({ student: data.student });
            const avg = allRecords.reduce((acc, curr) => acc + (curr.marks / curr.totalMarks), 0) / allRecords.length * 100;
            student.performanceScore = Math.round(avg);
            await student.save();
        }
        
        logger.info(`Performance record added for student: ${data.student}`);
        return record;
    }

    async getStudentPerformance(studentId) {
        return await Performance.find({ student: studentId }).sort({ date: -1 });
    }

    async getAllPerformance() {
        return await Performance.find().populate({
            path: 'student',
            populate: { path: 'user', select: 'name email' }
        });
    }
}

module.exports = new PerformanceService();
