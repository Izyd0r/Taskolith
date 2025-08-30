import { z } from 'zod'

const RoleSchema = z.object({
    id: z.uuid(),
    organisationId: z.uuid(),
    name: z.string(),
    permissions: z.number(),
});

export const InviteMemberScheme = z.object({
    email: z.email({ message: "Invalid email address" }),
    dueDate: z.string().min(1, { message: "Expiry date is required" }), 
    initialRoles: z.array(RoleSchema).optional(),
})
