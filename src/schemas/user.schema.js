// Zod schemas for each route
const registerSchema = z.object({
    username: z
        .string()
        .min(2, "Username must be at least 2 characters")
        .max(50),
    password: z.string().min(6, "Password must be at least 6 characters"),
    email: z.string().email("Provide a valid email"),
});

const loginSchema = z.object({
    email: z.string().email("Provide a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export { registerSchema, loginSchema };
