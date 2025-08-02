import { z } from 'zod'
import { priorityValues } from '@/features/project/types/Priority'

const futureDate = z
    .string()
    .refine((val) => new Date(val) > new Date(), {
        message: "Due date must be in the future.",
    })

const prioritySchema = z.union(
    priorityValues.map((p) => z.literal(p)) as [z.ZodLiteral<number>, ...z.ZodLiteral<number>[]]
)

export const CreateTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, { message: "Title is required." })
        .max(256, { message: "Title must be at most 256 characters." }),
    description: z
        .string()
        .trim()
        .max(1024, { message: "Description must be at most 1024 characters." })
        .optional()
        .or(z.literal("")),
    dueDate: futureDate,
    assignedMembers: z
        .array(z.uuid({ message: "Assigned members contain invalid GUID(s)." }))
        .optional(),
    order: z
        .number()
        .min(1, { message: "Order must be 1 or greater." }),
    priority: prioritySchema,
})
