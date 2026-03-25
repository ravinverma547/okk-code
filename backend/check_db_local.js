const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'okk code' });
        console.log('CONNECTED_TO:', mongoose.connection.name);
        const users = await User.find({}).limit(5);
        console.log('SAMPLED_USERS:', users.map(u => ({ email: u.email, role: u.role })));
        const total = await User.countDocuments();
        console.log('TOTAL:', total);
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

check();
