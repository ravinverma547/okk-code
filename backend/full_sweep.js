const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function fullSweep() {
    try {
        const client = await mongoose.connect(process.env.MONGODB_URI);
        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const dbs = await admin.listDatabases();
        
        console.log('--- FULL SWEEP ---');
        for (const dbInfo of dbs.databases) {
            const dbName = dbInfo.name;
            const db = mongoose.connection.useDb(dbName);
            const collections = await db.db.listCollections().toArray();
            
            for (const coll of collections) {
                const count = await db.collection(coll.name).countDocuments();
                if (count > 0) {
                    console.log(`DB: ${dbName} | Collection: ${coll.name} | Count: ${count}`);
                }
            }
        }
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

fullSweep();
