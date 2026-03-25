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
    
    const atRiskData = await studentRepository.findAll({ status: 'AT_RISK' });
    const atRiskStudentsCount = atRiskData.total;
    const atRiskStudents = atRiskData.students.slice(0, 5);

    // Simulated trend data for Recharts
    const revenueTrend = [
        { month: 'Jan', revenue: monthlyRevenue * 0.8 },
        { month: 'Feb', revenue: monthlyRevenue * 0.9 },
        { month: 'Mar', revenue: monthlyRevenue }
    ];

    const attendanceTrend = [
        { day: 'Mon', attendance: 85 },
        { day: 'Tue', attendance: 88 },
        { day: 'Wed', attendance: 92 },
        { day: 'Thu', attendance: 90 },
        { day: 'Fri', attendance: 87 }
    ];

    sendResponse(res, 200, 'Dashboard statistics retrieved', {
        totalStudents,
        monthlyRevenue,
        pendingFees,
        atRiskStudentsCount,
        atRiskStudents,
        revenueTrend,
        attendanceTrend
    });
});

module.exports = { getDashboardStats };
