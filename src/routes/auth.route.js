import { Router } from "express";
import {
    register,
    login,
    logout,
    generateApiKey,
    getProfile,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/api-key", generateApiKey);
router.get("/me", getProfile);

export default router;
