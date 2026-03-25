const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function findRavin() {
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
                const sample = await db.collection(col.name).findOne({ 
                    $or: [
                        { name: /ravin/i },
                        { firstName: /ravin/i },
                        { lastName: /ravin/i }
                    ]
                });
                if (sample) {
                    console.log(`FOUND! DB: ${dbName}, COL: ${col.name}, NAME: ${sample.name || sample.firstName}`);
                }
            }
        }
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

findRavin();
