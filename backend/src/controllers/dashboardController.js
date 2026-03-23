const studentRepository = require('../repositories/studentRepository');
const feeRepository = require('../repositories/feeRepository');
const asyncHandler = require('express-async-handler');
const sendResponse = require('../utils/apiResponse');

/**
 * @desc    Get dashboard analytics
 */
const getDashboardStats = asyncHandler(async (req, res) => {
    const studentData = await studentRepository.findAll();
    const totalStudents = studentData.total;
    const revenueData = await feeRepository.getMonthlyRevenue();
    const monthlyRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    
    const pendingFees = await feeRepository.getOverdueFees().then(f => f.length);
    
    const atRiskData = await studentRepository.findAll({ 
        $or: [
            { attendancePercentage: { $lt: 75 } },
            { performanceScore: { $lt: 40 } }
        ]
    });

    sendResponse(res, 200, 'Dashboard statistics retrieved', {
        totalStudents,
        monthlyRevenue,
        pendingFees,
        atRiskStudentsCount: atRiskData.total,
        atRiskStudents: atRiskData.students.slice(0, 5)
    });
});

module.exports = { getDashboardStats };
