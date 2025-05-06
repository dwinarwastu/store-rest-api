import express from "express";
import {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
} from "./product.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/role.middleware.js";
import { errorHandler } from "../../utils/error.js";
import validate from "../middlewares/validation.middleware.js";
import {
  createProductSchema,
  imageProductSchema,
  productIdSchema,
  updateProductSchema,
} from "./product.schema.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/search-product", errorHandler(searchProduct));
router.get("/", errorHandler(getProduct));
router.get(
  "/:id",
  validate({ params: productIdSchema }),
  errorHandler(authenticateUser, checkPermission("read"), getProductById)
);
router.post(
  "/",
  upload.single("image"),
  validate({ body: createProductSchema, file: imageProductSchema }),
  errorHandler(authenticateUser, checkPermission("create"), createProduct)
);
router.put(
  "/:id",
  upload.single("image"),
  validate({
    params: productIdSchema,
    body: updateProductSchema,
    file: imageProductSchema,
  }),
  errorHandler(authenticateUser, checkPermission("update"), updateProduct)
);
router.delete(
  "/:id",
  validate({ params: productIdSchema }),
  errorHandler(authenticateUser, checkPermission("delete"), deleteProduct)
);

export default router;
