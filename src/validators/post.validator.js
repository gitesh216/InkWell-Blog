const postValidate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const formatted = result.error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    return res.status(400).json({ errors: formatted });
  }

  // Attach validated data to request for controller use
  req.validatedData = result.data;
  next();
};

export { postValidate };
