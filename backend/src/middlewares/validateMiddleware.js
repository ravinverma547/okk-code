const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (e) {
        if (e.errors) {
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: e.errors.map(err => ({
                    path: err.path[err.path.length - 1],
                    message: err.message
                }))
            });
        }
        console.error("❌ Unexpected Validation Logic Error:", e);
        next(e);
    }
};

module.exports = validate;
