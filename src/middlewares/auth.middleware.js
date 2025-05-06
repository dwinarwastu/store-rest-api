import { UnauthorizedError } from "../utils/error.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    throw new UnauthorizedError("No token provided");
  }

  const accessToken = authHeader.split(" ")[1];

  const verifiedUser = verifyToken(accessToken, process.env.ACCESS_TOKEN);

  req.user = verifiedUser;

  next();
};
