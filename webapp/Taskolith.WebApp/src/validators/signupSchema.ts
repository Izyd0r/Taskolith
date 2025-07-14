import { z } from 'zod';

export const signupScheme = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must not exceed 20 characters long")
        .nonempty("Username is required"),
    firstname: z.string()
        .max(20, "First name must not exceed 20 characters long")
        .nonempty("First name is required"),
    lastname: z.string()
        .max(20, "Last name must not exceed 20 characters long")
        .nonempty("Last name is required"),
    email: z.string()
        .regex(/^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9]+([._+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/),
    password: z.string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .max(100, "Password must not exceed 100 characters long")
        .regex(/[A-Z]+/)
        .regex(/[a-z]+/)
        .regex(/[0-9]+/)
        .regex(/[\!\?\*\.\@]+/),
    confirmPassword: z.string(),
}).refine((data) => data.password == data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"]
})

