const mongoose = require('mongoose');

async function checkLocal() {
    try {
        await mongoose.connect('mongodb://localhost:27017');
        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log('LOCAL_DBS:', dbs.databases.map(db => db.name));
        process.exit(0);
    } catch (err) {
        console.error('LOCAL_ERROR:', err.message);
        process.exit(1);
    }
}

checkLocal();
