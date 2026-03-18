const attendanceRepository = require('../repositories/attendanceRepository');
const studentRepository = require('../repositories/studentRepository');
const logger = require('../utils/logger');

class AttendanceService {
    async markAttendance(studentId, date, status) {
        const attendance = await attendanceRepository.mark({ student: studentId, date, status });
        
        // Update student attendance percentage
        const percentage = await attendanceRepository.calculatePercentage(studentId);
        await studentRepository.update(studentId, { attendancePercentage: percentage });
        
        // Trigger At-Risk check
        await require('./studentService').checkAtRiskStatus(studentId);
        
        logger.info(`Attendance marked for student ${studentId}: ${status}`);
        return attendance;
    }

    async getStudentAttendance(studentId) {
        return await attendanceRepository.findByStudent(studentId);
    }
}

module.exports = new AttendanceService();
