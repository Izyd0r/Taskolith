import { type Member } from '@/features/organisation/types/Member'

export type Task = {
    id: string
    title: string
    description: string
    order: number
    dueDate: string
    createdDate: string
    completed: boolean
    assignedMembers: Member[]
}
