import { Router } from "express";
import {
    checkAdmin,
    verifyApiKey,
    verifyJWT,
} from "../middlewares/auth.middleware";
import { categorySchema } from "../schemas/post.schema";
import { postValidate } from "../validators/post.validator";

const router = Router();

router.get("/", verifyJWT, verifyApiKey, listAllCategories);
router.post("/", verifyJWT, verifyApiKey, checkAdmin, postValidate(categorySchema), createCategory);

export default router;
