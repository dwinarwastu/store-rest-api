import express from "express";
import { errorHandler } from "../utils/error.js";
import {
  createOrder,
  getOrder,
  getOrderOutlet,
  getOrderUser,
  updateStatusOrder,
  deletedOrder,
  deletedOrderItems,
  getOrderById,
  addOrderItem,
} from "../order/order.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/role.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
  addOrderItemsSchema,
  createOrderSchema,
  orderIdSchema,
  updateStatusOrderSchema,
} from "./order.schema.js";

const router = express.Router();

router.post(
  "/",
  validate({ body: createOrderSchema }),
  errorHandler(authenticateUser, checkPermission("create"), createOrder)
);
router.get(
  "/get-user-order",
  errorHandler(authenticateUser, checkPermission("read"), getOrderUser)
);
router.get(
  "/get-outlet-order",
  errorHandler(authenticateUser, checkPermission("read"), getOrderOutlet)
);
router.delete(
  "/:id",
  validate({ params: orderIdSchema }),
  errorHandler(authenticateUser, checkPermission("delete"), deletedOrder)
);
router.put(
  "/update-status/:id",
  validate({
    params: orderIdSchema,
    body: updateStatusOrderSchema,
  }),
  errorHandler(authenticateUser, checkPermission("update"), updateStatusOrder)
);
router.delete(
  "/delete-order-item/:id",
  validate({ params: orderIdSchema }),
  errorHandler(authenticateUser, checkPermission("delete"), deletedOrderItems)
);
router.get("/", errorHandler(getOrder));
router.get(
  "/:id",
  validate({ params: orderIdSchema }),
  errorHandler(getOrderById)
);
router.put(
  "/add-order-item/:id",
  validate({
    params: orderIdSchema,
    body: addOrderItemsSchema,
  }),
  errorHandler(authenticateUser, checkPermission("create"), addOrderItem)
);

export default router;
