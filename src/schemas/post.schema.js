const createPostSchema = z.object({
    body: z.object({
        title: z.string().min(3, "Title is required").max(255),
        content: z.string().min(10, "Content is required"),
        categoryId: z.string().uuid(),
    }),
});

const categorySchema = z.object({
    body: z.object({
        name: z.string().min(1, "Category name is required").max(50),
    }),
});

const approvePostSchema = z.object({
    params: z.object({
        postId: z.string().uuid(),
    }),
});

const rejectPostSchema = z.object({
    params: z.object({
        postId: z.string().uuid(),
    }),
    body: z.object({
        comment: z
            .string()
            .max(255, "Comment must be 255 characters or less")
            .optional(),
    }),
});

export { createPostSchema, categorySchema, approvePostSchema, rejectPostSchema };
