const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function deepScan() {
    try {
        const client = await mongoose.connect(process.env.MONGODB_URI);
        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const dbs = await admin.listDatabases();
        
        console.log('--- SCAN RESULTS ---');
        for (const dbInfo of dbs.databases) {
            const dbName = dbInfo.name;
            const db = mongoose.connection.useDb(dbName);
            const collections = await db.db.listCollections().toArray();
            const hasStudents = collections.find(c => c.name === 'students');
            
            if (hasStudents) {
                const count = await db.collection('students').countDocuments();
                console.log(`DB: ${dbName} | Students: ${count}`);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

deepScan();
