import { z } from 'zod'
import { CreateOrganisationScheme } from '@/features/dashboard/validators/CreateOrganisationScheme'

export type CreateOrganisationRequest = z.infer<typeof CreateOrganisationScheme>
