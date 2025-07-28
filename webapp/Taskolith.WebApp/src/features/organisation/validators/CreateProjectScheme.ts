import { z } from 'zod'

export const CreateProjectScheme = z.object({
    name: z.string()
        .trim()
        .nonempty("Project name is required")
        .min(3, "Project name must be at least 3 characters long")
        .max(50, "Project name must not exceed 50 characters"),
    description: z.string()
        .trim()
        .nonempty("Project description is required")
        .min(3, "Project description must be at least 3 characters long")
        .max(100, "Project description must not exceed 100 characters")
})
