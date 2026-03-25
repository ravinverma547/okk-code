const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'okk-code' });
        const User = require('./src/models/User');
        const users = await User.find({}).select('name email role');
        console.log('USERS_AND_ROLES:');
        users.forEach(u => console.log(`- ${u.name} (${u.email}): ${u.role}`));
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

checkUsers();
