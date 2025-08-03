import rateLimit from "express-rate-limit";

const authRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 requests per window per IP
    keyGenerator: (req) => req.ip, // Use IP for unauthenticated routes
    message: {
        status: 429,
        message: "Too many auth requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const postRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per window per API key
    keyGenerator: (req) => req.header("X-API-Key") || req.ip, // Use API key or fallback to IP
    message: {
        status: 429,
        message: "Too many requests, please try again later",
    },
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false,
});

export { authRateLimiter, postRateLimiter };
