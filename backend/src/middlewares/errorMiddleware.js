const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    console.error(`❌ Error (${statusCode}): ${err.message}`);
    if (env.NODE_ENV !== 'production') console.error(err.stack);
    
    res.status(statusCode);
    res.json({
        success: false,
        message: err.message,
        data: env.NODE_ENV === 'production' ? null : { stack: err.stack },
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
