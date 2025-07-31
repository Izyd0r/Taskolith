import { z } from 'zod'
import { KanbanColumnScheme } from '@/features/project/validators/KanbanColumnScheme'

export type CreateKanbanColumnRequest = z.infer<typeof KanbanColumnScheme>
