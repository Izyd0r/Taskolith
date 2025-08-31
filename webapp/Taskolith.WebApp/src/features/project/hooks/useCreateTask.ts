import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type CreateTaskRequest } from '@/features/project/types/CreateTaskRequest'
import { CreateTask } from '@/features/project/api/CreateTask'

export const useCreateTask = (organisationId: string, projectId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (variables: { kanbanColumnId: string, request: CreateTaskRequest }) =>
            CreateTask(organisationId, projectId, variables.kanbanColumnId, variables.request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['kanbanColumns', organisationId, projectId] })
        }
    })
}
