import { Router } from "express";
import {
    register,
    login,
    logout,
    generateApiKey,
    getProfile,
} from "../controllers/auth.controller.js";
import { verifyApiKey, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", verifyJWT, logout);

router.post("/api-key", verifyJWT, generateApiKey);

router.get("/me", verifyJWT, verifyApiKey, getProfile);

export default router;
