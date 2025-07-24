import { z } from 'zod'

export const CreateOrganisationScheme = z.object({
    name: z.string()
        .trim()
        .nonempty("Organisation name is required")
        .max(100, "Organisation name must not exceed 100 characters")
})
