const enrollmentRequestRepository = require('../repositories/enrollmentRequestRepository');
const courseService = require('./courseService');
const logger = require('../utils/logger');

class EnrollmentRequestService {
    async createRequest(studentId, courseId) {
        // Check if already requested
        const existing = await enrollmentRequestRepository.find({ student: studentId, course: courseId, status: 'PENDING' });
        if (existing.length > 0) throw new Error('Request already pending for this course');

        return await enrollmentRequestRepository.create({ student: studentId, course: courseId });
    }

    async getAllRequests(filters = {}) {
        return await enrollmentRequestRepository.find(filters);
    }

    async updateRequestStatus(requestId, status) {
        logger.info(`Updating request ${requestId} to ${status}`);
        const request = await enrollmentRequestRepository.findById(requestId);
        if (!request) {
            logger.error(`Request ${requestId} not found`);
            throw new Error('Request not found');
        }

        if (status === 'ACCEPTED') {
            logger.info(`Enrolling student ${request.student._id} in course ${request.course._id}`);
            // Enroll the student
            await courseService.enrollStudent(request.course._id, request.student._id);
        }

        request.status = status;
        await request.save();
        
        logger.info(`Enrollment request ${requestId} marked as ${status}`);
        return request;
    }
}

module.exports = new EnrollmentRequestService();
