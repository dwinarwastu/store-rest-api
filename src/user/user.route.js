import express from "express";
import { errorHandler } from "../../utils/error.js";
import {
  login,
  logout,
  refreshToken,
  register,
  updateRole,
  updateUser,
} from "./user.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import { registerSchema, updateUserSchema } from "./user.schema.js";

const router = express.Router();

router.post(
  "/register",
  validate({ body: registerSchema }),
  errorHandler(register)
);
router.post("/login", errorHandler(login));
router.delete("/logout", errorHandler(logout));
router.post("/refresh-token", errorHandler(refreshToken));
router.put(
  "/update-user",
  validate({ body: updateUserSchema }),
  errorHandler(authenticateUser, updateUser)
);
router.put("/update-role", errorHandler(authenticateUser, updateRole));

export default router;
