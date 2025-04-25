import express from "express";
import { errorHandler } from "../../utils/error.js";
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

const router = express.Router();

router.post(
  "/",
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
  errorHandler(authenticateUser, checkPermission("delete"), deletedOrder)
);
router.put(
  "/update-status/:id",
  errorHandler(authenticateUser, checkPermission("update"), updateStatusOrder)
);
router.delete(
  "/delete-order-item/:id",
  errorHandler(authenticateUser, checkPermission("delete"), deletedOrderItems)
); //menghapus order item di order
router.get("/", errorHandler(getOrder));
router.get("/:id", errorHandler(getOrderById));
router.put(
  "/add-order-item/:id",
  errorHandler(authenticateUser, checkPermission("create"), addOrderItem)
); //menambah order item di order

export default router;
