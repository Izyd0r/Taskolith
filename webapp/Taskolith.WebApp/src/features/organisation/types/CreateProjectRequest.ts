import { z } from 'zod'
import { CreateProjectScheme } from '@/features/organisation/validators/CreateProjectScheme'

export type CreateProjectRequest = z.infer<typeof CreateProjectScheme>
