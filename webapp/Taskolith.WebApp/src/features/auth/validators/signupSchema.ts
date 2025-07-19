import { z } from 'zod';

export const signupScheme = z.object({
    username: z.string()
        .trim() 
        .nonempty("Username is required")
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must not exceed 20 characters long"),
    firstname: z.string()
        .trim() 
        .nonempty("First name is required")
        .max(20, "First name must not exceed 20 characters long"),
    lastname: z.string()
        .trim()        
        .nonempty("Last name is required")
        .max(20, "Last name must not exceed 20 characters long"),
    email: z.string()
        .trim()
        .nonempty("Email address is required")
        .regex(/^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9]+([._+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
    password: z.string()
        .trim()
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

