const validate =
  ({ body, file, query, params }) =>
  (req, res, next) => {
    try {
      console.log(req.body);
      console.log(req.file);
      if (body) req.body = body.parse(req.body);
      console.log(req.body);
      if (query) req.query = query.parse(req.query);
      if (params) req.params = params.parse(req.params);
      if (file) req.file = file.parse(req.file);
      console.log(req.file);

      next();
    } catch (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: Array.isArray(error.errors)
          ? error.errors.map((err) => ({
              path: Array.isArray(err.path)
                ? err.path.join(".")
                : err.path || null,
              message: err.message || String(err),
            }))
          : error.errors,
      });
    }
  };

export default validate;
