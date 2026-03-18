const env = require('./config/env');
const { httpServer } = require('./app');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const PORT = env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});
