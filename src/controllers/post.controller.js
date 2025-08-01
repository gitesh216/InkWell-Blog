import { asynchandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { db } from "../libs/db.js";

// Create a new blof post
const createPost = asynchandler(async (req, res) => {
    const { title, content, categoryId } = req.body;
    const { userId } = req.user;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }
    const post = await db.post.create({
        data: {
            title,
            content,
            categoryId,
            userId: userId,
        },
    });
    if (!post) {
        throw new ApiError(500, "Failed to create post");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, post, "Post created successfully"));
});

// List published post (public)
const listPosts = asynchandler(async (req, res) => {
    const posts = db.post.findMany({
        where: {
            status: "APPROVED",
        },
    });
    if (!posts) {
        throw new ApiError(500, "Failed to fetch posts");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

// View a single post by id
const viewPost = asynchandler(async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        throw new ApiError(400, "Post id is required");
    }
    const post = await db.post.findUnique({
        where: {
            id: postId,
            status: "APPROVED",
        },
    });
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, post, "Post fetched successfully"));
});

// Edit a post (only bu author, if not approved)
const editPost = asynchandler(async (req, res) => {
    const { title, content, categoryId } = req.body;
    const { userId } = req.user;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    if (!title || !content) {
        throw new ApiError(400, "Title and content are required");
    }
    const post = await db.post.update({
        data: {
            title,
            content,
            categoryId,
            userId: userId,
        },
    });
    if (!post) {
        throw new ApiError(500, "Failed to update post");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, post, "Post updated successfully"));
});

// Delete a post (only by author, if not approved)
const deletePost = asynchandler(async (req, res) => {
    const { userId } = req.user;
    const { postId } = req.params;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    if (!postId) {
        throw new ApiError(400, "Post id is required");
    }
    const deletePost = await db.post.delete({
        where: {
            id: postId,
        },
    });
    if (!deletePost) {
        throw new ApiError(500, "Failed to delete post");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Post deleted successfully"));
});

export { createPost, listPosts, viewPost, editPost, deletePost };
