import jwt from "jsonwebtoken";
import { ForbiddenError, UnauthorizedError } from "./error.js";

export const generateAccessToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
  } catch (error) {
    return error;
  }
};

export const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.REFRESH_TOKEN, {
      expiresIn: "1d",
    });
  } catch (error) {
    return error;
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    return error;
  }
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError)
      throw new ForbiddenError("Token expired");

    if (error instanceof jwt.JsonWebTokenError)
      throw new UnauthorizedError("Invalid token");

    throw error;
  }
};
