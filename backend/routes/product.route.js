import express from "express";
import {
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
} from "../product/product.controller.js";
import { validasiProduct } from "../middlewares/product.middleware.js";
import { productSchema } from "../validations/product.validation.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/role.middleware.js";
import { errorHandler } from "../../utils/error.js";

const router = express.Router();

router.get("/search-product", errorHandler(searchProduct));
router.get("/", errorHandler(getProduct));
router.get(
    "/:id",
    errorHandler(authenticateUser, checkPermission("read"), getProductById)
);
router.post(
    "/",
    errorHandler(
        authenticateUser,
        checkPermission("create"),
        validasiProduct(productSchema),
        createProduct
    )
);
router.put(
    "/:id",
    errorHandler(
        authenticateUser,
        checkPermission("update"),
        validasiProduct(productSchema),
        updateProduct
    )
);
router.delete(
    "/:id",
    errorHandler(authenticateUser, checkPermission("delete"), deleteProduct)
);

export default router;
