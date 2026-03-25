const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function checkTestDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'test' });
        const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String }));
        const count = await User.countDocuments();
        console.log(`USERS_IN_TEST: ${count}`);
        if (count > 0) {
            const users = await User.find({}).limit(5);
            console.log('SAMPLES:', users.map(u => ({ email: u.email, role: u.role })));
        }
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

checkTestDB();
