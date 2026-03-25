const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'test' });
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log('USERS_IN_TEST:', users.map(u => u.email));
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

checkUsers();
