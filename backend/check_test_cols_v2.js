const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function checkCollections() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'test' });
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const results = [];
        
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            results.push({ collection: col.name, count });
        }
        console.log(JSON.stringify(results, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

checkCollections();
