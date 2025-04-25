import { BadRequestError } from "../../utils/error.js";

export const validasiProduct = (schema) => async (req, res, next) => {
    const body = req.body;
    try {
        await schema.validate(body);
        return next();
    } catch (error) {
        if (!res.headersSent) {
            throw new BadRequestError(error.message);
        }
        console.log("Headers already sent:", error.message);
    }
};
