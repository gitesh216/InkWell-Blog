import { Router } from "express";
import {
    checkAdmin,
    verifyApiKey,
    verifyJWT,
} from "../middlewares/auth.middleware";

const router = Router();

router.get("/", verifyJWT, verifyApiKey, listAllCategories);
router.post("/", verifyJWT, verifyApiKey, checkAdmin, createCategory);

export default router;
