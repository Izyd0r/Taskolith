import { z } from 'zod'

export const RoleSchema = z.object({
    name: z.string().min(1, 'Role name is required'),
    permissions: z.number().int(),
    membersId: z.array(z.uuid()).optional()
})

export type RoleRequest = z.infer<typeof RoleSchema>
