const Test = require('../models/Test');
const Student = require('../models/Student');

class TestRepository {
    async create(testData) {
        return await Test.create(testData);
    }

    async addResult(testId, studentId, marksObtained) {
        return await Test.findByIdAndUpdate(
            testId,
            { $push: { results: { student: studentId, marksObtained } } },
            { new: true }
        );
    }

    async getLeaderboard() {
        return await Test.aggregate([
            { $unwind: '$results' },
            {
                $group: {
                    _id: '$results.student',
                    avgMarks: { $avg: '$results.marksObtained' },
                    totalTests: { $sum: 1 }
                }
            },
            { $sort: { avgMarks: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'students',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'studentInfo'
                }
            },
            { $unwind: '$studentInfo' }
        ]);
    }
}

module.exports = new TestRepository();
