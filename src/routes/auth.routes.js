import { Router } from "express";
import {
    register,
    login,
    logout,
    generateApiKey,
    getProfile,
} from "../controllers/auth.controller.js";
import { verifyApiKey, verifyJWT } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../libs/rate-limiter.js";
import { registerSchema, loginSchema } from "../schemas/user.schema.js";
import { userValidate } from "../validators/user.validator.js";

const router = Router();

router.post("/register", authRateLimiter, userValidate(registerSchema), register);
router.post("/login", authRateLimiter, userValidate(loginSchema), login);
router.get("/logout", verifyJWT, logout);

router.post("/api-key", verifyJWT, authRateLimiter, generateApiKey);

router.get("/me", verifyJWT, verifyApiKey, getProfile);

export default router;
