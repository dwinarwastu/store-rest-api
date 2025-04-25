import express from "express";
import {
  deleteOutlet,
  getOutlet,
  getOutlets,
  registerOutlet,
  updatedOutlet,
} from "./outlet.controller.js";
import { errorHandler } from "../../utils/error.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  errorHandler(authenticateUser, checkPermission("create"), registerOutlet)
);
router.put(
  "/",
  errorHandler(authenticateUser, checkPermission("updated"), updatedOutlet)
);
router.delete(
  "/",
  errorHandler(authenticateUser, checkPermission("delete"), deleteOutlet)
);
router.get("/", errorHandler(getOutlets));
router.get("/:id", errorHandler(getOutlet));

export default router;
