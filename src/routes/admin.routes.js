import { Router } from "express";
import { verifyApiKey, verifyJWT } from "../middlewares/auth.middleware";
import {
    listAllPendingPosts,
    approvePost,
    rejectPost,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/posts", verifyJWT, verifyApiKey, checkAdmin, listAllPendingPosts);
router.get(
    "/posts/:postId/approve",
    verifyJWT,
    verifyApiKey,
    checkAdmin,
    approvePost,
);
router.get(
    "/posts/:postId/reject",
    verifyJWT,
    verifyApiKey,
    checkAdmin,
    rejectPost,
);

export default router;
