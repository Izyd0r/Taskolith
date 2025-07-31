import { z } from 'zod'

export const KanbanColumnScheme = z.object({
    name: z.string()
        .trim()
        .nonempty("Kanban column name is required")
        .min(3, "Kanban column name must be at least 3 characters long")
        .max(100, "Kanban column name must not exceed 100 characters")
})
