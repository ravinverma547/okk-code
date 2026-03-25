const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function migrateFees() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'okk-code' });
        
        // Using raw collection to avoid model restrictions
        const collection = mongoose.connection.db.collection('fees');
        
        const fees = await collection.find({ totalAmount: { $exists: false }, amount: { $exists: true } }).toArray();
        console.log(`Found ${fees.length} fees to migrate.`);
        
        for (const fee of fees) {
            await collection.updateOne(
                { _id: fee._id },
                { $set: { totalAmount: fee.amount } }
            );
        }
        
        console.log('Migration complete.');
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

migrateFees();
