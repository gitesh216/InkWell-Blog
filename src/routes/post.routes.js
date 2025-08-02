import { Router } from "express";
import {
    createPost,
    listPosts,
    viewPost,
    editPost,
    deletePost,
} from "../controllers/post.controller.js";
import { verifyApiKey, verifyJWT } from "../middlewares/auth.middleware.js";
import { isPostPending } from "../middlewares/post.middleware.js";

const router = Router();

router.post("/", verifyJWT, verifyApiKey, createPost);

router.get("/", verifyApiKey, listPosts);
router.get("/:postId", verifyApiKey, viewPost);

router.put("/:postId", verifyJWT, verifyApiKey, isPostPending, editPost);
router.delete("/:postId", verifyJWT, verifyApiKey, isPostPending, deletePost);

export default router;
