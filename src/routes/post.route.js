import { Router } from "express";
import {
    createPost,
    listPosts,
    viewPost,
    editPost,
    deletePost
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isPostPending } from "../middlewares/post.middleware.js";

const router = Router();

router.post("/", verifyJWT, createPost);

router.get("/", listPosts);
router.get("/:postId", viewPost);

router.put("/:postId", verifyJWT, isPostPending, editPost);
router.delete("/", verifyJWT, isPostPending, deletePost);

export default router;