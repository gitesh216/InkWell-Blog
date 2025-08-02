import { asynchandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { db } from "../libs/db.js";

const listAllPendingPosts = asynchandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    const pendingPosts = await db.post.findMany({
        where: {
            status: "PENDING",
        },
    });
    if (!pendingPosts) {
        throw new ApiError(500, "Failed to fetch pending posts");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                pendingPosts,
                "Pending posts fetched successfully",
            ),
        );
});

const approvePost = asynchandler(async (req, res) => {
    const user = req.user;
    const postId = req.params.postId;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    if (!postId) {
        throw new ApiError(400, "Post id is required");
    }
    const post = await db.post.findUnique({
        where: {
            id: postId,
        },
    });
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    const updatedPost = await db.post.update({
        where: {
            id: postId,
        },
        data: {
            status: "APPROVED",
        },
    });
    if (!updatedPost) {
        throw new ApiError(500, "Failed to approve post");
    }
    const postReview = await db.postReview.create({
        data: {
            postId: postId,
            adminId: user.id,
            action: "REJECTED",
            comment: postComment ? postComment : "",
        },
    });
    if (!postReview) {
        throw new ApiError(500, "Failed to create post review");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { updatedPost, postReview },
                "Post approved successfully",
            ),
        );
});

const rejectPost = asynchandler(async (req, res) => {
    const user = req.user;
    const postId = req.params.postId;
    const postComment = req.body?.comment;

    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    if (!postId) {
        throw new ApiError(400, "Post id is required");
    }
    const post = await db.post.findUnique({
        where: {
            id: postId,
        },
    });
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    const updatedPost = await db.post.update({
        where: {
            id: postId,
        },
        data: {
            status: "REJECTED",
        },
    });
    if (!updatedPost) {
        throw new ApiError(500, "Failed to reject post");
    }
    const postReview = await db.postReview.create({
        data: {
            postId: postId,
            adminId: user.id,
            action: "REJECTED",
            comment: postComment ? postComment : "",
        },
    });
    if (!postReview) {
        throw new ApiError(500, "Failed to create post review");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { updatedPost, postReview },
                "Post rejected successfully",
            ),
        );
});

export { listAllPendingPosts, approvePost, rejectPost };
