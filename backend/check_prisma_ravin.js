const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function checkPrismaRavin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'prisma_test' });
        const user = await mongoose.connection.db.collection('User').findOne({ name: /ravin/i });
        console.log('PRISMA_RAVIN:', JSON.stringify(user, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

checkPrismaRavin();
