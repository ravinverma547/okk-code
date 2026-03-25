const mongoose = require('mongoose');
const User = require('./backend/src/models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, './backend/.env') });

const checkDB = async () => {
    try {
        console.log('CONNECTING TO:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('CONNECTED_SUCCESSFULLY');
        const dbName = mongoose.connection.name;
        console.log('DATABASE_NAME:', dbName);
        const count = await User.countDocuments();
        console.log('USER_COUNT:', count);
        process.exit(0);
    } catch (err) {
        console.error('CONNECTION_ERROR:', err.message);
        process.exit(1);
    }
};

checkDB();
