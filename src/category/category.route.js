import express from "express";
import {
  createdCategory,
  getCategory,
  getCategoryById,
  updatedCategory,
  deletedCategory,
} from "./category.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/role.middleware.js";
import { errorHandler } from "../utils/error.js";
import validate from "../middlewares/validation.middleware.js";
import {
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema.js";

const router = express.Router();

router.get("/", errorHandler(getCategory));
router.get(
  "/:id",
  validate({ params: categoryIdSchema }),
  errorHandler(authenticateUser, checkPermission("read"), getCategoryById)
);
router.post(
  "/",
  validate({ body: createCategorySchema }),
  errorHandler(authenticateUser, checkPermission("create"), createdCategory)
);
router.put(
  "/:id",
  validate({ params: categoryIdSchema, body: updateCategorySchema }),
  errorHandler(authenticateUser, checkPermission("update"), updatedCategory)
);
router.delete(
  "/:id",
  validate({ params: categoryIdSchema }),
  errorHandler(authenticateUser, checkPermission("delete"), deletedCategory)
);

export default router;
