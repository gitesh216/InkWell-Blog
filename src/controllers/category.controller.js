import { asynchandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { db } from "../libs/db.js";

const listAllCategories = asynchandler(async (req, res, next) => {
    const { userId } = req.user;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    const categories = await db.category.findMany();
    if (!categories) {
        throw new ApiError(500, "Failed to fetch categories");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, categories, "Categories fetched successfully"),
        );
});

const createCategory = asynchandler(async (req, res, next) => {
    const { userId } = req.user;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    const { name } = req.body;
    if (!name) {
        throw new ApiError(400, "Name is required");
    }
    const category = await db.category.create({
        data: {
            name,
        },
    });
    if (!category) {
        throw new ApiError(500, "Failed to create category");
    }
    return res
        .status(201)
        .json(new ApiResponse(201, category, "Category created successfully"));
});

export { listAllCategories, createCategory };
