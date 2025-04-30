import mongoose from "mongoose";
import { BadRequestError } from "../../utils/error.js";

const validate =
  ({ body, query, params }) =>
  (req, res, next) => {
    try {
      if (body) req.body = body.parse(req.body);
      if (query) req.query = query.parse(req.query);
      if (params) req.params = params.parse(req.params);

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
