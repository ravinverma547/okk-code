const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

async function check(dbName) {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName });
        const count = await User.countDocuments();
        console.log(`DB: ${dbName}, COUNT: ${count}`);
        if (count > 0) {
            const user = await User.findOne({});
            console.log(`SAMPLE: ${user.email}`);
        }
        await mongoose.disconnect();
    } catch (err) {
        console.log(`DB: ${dbName}, ERROR: ${err.message}`);
    }
}

async function run() {
    await check('snapify');
    await check('test');
    await check('prisma_test');
    process.exit(0);
}

run();
