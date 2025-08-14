import { z } from 'zod'
import { CreateTaskSchema } from '@/features/project/validators/CreateTaskScheme'

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
    isCompleted: z.boolean().optional(),
    kanbanColumnId: z.uuid().optional()
})

export type UpdateTaskRequest = z.infer<typeof UpdateTaskSchema>
