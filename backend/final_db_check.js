const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function listDbs() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log('FINAL_DB_LIST:', dbs.databases.map(db => db.name));
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

listDbs();
