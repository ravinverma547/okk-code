const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function inspectSamples() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'test' });
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        for (const col of collections) {
            const sample = await mongoose.connection.db.collection(col.name).findOne({});
            console.log(`--- COLLECTION: ${col.name} ---`);
            console.log(JSON.stringify(sample, null, 2));
        }
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

inspectSamples();
