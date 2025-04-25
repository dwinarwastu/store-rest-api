import jwt from "jsonwebtoken";

export const generateAccessToken = (payload) => {
    try {
        return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
    } catch (error) {
        return null;
    }
};

export const generateRefreshToken = (payload) => {
    try {
        return jwt.sign(payload, process.env.REFRESH_TOKEN, {
            expiresIn: "1d",
        });
    } catch (error) {
        return null;
    }
};

export const decodeToken = (token) => {
    try {
        return jwt.decode(token, { complete: true });
    } catch (error) {
        return null;
    }
};

export const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};
