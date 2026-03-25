const mongoose = require('mongoose');

async function checkLocal() {
    try {
        console.log('Attempting to connect to local MongoDB...');
        await mongoose.connect('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connected to local MongoDB!');
        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log('LOCAL_DBS:', dbs.databases.map(db => db.name));
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }
}

checkLocal();
