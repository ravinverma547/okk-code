const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the root .env file if it exists
dotenv.config({ path: path.join(__dirname, '../../../.env') });
// Also load from backend/.env if needed
dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = process.env;
