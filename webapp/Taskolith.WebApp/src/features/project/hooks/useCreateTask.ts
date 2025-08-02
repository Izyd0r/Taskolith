import { useMutation } from '@tanstack/react-query'
import { type CreateTaskRequest } from '@/features/project/types/CreateTaskRequest'
import { CreateTask } from '@/features/project/api/CreateTask'

export const useCreateTask = (
    organisationId: string,
    projectId: string,
    kanbanColumnId: string
) => {
    return useMutation<void, Error, CreateTaskRequest>({
        mutationFn: (request) => CreateTask(organisationId, projectId, kanbanColumnId, request),
    })
}
