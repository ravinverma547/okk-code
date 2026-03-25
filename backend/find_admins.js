const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function findAdmins() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'okk-code' });
        const User = require('./src/models/User');
        const admins = await User.find({ role: { $in: ['ADMIN', 'TEACHER'] } }).select('name email role');
        console.log('ADMINS_AND_TEACHERS:');
        admins.forEach(u => console.log(`- ${u.name} (${u.email}): ${u.role}`));
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

findAdmins();
