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
import { postRateLimiter } from "../libs/rate-limiter.js";
import { createPostSchema } from "../schemas/post.schema.js";
import { postValidate } from "../validators/post.validator.js";

const router = Router();

router.post("/", verifyJWT, verifyApiKey, postRateLimiter, postValidate(createPostSchema), createPost);

router.get("/", verifyApiKey, listPosts);
router.get("/:postId", verifyApiKey, viewPost);

router.put("/:postId", verifyJWT, verifyApiKey, isPostPending, postValidate(createPostSchema), editPost);
router.delete("/:postId", verifyJWT, verifyApiKey, isPostPending, deletePost);

export default router;
