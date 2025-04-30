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
import validate from "../middlewares/validation.middleware.js";
import {
  createOutletSchema,
  outletIdSchema,
  updateOutletSchema,
} from "./outlet.schema.js";

const router = express.Router();

router.post(
  "/",
  validate({ body: createOutletSchema }),
  errorHandler(authenticateUser, checkPermission("create"), registerOutlet)
);
router.put(
  "/",
  validate({ body: updateOutletSchema }),
  errorHandler(authenticateUser, checkPermission("updated"), updatedOutlet)
);
router.delete(
  "/",
  errorHandler(authenticateUser, checkPermission("delete"), deleteOutlet)
);
router.get(
  "/:id",
  validate({ params: outletIdSchema }),
  errorHandler(getOutlet)
);
router.get("/", errorHandler(getOutlets));

export default router;
