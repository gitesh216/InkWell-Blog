import { asynchandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

// Register user
export const register = asynchandler(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await db.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });
    if (!user) {
        throw new ApiError(500, "Something went wrong");
    }
    res.status(201).json(
        new ApiResponse(201, user, "User registered successfully"),
    );
});

// Login user
export const login = asynchandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json(
        new ApiResponse(200, { user, token }, "Login successful"),
    );
});

// Logout user
export const logout = asynchandler(async (req, res) => {
    res.clearCookie("token");
    res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

// Get user profile
export const getProfile = asynchandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, apiKey: true },
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, user, "User profile fetched"));
});

// Generate API key for user
export const generateApiKey = asynchandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new Error("Unauthorized: No user found");
    }

    // Generate a secure, unique API key
    const apiKey = crypto.randomBytes(32).toString("hex");

    // Store the API key in the ApiKey table
    const newApiKey = await db.apiKey.create({
        data: {
            key: apiKey,
            userId: userId,
        },
    });

    // Respond with the generated API key
    res.status(200).json(
        new ApiResponse(200, newApiKey, "API key generated successfully"),
    );
});
