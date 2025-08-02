import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

// Middleware to verify JWT token
export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.token ||
        req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) {
        return next(new ApiError(401, "No token provided"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.user.findUnique({
        where: { id: decoded.userId },
    });
    if (!user) {
        throw new ApiError(401, "Invalid token");
    }
    req.user = user;
    next();
});

// Middleware to verify API key
export const verifyApiKey = asyncHandler(async (req, res, next) => {
    const apiKey = req.header("X-API-Key");
    if (!apiKey) {
        throw new ApiError(401, "API key required");
    }

    const keyRecord = await db.apiKey.findUnique({
        where: { key: apiKey },
        include: { user: true },
    });

    if (!keyRecord) {
        throw new ApiError(403, "Invalid API key");
    }

    req.user = keyRecord.user;
    next();
});

export const checkAdmin = asyncHandler(async (req, res, next) => {
    const { userId } = req.user;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await db.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if (user.role !== "ADMIN") {
        throw new ApiError(403, "Forbidden");
    }
    next();
})
