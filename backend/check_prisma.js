const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function checkPrisma() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'prisma_test' });
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('PRISMA_COLS:', collections.map(c => c.name));
        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`COL: ${col.name}, COUNT: ${count}`);
        }
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

checkPrisma();
