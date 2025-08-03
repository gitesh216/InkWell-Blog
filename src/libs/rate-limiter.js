import rateLimit from "express-rate-limit";

const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per window per IP
  keyGenerator: (req) => req.ip, // Use IP for unauthenticated routes
  message: { status: 429, message: 'Too many auth requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

export {
    authRateLimiter
}