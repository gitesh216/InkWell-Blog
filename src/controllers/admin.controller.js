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
    const [updatedPost, postReview] = await db.$transaction([
        db.post.update({
            where: { id: postId },
            data: { status: "APPROVED" },
        }),
        db.postReview.create({
            data: {
                postId: postId,
                adminId: req.user.id,
                action: "APPROVED",
            },
        }),
    ]);
    if (!updatedPost || !postReview) {
        throw new ApiError(500, "Failed to approve post");
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
    const [updatedPost, postReview] = await db.$transaction([
        db.post.update({
            where: { id: postId },
            data: { status: "REJECTED" },
        }),
        db.postReview.create({
            data: {
                postId: postId,
                adminId: req.user.id,
                action: "REJECTED",
                comment: postComment ? postComment : "",
            },
        }),
    ]);
    if (!updatedPost || !postReview) {
        throw new ApiError(500, "Failed to reject post");
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
