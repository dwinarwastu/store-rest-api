import express from "express";
import {
  createdCategory,
  getCategory,
  getCategoryById,
  updatedCategory,
  deletedCategory,
} from "./category.controller.js";
import { validasiCategory } from "../middlewares/category.middleware.js";
import { categorySchema } from "../validations/category.validation.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/role.middleware.js";
import { errorHandler } from "../../utils/error.js";

const router = express.Router();

router.get("/", errorHandler(getCategory));
router.get(
  "/:id",
  errorHandler(authenticateUser, checkPermission("read"), getCategoryById)
);
router.post(
  "/",
  errorHandler(
    authenticateUser,
    checkPermission("create"),
    validasiCategory(categorySchema),
    createdCategory
  )
);
router.put(
  "/:id",
  errorHandler(
    authenticateUser,
    checkPermission("update"),
    validasiCategory(categorySchema),
    updatedCategory
  )
);
router.delete(
  "/:id",
  errorHandler(authenticateUser, checkPermission("delete"), deletedCategory)
);

export default router;
