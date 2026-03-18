const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Student = require('./src/models/Student');
const Course = require('./src/models/Course');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Student.deleteMany();
        await Course.deleteMany();

        // Create Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'ADMIN'
        });
        console.log('Admin created');

        // Create Courses
        const course1 = await Course.create({
            title: 'Full Stack Web Development',
            duration: '6 Months',
            fees: 50000,
            batch: 'Morning Alpha'
        });

        const course2 = await Course.create({
            title: 'Data Science & AI',
            duration: '8 Months',
            fees: 75000,
            batch: 'Evening Beta'
        });
        console.log('Courses created');

        // Create Student User
        const studentUser = await User.create({
            name: 'John Doe',
            email: 'student@example.com',
            password: 'password123',
            role: 'STUDENT'
        });

        // Create Student Profile
        const studentProfile = await Student.create({
            user: studentUser._id,
            studentId: 'STU001',
            courses: [course1._id],
            attendancePercentage: 85,
            performanceScore: 90
        });

        await User.findByIdAndUpdate(studentUser._id, { studentProfile: studentProfile._id });
        await Course.findByIdAndUpdate(course1._id, { $push: { students: studentProfile._id } });

        console.log('Sample data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
