const mongoose = require('mongoose');

async function checkGuess() {
    try {
        console.log('Attempting to connect to ravin.nuic2cf.mongodb.net...');
        await mongoose.connect('mongodb+srv://vermaravin384:ravin123@ravin.nuic2cf.mongodb.net/', { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connected to ravin cluster!');
        const admin = mongoose.connection.db.admin();
        const dbs = await admin.listDatabases();
        console.log('DBS:', dbs.databases.map(db => db.name));
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed:', err.message);
        process.exit(1);
    }
}

checkGuess();
