const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function checkTeacherData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'okk-code' });
        const Teacher = require('./src/models/Teacher');
        const User = require('./src/models/User');
        const Course = require('./src/models/Course');
        
        const teacherUser = await User.findOne({ email: 'TEACHER384@gmail.com' });
        if (!teacherUser) {
            console.log('Teacher user not found');
            process.exit(0);
        }
        
        const teacherProfile = await Teacher.findOne({ user: teacherUser._id }).populate('assignedCourses');
        console.log('TEACHER_PROFILE:');
        console.log(`- Name: ${teacherUser.name}`);
        console.log(`- Assigned Courses Count: ${teacherProfile ? teacherProfile.assignedCourses.length : 'No Profile'}`);
        
        if (teacherProfile && teacherProfile.assignedCourses.length > 0) {
            for (const course of teacherProfile.assignedCourses) {
                const studentCount = await mongoose.model('Student').countDocuments({ courses: course._id });
                console.log(`  * Course: ${course.name} | Students Enrolled: ${studentCount}`);
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

checkTeacherData();
