const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function checkRavin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'test' });
        const ravin = await mongoose.connection.db.collection('users').findOne({ email: 'ravin@gmail.com' });
        console.log('RAVIN_DOC:', JSON.stringify(ravin, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

checkRavin();
