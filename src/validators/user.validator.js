const userValidate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            errors: result.error.errors.map((e) => ({
                path: e.path.join("."),
                message: e.message,
            })),
        });
    }
    req.validatedData = result.data;
    next();
};

export { userValidate };
