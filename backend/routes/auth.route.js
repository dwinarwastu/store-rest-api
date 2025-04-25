import express from "express";
import {
    register,
    login,
    logout,
    refreshToken,
    updateUser,
    updateRole,
} from "../controllers/auth.controller.js";
import { errorHandler } from "../../utils/error.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", errorHandler());
router.post("/login", errorHandler(login));
router.delete("/logout", errorHandler(logout));
router.post("/refresh-token", errorHandler(refreshToken));
router.put("/update-user", errorHandler(authenticateUser, updateUser));
router.put("/update-role", errorHandler(authenticateUser, updateRole));

export default router;
