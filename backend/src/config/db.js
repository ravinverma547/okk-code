const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log(`Connecting to MongoDB...`);
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'okk-code'
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.name}`);
        const User = require('../models/User');
        const Student = require('../models/Student');
        const Attendance = require('../models/Attendance');
        
        const userCount = await User.countDocuments();
        const studentCount = await Student.countDocuments();
        const attendanceCount = await Attendance.countDocuments();
        
        console.log(`📊 Data Stats: Users(${userCount}), Students(${studentCount}), Attendance(${attendanceCount})`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
