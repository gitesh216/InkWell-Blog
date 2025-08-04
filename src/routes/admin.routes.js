import { Router } from "express";
import { verifyApiKey, verifyJWT } from "../middlewares/auth.middleware";
import {
    listAllPendingPosts,
    approvePost,
    rejectPost,
} from "../controllers/admin.controller.js";
import { approvePostSchema, rejectPostSchema } from "../schemas/post.schema.js";
import { postValidate } from "../validators/post.validator.js";

const router = Router();

router.get("/posts", verifyJWT, verifyApiKey, checkAdmin, listAllPendingPosts);
router.get(
    "/posts/:postId/approve",
    verifyJWT,
    verifyApiKey,
    checkAdmin,
    postValidate(approvePostSchema),
    approvePost,
);
router.get(
    "/posts/:postId/reject",
    verifyJWT,
    verifyApiKey,
    checkAdmin,
    postValidate(rejectPostSchema),
    rejectPost,
);

export default router;
