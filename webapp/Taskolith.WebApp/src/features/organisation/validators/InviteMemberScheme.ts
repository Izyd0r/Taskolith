import { z } from 'zod'

export const InviteMemberScheme = z.object({
    email: z.email({message: "Invalid email address"}),
    dueDate: z.iso.datetime({message: "Invalid datetime format"}),
})
