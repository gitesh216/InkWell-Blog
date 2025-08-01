import { asynchandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { db } from "../libs/db.js";

const isPostPending = asynchandler(async (req, res, next) => {
    const { userId } = req.user?.id;
    const { postId } = req.params;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    if (!postId) {
        throw new ApiError(401, "Post ID required");
    }
    const post = await db.post.findUnique({
        where: {
            id: postId,
        },
    });
    if (!post) {
        throw new ApiError(500, "Post not found");
    }
    if (post?.userId !== userId) {
        throw new ApiError(401, "Unauthorized");
    }
    if (post?.status !== "PENDING") {
        throw new ApiError(401, "Post is already published, cannot edit");
    }
    next();
});

export { isPostPending };
