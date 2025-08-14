import { type Member } from '@/features/organisation/types/Member'
import { type PriorityValue } from '@/features/project/types/Priority'

export type Task = {
    taskId: string
    title: string
    description: string
    order: number
    dueDate: string
    createdDate: string
    completed: boolean
    assignedMembers: Member[]
    priority: PriorityValue 
    kanbanColumnId: string
}
