const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function listAll() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'test' });
        const collections = await mongoose.connection.db.listCollections().toArray();
        const names = collections.map(c => c.name);
        console.log('ALL_COLLECTIONS:', names);
        
        for (const name of names) {
            const count = await mongoose.connection.db.collection(name).countDocuments();
            console.log(`COL: ${name}, COUNT: ${count}`);
        }
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

listAll();
