import { z } from 'zod'
import { CreateTaskSchema } from '@/features/project/validators/CreateTaskScheme'

export type CreateTaskRequest = z.infer<typeof CreateTaskSchema>

