const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

async function listDBs() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const adminDb = client.db().admin();
        const dbs = await adminDb.listDatabases();
        console.log('Databases:', dbs.databases.map(db => db.name));
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    } finally {
        await client.close();
    }
}

listDBs();
