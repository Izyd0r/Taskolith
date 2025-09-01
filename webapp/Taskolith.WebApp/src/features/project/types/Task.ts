import { type TaskMember } from '@/features/project/types/TaskMember'
import { type PriorityValue } from '@/features/project/types/Priority'

export type Task = {
    taskId: string
    title: string
    description: string
    order: number
    dueDate: string
    createdDate: string
    completed: boolean
    assignedMembers: TaskMember[]
    priority: PriorityValue 
    kanbanColumnId: string
}

export type GetTasksResponse = {
    tasks: Task[]
}
