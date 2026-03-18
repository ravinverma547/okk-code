const logger = {
    info: (msg, meta = {}) => {
        console.log(JSON.stringify({ level: 'INFO', timestamp: new Date().toISOString(), message: msg, ...meta }));
    },
    error: (msg, error = null) => {
        console.error(JSON.stringify({ 
            level: 'ERROR', 
            timestamp: new Date().toISOString(), 
            message: msg, 
            stack: error?.stack,
            ...(error && { error: error.message })
        }));
    },
    warn: (msg, meta = {}) => {
        console.warn(JSON.stringify({ level: 'WARN', timestamp: new Date().toISOString(), message: msg, ...meta }));
    },
    debug: (msg, meta = {}) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(JSON.stringify({ level: 'DEBUG', timestamp: new Date().toISOString(), message: msg, ...meta }));
        }
    }
};

module.exports = logger;
