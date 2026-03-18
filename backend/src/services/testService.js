const Test = require('../models/Test');
const testRepository = require('../repositories/testRepository');
const studentRepository = require('../repositories/studentRepository');
const studentService = require('./studentService');
const logger = require('../utils/logger');

class TestService {

    // ✅ Create new test
    async createTest(testData) {
        const test = await testRepository.create(testData);
        logger.info(`Test created: ${test.title}`);
        return test;
    }

    // ✅ Submit student result
    async submitResult(testId, studentId, marks) {
        // Add result in test
        const test = await testRepository.addResult(testId, studentId, marks);

        // Calculate updated performance score
        const avgPerformance = await this.calculateStudentAvg(studentId);

        // Update student performance
        await studentRepository.update(studentId, {
            performanceScore: avgPerformance
        });

        // Check At-Risk status
        await studentService.checkAtRiskStatus(studentId);

        logger.info(`Result submitted for student ${studentId} in test ${testId}`);

        return test;
    }

    // ✅ Leaderboard (Top students)
    async getLeaderboard() {
        return await testRepository.getLeaderboard();
    }

    // ✅ Calculate student average performance (%)
    async calculateStudentAvg(studentId) {
        const results = await Test.find(
            { 'results.student': studentId },
            { results: 1, maxMarks: 1 }
        );

        if (!results || results.length === 0) return 0;

        let totalPercentage = 0;
        let count = 0;

        for (const test of results) {
            const res = test.results.find(
                r => r.student.toString() === studentId.toString()
            );

            // Safe calculation
            if (res && test.maxMarks > 0) {
                const percentage = (res.marksObtained / test.maxMarks) * 100;
                totalPercentage += percentage;
                count++;
            }
        }

        return count === 0 ? 0 : Number((totalPercentage / count).toFixed(2));
    }
}

module.exports = new TestService();