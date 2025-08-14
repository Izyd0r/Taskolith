import { z } from 'zod'

export const AssignMembersSchema = z.object({
    memberIds: z.array(z.uuid({ message: "Invalid member GUID" }))
})

export type AssignMembersRequest = z.infer<typeof AssignMembersSchema>
