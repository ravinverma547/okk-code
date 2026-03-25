const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function findOkkCode() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        
        for (const dbInfo of dbs.databases) {
            const dbName = dbInfo.name;
            if (['admin', 'local', 'config'].includes(dbName)) continue;
            
            const db = mongoose.connection.useDb(dbName);
            const collections = await db.db.listCollections().toArray();
            
            for (const col of collections) {
                if (col.name.includes('okk-code') || col.name.includes('okk_code')) {
                    console.log(`FOUND_COLLECTION! DB: ${dbName}, COL: ${col.name}`);
                }
                
                // ALSO search for a collection named 'users' that has SMS data
                if (col.name === 'users') {
                    const sample = await db.collection(col.name).findOne({ studentId: { $exists: true } });
                    if (sample) {
                         console.log(`FOUND_SMS_USERS! DB: ${dbName}, COL: users`);
                    }
                }
            }
        }
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

findOkkCode();
