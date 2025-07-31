import { type Task } from '@/features/project/types/Task'

export type KanbanColumn = {
    columnId: string
    columnName: string
    tasks: Task[]
}
