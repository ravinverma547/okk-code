const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function linkTeacherToCourses() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'okk-code' });
        const Teacher = require('./src/models/Teacher');
        const User = require('./src/models/User');
        const Course = require('./src/models/Course');
        
        // Find a teacher user
        const teacherUser = await User.findOne({ role: 'TEACHER' });
        if (!teacherUser) {
            console.log('No teacher user found to link');
            process.exit(0);
        }
        
        // Find teacher profile
        let teacherProfile = await Teacher.findOne({ user: teacherUser._id });
        if (!teacherProfile) {
            console.log('No teacher profile found for user, creating one...');
            teacherProfile = await Teacher.create({
                user: teacherUser._id,
                teacherId: `TCH-${Date.now().toString().slice(-4)}`,
                subjects: ['Mathematics', 'Science'],
                qualification: 'M.Sc B.Ed',
                experience: '5'
            });
            await User.findByIdAndUpdate(teacherUser._id, { teacherProfile: teacherProfile._id });
        }
        
        // Find all courses
        const courses = await Course.find({});
        if (courses.length === 0) {
            console.log('No courses found to assign');
            process.exit(0);
        }
        
        // Assign all courses to this teacher for testing
        const courseIds = courses.map(c => c._id);
        teacherProfile.assignedCourses = courseIds;
        await teacherProfile.save();
        
        console.log(`Successfully linked Teacher "${teacherUser.name}" to ${courses.length} courses.`);
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

linkTeacherToCourses();
