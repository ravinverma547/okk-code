const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

class AttendanceRepository {
    async mark(attendanceData) {
        return await Attendance.findOneAndUpdate(
            { student: attendanceData.student, date: attendanceData.date },
            attendanceData,
            { upsert: true, new: true }
        );
    }

    async findByStudent(studentId) {
        return await Attendance.find({ student: studentId }).sort({ date: -1 });
    }

    async calculatePercentage(studentId) {
        const totalDays = await Attendance.countDocuments({ student: studentId });
        const presentDays = await Attendance.countDocuments({ student: studentId, status: 'PRESENT' });
        
        return totalDays === 0 ? 0 : (presentDays / totalDays) * 100;
    }

    async getLowAttendanceStudents(threshold = 75) {
        // This would ideally be a more complex aggregation, but for simplicity:
        const students = await Student.find({ attendancePercentage: { $lt: threshold } }).populate('user');
        return students;
    }
}

module.exports = new AttendanceRepository();
