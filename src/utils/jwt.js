import jwt from "jsonwebtoken";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from "./error.js";

export const generateAccessToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
  } catch (error) {
    throw new InternalServerError("Failed generate access token");
  }
};

export const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.REFRESH_TOKEN, {
      expiresIn: "1d",
    });
  } catch (error) {
    throw new InternalServerError("Failed generate refresh token");
  }
};

export const decodeToken = (token) => {
  const decode = jwt.decode(token, { complete: true });
  if (!decode) throw new BadRequestError("Invalid or malformed token");
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError)
      throw new ForbiddenError("Token expired");

    if (error instanceof jwt.JsonWebTokenError)
      throw new UnauthorizedError("Invalid token");

    throw error;
  }
};
