import { StatusCodes } from "http-status-codes";

export class APIError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class UnauthorizedError extends APIError {
    constructor(message = "Unathorized") {
        super(StatusCodes.UNAUTHORIZED, message);
    }
}

export class ForbiddenError extends APIError {
    constructor(message = "Forbidden") {
        super(StatusCodes.FORBIDDEN, message);
    }
}

export class InternalServerError extends APIError {
    constructor(message = "Internal Server Error") {
        super(StatusCodes.INTERNAL_SERVER_ERROR, message);
    }
}

export class NotFoundError extends APIError {
    constructor(message = "Not Found") {
        super(StatusCodes.NOT_FOUND, message);
    }
}

export class BadRequestError extends APIError {
    constructor(message = "Bad Request") {
        super(StatusCodes.BAD_REQUEST, message);
    }
}

export const errorHandler =
    (...middlewares) =>
    async (req, res, next) => {
        let index = 0;

        const nextMiddleware = async (err) => {
            if (err) {
                console.error(err);
                console.log(err instanceof APIError);
                if (err instanceof APIError) {
                    return res.status(err.statusCode).json({
                        success: false,
                        message: err.message,
                    });
                }

                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal Server Error",
                });
            }

            if (index >= middlewares.length || res.headersSent) {
                return;
            }

            const currentMiddleware = middlewares[index++];

            try {
                await currentMiddleware(req, res, nextMiddleware);
            } catch (error) {
                nextMiddleware(error);
            }
        };

        nextMiddleware();
    };
