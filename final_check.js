const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env
dotenv.config({ path: path.join(__dirname, 'backend/.env') });

const User = require(path.join(__dirname, 'backend/src/models/User'));

async function check() {
    try {
        console.log('URI:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'okk code' });
        console.log('CONNECTED TO:', mongoose.connection.name);
        const admin = await User.findOne({ role: 'ADMIN' });
        console.log('ADMIN:', admin ? admin.email : 'NONE');
        const count = await User.countDocuments();
        console.log('TOTAL_USERS:', count);
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

check();
