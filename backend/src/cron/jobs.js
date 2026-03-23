const cron = require('node-cron');
const feeService = require('../services/feeService');
const logger = require('../utils/logger');

const initCronJobs = (io) => {
    // Daily Fee Reminder at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        logger.info('Running Daily Fee Check...');
        const overdueFees = await feeService.checkOverdueFees();
        if (overdueFees.length > 0) {
            io.emit('fee_due', { count: overdueFees.length });
            logger.info(`Notified ${overdueFees.length} overdue fees via Socket.`);
        }
    });

    // Monthly Report at midnight on the 1st
    cron.schedule('0 0 1 * *', () => {
        logger.info('Generating Monthly Performance Report...');
        // Logic for report generation
    });

    logger.info('Cron Jobs Initialized');
};

module.exports = initCronJobs;
