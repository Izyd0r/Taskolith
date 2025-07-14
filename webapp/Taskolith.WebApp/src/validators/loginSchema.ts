import { z } from 'zod';

export const loginScheme = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must not exceed 20 characters long")
        .nonempty("Username is required"),
    password: z.string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password must not exceed 100 characters long")
        .regex(/[A-Z]+/)
        .regex(/[a-z]+/)
        .regex(/[0-9]+/)
        .regex(/[\!\?\*\.\@]+/),
})

